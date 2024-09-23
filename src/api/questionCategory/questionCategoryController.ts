import authModel from "../auth/authModel";
import superQuestionCategoryModel from "../superQuestionCategory/superQuestionCategoryModel";
import userSuperCategoryModel from "../userSuperCategory/userSuperCategoryModel";
import questionCategoryModel from "./questionCategoryModel";
import { Request, Response } from "express";



const createQuestionCategory = async (req: Request, res: Response) => {
    try {
        const questionCategory = await questionCategoryModel.create({ ...req.body });
        console.log('questionCategory', questionCategory)

        if (!questionCategory) {
            res.status(400).json({ status: false, message: "Error for creating QuestionCategory" });
            return;
        }

        res.status(200).json({ status: true, message: "QuestionCategory data fetch successfully..", data: questionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllQuestionCategory = async (req: Request, res: Response) => {
    try {
        const questionCategory = await questionCategoryModel.find();

        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "QuestionCategory data not found" });
            return;
        }

        res.status(200).json({ status: true, totalRecords: await questionCategoryModel.countDocuments(), message: "QuestionCategory data fetch successfully..", data: questionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};
const getQuestionCategoryFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit, // Default limit
            start, // Default start
            categoryName,

        } = req.body;

        const filter: any = {};

        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");

            // Array to hold search conditions
            const searchConditions = [
                { categoryName: searchRegex },

            ];

            filter.$or = searchConditions;
        }

        // Additional filters for specific fields
        if (categoryName) {
            filter.categoryName = new RegExp(categoryName, "i");
        }


        const questionCategory = await questionCategoryModel.find(filter).skip(parseInt(start)).limit(parseInt(limit));

        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Question Category data not found" });
            return;
        }

        res
            .status(200)
            .json({
                status: true,
                totalRecords: await questionCategoryModel.countDocuments(filter),
                message: "Question category data fetch successfully..",
                data: questionCategory,
            });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllMinorQuestionCategoryByUserId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: `User od id ${id} is not found..` })
        }


        const userSuperCategory = await userSuperCategoryModel.findOne({ userId: id }).select("superQuestionCategoryId")
        if (!userSuperCategory) {
            return res.status(400).json({ status: false, message: "this minor user does not selected superCategory" })
        }


        const superQuestionCategory = await superQuestionCategoryModel.findById(userSuperCategory.superQuestionCategoryId).populate("questionCategories");
        if (!superQuestionCategory) {
            return res.status(404).json({ status: false, message: `userSuperCategory for user id ${id} is not found` })
        }

        res.status(200).json({ status: true, totalRecords: await questionCategoryModel.countDocuments(), message: "QuestionCategory data fetch successfully..", data: superQuestionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};



const getQuestionCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const questionCategory = await questionCategoryModel.findById(id);

        if (!questionCategory) {
            res.status(404).json({ status: false, message: `QuestionCategory data of questionCategoryID ${id} not found` });
            return;
        }

        res.status(200).json({ status: true, message: "QuestionCategory data fetch successfully..", data: questionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateQuestionCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const questionCategory = await questionCategoryModel.findByIdAndUpdate(id, { ...req.body });

        if (!questionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated QuestionCategory data of questionCategoryID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "QuestionCategory data updated successfully..", data: questionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteQuestionCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const questionCategory = await questionCategoryModel.findByIdAndDelete(id);

        if (!questionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated QuestionCategory data of questionCategoryID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "QuestionCategory data updated successfully..", data: questionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};



export { createQuestionCategory, getAllQuestionCategory, getQuestionCategoryFilters, getAllMinorQuestionCategoryByUserId, getQuestionCategoryById, updateQuestionCategoryById, deleteQuestionCategoryById }