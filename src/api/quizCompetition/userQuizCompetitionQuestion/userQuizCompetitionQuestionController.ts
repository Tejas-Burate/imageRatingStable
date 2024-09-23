import { Request, Response } from "express";
import mongoose from "mongoose";
import userQuizCompetitionQuestionModel from "./userQuizCompetitionQuestionModel";


const getAllUserQuizCompetitionQuestion = async (req: Request, res: Response) => {
    try {
        const userQuizCompetitionQuestion = await userQuizCompetitionQuestionModel.find();
        if (userQuizCompetitionQuestion.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: userQuizCompetitionQuestion.length, data: userQuizCompetitionQuestion });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const getUserQuizCompetitionQuestionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const userQuizCompetitionQuestion = await userQuizCompetitionQuestionModel.findById(id);
        if (!userQuizCompetitionQuestion) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", data: userQuizCompetitionQuestion });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}

const getTopFiveResult = async (req: Request, res: Response) => {
    try {
        const { quizId } = req.body;

        // Convert quizId to ObjectId
        const objectIdQuizId = new mongoose.Types.ObjectId(quizId);

        // Fetch the top five users with the most correct answers and the least time taken
        const topFiveResults = await userQuizCompetitionQuestionModel.aggregate([
            {
                $match: { quizId: objectIdQuizId } // Filter by quizId
            },
            {
                $group: {
                    _id: "$userId", // Group by `userId` to aggregate results for each user
                    correctAnswers: { $sum: { $cond: [{ $eq: ["$isCorrect", true] }, 1, 0] } }, // Count of correct answers
                    totalTimeTaken: { $sum: { $cond: [{ $eq: ["$isCorrect", true] }, "$timeTaken", 0] } }, // Sum of time taken for correct answers
                }
            },
            {
                $sort: { correctAnswers: -1, totalTimeTaken: 1 } // Sort by correct answers (desc) and total time taken (asc)
            },
            {
                $limit: 5 // Limit the result to the top 5 users
            },
            {
                $lookup: {
                    from: 'auths', // The collection to join
                    localField: '_id', // The field from the input documents
                    foreignField: '_id', // The field from the documents of the "from" collection
                    as: 'userDetails' // The output array field
                }
            },
            {
                $unwind: '$userDetails' // Unwind the array to deconstruct the userDetails array
            },
            {
                $addFields: {
                    userId: '$_id' // Add the `userId` field
                }
            },
            {
                $sort: { correctAnswers: -1, totalTimeTaken: 1 } // Sort again to maintain order after lookup
            }
        ]);

        // Add rank to the result
        const rankedResults = topFiveResults.map((result, index) => ({
            rank: index + 1,
            userId: result.userId,
            correctAnswers: result.correctAnswers,
            totalTimeTaken: result.totalTimeTaken,
            userDetails: {
                fullName: result.userDetails.fullName,
                email: result.userDetails.email
            }
        }));

        if (rankedResults.length === 0) {
            return res.status(404).json({ status: false, message: "No top users found" });
        }

        return res.status(200).json({ status: true, message: "Top 5 users fetched successfully", data: rankedResults });
    } catch (error) {
        console.log('Error fetching top five results:', error);
        return res.status(500).json({ status: false, message: "Internal server error", error });
    }
};


const getQuizCompetitionResultByUser = async (req: Request, res: Response) => {
    try {
        const { userId, quizId, sessionId } = req.body;

        // Fetch the user's quiz competition results
        const userResult = await userQuizCompetitionQuestionModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    quizId: new mongoose.Types.ObjectId(quizId),
                    sessionId: new mongoose.Types.ObjectId(sessionId),
                }
            },
            {
                $group: {
                    _id: "$userId", // Group by `userId` to aggregate results for each user
                    UnAttempted: { $sum: { $cond: [{ $eq: ["$status", "UnAttempted"] }, 1, 0] } }, // Count of correct answers
                    correctAnswers: { $sum: { $cond: [{ $eq: ["$status", "CorrectlyAnswered"] }, 1, 0] } }, // Count of correct answers
                    incorrectAnswers: { $sum: { $cond: [{ $eq: ["$status", "WronglyAnswered"] }, 1, 0] } } // Count of incorrect answers
                }
            }
        ]);


        if (userResult.length === 0) {
            return res.status(404).json({ status: false, message: "No results found for the specified user and session" });
        }

        return res.status(200).json({ status: true, message: "User's quiz competition results fetched successfully", data: userResult });
    } catch (error) {
        console.log('Error fetching quiz competition results:', error);
        return res.status(500).json({ status: false, message: "Internal server error", error });
    }
};



export { getAllUserQuizCompetitionQuestion, getUserQuizCompetitionQuestionById, getTopFiveResult, getQuizCompetitionResultByUser }