import { Request, Response } from "express";
import mongoose from "mongoose";
import userQuestionMappingModel from "../userQuestionMapping/userQuestionMappingModel";
import { startOfDay, subDays, subWeeks, subMonths } from "date-fns";
import authModel from "../auth/authModel";
import questionModel from "../questions/questionModel"
import documents from "razorpay/dist/types/documents";


const mostTrendingCategory = async (req: Request, res: Response) => {
    try {
        const statistics = await userQuestionMappingModel.aggregate([
            {
                $group: {
                    _id: "$categoryId",
                    totalQuestionsAttempted: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "questioncategories", // The collection name in your MongoDB
                    localField: "_id", // Use the _id from the group stage which is categoryId
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails" // Unwind the array returned by the lookup
            },
            {
                $project: {
                    _id: 0, // Hide the original _id (categoryId)
                    categoryName: "$categoryDetails.categoryName",
                    imgUrl: "$categoryDetails.compImgUrl",
                    totalQuestionsAttempted: 1
                }
            }
        ]);

        res.status(200).json({ status: true, message: "data fetch successfully", data: statistics.sort((a, b) => b.totalQuestionsAttempted - a.totalQuestionsAttempted) })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error })

    }
}

const userRegistrationStatistics = async (req: Request, res: Response) => {
    try {
        const today = startOfDay(new Date());
        const lastWeek = subWeeks(today, 1);
        const lastMonth = subMonths(today, 1);

        const statistics = await authModel.aggregate([
            {
                $facet: {
                    recent: [
                        { $match: { createdAt: { $gte: today } } },
                        { $count: "totalRegistrations" }
                    ],
                    weekly: [
                        { $match: { createdAt: { $gte: lastWeek } } },
                        { $count: "totalRegistrations" }
                    ],
                    monthly: [
                        { $match: { createdAt: { $gte: lastMonth } } },
                        { $count: "totalRegistrations" }
                    ]
                }
            },
            {
                $project: {
                    recentTotal: { $arrayElemAt: ["$recent.totalRegistrations", 0] },
                    weeklyTotal: { $arrayElemAt: ["$weekly.totalRegistrations", 0] },
                    monthlyTotal: { $arrayElemAt: ["$monthly.totalRegistrations", 0] }
                }
            }
        ]);

        res.status(200).json({ status: true, message: "Data fetched successfully", data: statistics[0] });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
};

const difficultyLevelStatisticsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;

        const statistics = await userQuestionMappingModel.aggregate([
            {
                $match: {
                    categoryId: new mongoose.Types.ObjectId(categoryId),
                }
            },
            {
                $lookup: {
                    from: "questions", // The collection name where difficultyLevel is stored
                    localField: "questionId", // Assuming userQuestionMappingModel has a questionId field
                    foreignField: "_id",
                    as: "questionDetails"
                }
            },
            {
                $unwind: "$questionDetails" // Unwind the array returned by the lookup
            },
            {
                $group: {
                    _id: {
                        difficultyLevel: "$questionDetails.difficultyLevel"
                    },
                    totalQuestionsSolved: { $sum: 1 }
                }
            },
            {
                $sort: { totalQuestionsSolved: -1 } // Sort by total questions solved in descending order
            },
            {
                $project: {
                    _id: 0,
                    difficultyLevel: "$_id.difficultyLevel",
                    totalQuestionsSolved: 1
                }
            }
        ]);

        // Step 2: Calculate rank manually
        const rankedStatistics = statistics.map((stat, index) => ({
            ...stat,
            rank: index + 1
        }));

        res.status(200).json({ status: true, message: "Data fetched successfully", data: rankedStatistics });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
};

const updateQuestionOwnerInBulk = async (req: Request, res: Response) => {
    try {
        const { oldOwnerId, newOwnerId } = req.body;

        if (!oldOwnerId || !newOwnerId) {
            return res.status(400).json({ status: false, message: "Old and new owner IDs are required" });
        }

        const oldOwnerObjectId = oldOwnerId;
        const newOwnerObjectId = newOwnerId;
        const result = await questionModel.updateMany(
            { questionOwner: oldOwnerObjectId }, // Filter criteria
            { $set: { questionOwner: newOwnerObjectId } } // Update operation
        );
        res.status(200).json({
            status: true,
            message: "Question owners updated successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error updating question owners:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
};

const updateSelectedQuestionsQuestionOwner = async (req: Request, res: Response) => {
    try {
        const { oldOwnerId, newOwnerId, selectedQuestionIds } = req.body;

        if (!oldOwnerId || !newOwnerId) {
            return res.status(400).json({ status: false, message: "Old and new owner IDs are required" });
        }

        const oldOwnerObjectId = oldOwnerId;
        const newOwnerObjectId = newOwnerId;


        const result = await questionModel.updateMany(
            {
                questionOwner: oldOwnerObjectId,
                _id: { $in: selectedQuestionIds }
            },
            { $set: { questionOwner: newOwnerObjectId } } // Update operation
        );

        res.status(200).json({
            status: true,
            message: "Question owners updated successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error updating question owners:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
};


export { mostTrendingCategory, userRegistrationStatistics, difficultyLevelStatisticsByCategory, updateQuestionOwnerInBulk, updateSelectedQuestionsQuestionOwner };