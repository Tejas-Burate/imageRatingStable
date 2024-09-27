import { Request, Response } from "express";
import quizModel from "./quizModel";

const createQuiz = async (req: Request, res: Response) => {
    try {
        const { quizStartDateAndTime, ...body } = req.body;

        if (!quizStartDateAndTime) {
            return res.status(400).json({ status: false, message: "registrationStartDate is required" });
        }

        const startDate = new Date(quizStartDateAndTime);
        const registrationEndDate = new Date(startDate.getTime() - 15 * 60 * 1000);
        const quizEndDateAndTime = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

        const quizData = {
            ...body,
            quizStartDateAndTime,
            registrationEndDate: registrationEndDate,
            quizEndDateAndTime: quizEndDateAndTime
        };
        const quiz = await quizModel.create(quizData);
        quiz.registrationStartDate = quiz.createdAt;
        quiz.save()

        if (!quiz) {
            return res.status(400).json({ status: false, message: "Failed to create new quiz" });
        }

        res.status(201).json({ status: true, message: "Quiz created successfully", data: quiz });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
}





// const createQuiz = async (req: Request, res: Response) => {
//     try {
//         const quiz = await quizModel.create({ ...req.body });
//         if (!quiz) {
//             return res.status(400).json({ status: false, message: "Failed to created new quiz" });
//         }
//         res.status(201).json({ status: true, message: "Quiz created successfully", data: quiz });
//     } catch (error) {
//         console.log('error', error)
//         res.status(500).json({ status: false, error: "Internal server error", message: error })
//     }
// }

const getQuizById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const quiz = await quizModel.findById(id);
        if (!quiz) {
            return res.status(404).json({ status: false, message: "Quiz data not found" });
        }
        res.status(200).json({ status: true, message: "Quiz data fetch successfully", data: quiz });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, error: "Internal server error", message: error })
    }
}
const getAllQuiz = async (req: Request, res: Response) => {
    try {

        const quiz = await quizModel.find();
        if (!quiz) {
            return res.status(404).json({ status: false, message: "Quiz data not found" });
        }
        res.status(200).json({ status: true, message: "Quiz created successfully", data: quiz });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, error: "Internal server error", message: error })
    }
}
const getQuizFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit, // Default limit
            start, // Default start
            quizName,
            quizDescription,
            totalQuestions,
            quizTime
        } = req.body;

        const filter: any = {};

        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");

            // Array to hold search conditions for string fields
            const searchConditions = [
                { quizName: searchRegex },
                { quizDescription: searchRegex },
            ];

            filter.$or = searchConditions;
        }

        // Additional filters for specific fields
        if (quizName) {
            filter.quizName = new RegExp(quizName, "i");
        }
        if (quizDescription) {
            filter.quizDescription = new RegExp(quizDescription, "i");
        }
        if (totalQuestions) {
            filter.totalQuestions = Number(totalQuestions);
        }
        if (quizTime) {
            filter.quizTime = Number(quizTime);
        }

        const questionCategory = await quizModel.find(filter).skip(Number(start)).limit(Number(limit));

        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Quiz Competition Category data not found" });
            return;
        }

        res.status(200).json({
            status: true,
            totalRecords: await quizModel.countDocuments(filter),
            message: "Quiz Competition category data fetch successfully.",
            data: questionCategory,
        });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
};

const updateQuizById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const quiz = await quizModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!quiz) {
            return res.status(400).json({ status: false, message: "Failed to update the quiz" });
        }
        res.status(200).json({ status: true, message: "Quiz updated successfully", data: quiz });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, error: "Internal server error", message: error })
    }
}
const deleteQuizById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const quiz = await quizModel.findByIdAndDelete(id);
        if (!quiz) {
            return res.status(400).json({ status: false, message: "Failed to delete the quiz" });
        }
        res.status(200).json({ status: true, message: "Quiz deleted successfully", data: quiz });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, error: "Internal server error", message: error })
    }
}

export { createQuiz, getQuizById, getAllQuiz, getQuizFilters, updateQuizById, deleteQuizById }