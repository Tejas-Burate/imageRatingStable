import userQuestionMappingModel from "./userQuestionMappingModel";
import { Request, Response } from "express";
import mongoose from "mongoose";
import settingsModel from "../setting/settingModel";
import categoryModel from "../questionCategory/questionCategoryModel"
import session from "../../shared/utils/session";
import { ObjectId } from 'mongoose';
import sessionModel from "../session/sessionModel";
import authModel from "../auth/authModel";

const { getRecentThreeSessions } = session;

const createUserQuestionMapping = async (req: Request, res: Response) => {
    try {
        const user = await userQuestionMappingModel.create({ ...req.body });

        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating UserQuestionMapping" });
            return;
        }

        res.status(201).json({ status: true, message: "UserQuestionMapping data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllUserQuestionMapping = async (req: Request, res: Response) => {
    try {
        const user = await userQuestionMappingModel.find();

        if (user.length === 0) {
            res.status(404).json({ status: false, message: "UserQuestionMapping data not found" });
            return;
        }

        res.status(200).json({ status: true, totalRecords: await userQuestionMappingModel.countDocuments(), message: "UserQuestionMapping data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getCategoryStatistics = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Assuming `userId` is passed as a URL parameter
        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: `User of id ${id} is not found` })
        }
        const statistics = await userQuestionMappingModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: "$categoryId",
                    totalQuestions: { $sum: 1 }
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
                    orgImgUrl: "$categoryDetails.orgImgUrl",
                    compImgUrl: "$categoryDetails.compImgUrl",
                    totalQuestions: 1
                }
            }
        ]);

        const maxQuestionsObject = statistics.reduce((maxObj, currentObj) => {
            return currentObj.totalQuestions > maxObj.totalQuestions ? currentObj : maxObj;
        }, statistics[0]);

        return res.status(200).json({ status: 200, maxQuestionsObject: maxQuestionsObject, data: statistics.sort((a, b) => b.totalQuestions - a.totalQuestions) });
    } catch (error) {
        console.error("Error in getCategoryStatistics:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error", error });
    }
};

const getCategoryPoints = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: `User of id ${id} is not found` })
        }

        const settings = await settingsModel.find();
        const pointsPerCorrectAnswer = settings ? settings[0].correctAnswerPoints : 10;
        const points = await userQuestionMappingModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id),
                    isCorrect: true
                }
            },
            {
                $group: {
                    _id: "$categoryId",
                    totalPoints: { $sum: pointsPerCorrectAnswer }
                }
            },
            {
                $lookup: {
                    from: "questioncategories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 0,
                    categoryName: "$categoryDetails.categoryName",
                    orgImgUrl: "$categoryDetails.orgImgUrl",
                    compImgUrl: "$categoryDetails.compImgUrl",
                    totalPoints: 1
                }
            }
        ]);


        const totalPoints = points.reduce((totalPoints, p) => totalPoints + p.totalPoints, 0)

        return res.status(200).json({ status: 200, totalPoints: totalPoints, data: points.sort((a, b) => b.totalPoints - a.totalPoints) });
    } catch (error) {
        console.error("Error in getCategoryPoints:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error", error });
    }
};


const getUserQuestionMappingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await userQuestionMappingModel.findById(id);

        if (!user) {
            res.status(404).json({ status: false, message: `UserQuestionMapping data of userID ${id} not found` });
            return;
        }

        res.status(200).json({ status: true, message: "UserQuestionMapping data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateUserQuestionMappingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await userQuestionMappingModel.findByIdAndUpdate(id, { ...req.body });

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated UserQuestionMapping data of userID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "UserQuestionMapping data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteUserQuestionMappingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await userQuestionMappingModel.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated UserQuestionMapping data of userID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "UserQuestionMapping data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getSubmittedQuestions = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;


        if (!sessionId) {
            return res.status(400).json({
                status: false,
                message: "Missing required parameter: sessionId."
            });
        }

        const session = await sessionModel.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                status: false,
                message: `Session with ID ${sessionId} not found.`
            });
        }

        const user = await authModel.findById(session.userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: `User with ID ${session.userId} not found.`
            });
        }

        let message: string | null = null;
        let count = 0;

        if (!user.subscription) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const todayQuestions = await userQuestionMappingModel.find({
                userId: session.userId,
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            }).sort({ createdAt: -1 }).exec();

            if (todayQuestions.length >= 10) {
                message = "You have reached your 10 quiz limit. Please subscribe for unlimited quizzes.";
            } else if (todayQuestions.length >= 5) {
                message = "You have 5 quizzes left for today.";
            }
        }

        const submittedQuestions = await userQuestionMappingModel.find({
            sessionId: sessionId
        }).populate({
            path: "questionId",
            select: "orgImgUrl compImgUrl"
        });

        submittedQuestions.forEach((item) => {
            if (item.isCorrect === true) {
                count += 10;
            }
        });

        res.status(200).json({
            status: true,
            message: "Submitted questions fetched successfully.",
            totalRecords: submittedQuestions.length,
            points: count,
            data: submittedQuestions,
            quizLimitMessage: message
        });
    } catch (error) {
        console.error('Error fetching submitted questions:', error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the submitted questions."
        });
    }
};


const getRecentQuizs = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Fetch the most recent three sessions along with their quizzes, grouped by sessionId
        const recentQuizzes = await userQuestionMappingModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match by userId
            { $sort: { createdAt: -1 } }, // Sort by creation date, newest first
            {
                $group: {
                    _id: "$sessionId",  // Group by sessionId
                    quizzes: { $push: "$$ROOT" },  // Push all quiz documents into an array
                    totalPoints: {
                        $sum: {
                            $cond: { if: { $eq: ["$isCorrect", true] }, then: 10, else: 0 }
                        }
                    }
                }
            },
            { $limit: 3 }, // Limit to the most recent three sessions
            {
                $lookup: {
                    from: "questioncategories",  // Assuming 'categories' is the name of the category collection
                    localField: "quizzes.categoryId",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: "$categoryInfo" },  // Unwind to get the category information
            {
                $project: {
                    sessionId: "$_id",
                    totalPoints: 1,
                    quizzes: 1,
                    categoryName: "$categoryInfo.categoryName"
                }
            }
        ]);

        if (recentQuizzes.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No recent quizzes found for the user."
            });
        }

        res.status(200).json({
            status: true,
            message: "Recent quizzes fetched successfully.",
            totalSessions: recentQuizzes.length,
            data: recentQuizzes
        });
    } catch (error) {
        console.error('Error fetching recent quizzes:', error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the recent quizzes."
        });
    }
};

const getGeneralQuizGlobalResultByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // Fetch total points for each user and rank them
        const allUserPoints = await userQuestionMappingModel.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalPoints: {
                        $sum: {
                            $cond: [{ $eq: ["$isCorrect", true] }, 10, 0]
                        }
                    }
                }
            },
            { $sort: { totalPoints: -1 } }, // Sort by total points in descending order
            {
                $lookup: {
                    from: "auths", // Assuming 'auths' is the name of the user collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" }, // Unwind to get the user information
            {
                $project: {
                    _id: 1,
                    totalPoints: 1,
                    rank: { $literal: 0 }, // Placeholder for rank, to be updated later
                    "userInfo.fullName": 1 // Include the user fullName in the output
                }
            }
        ]);

        // Assign ranks to users based on total points
        const userRanks = allUserPoints.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        // Find the top 10 users
        const topUsers = userRanks.slice(0, 10);

        // Find the rank and points of the specified user
        const userRankInfo = userRanks.find(user => user._id.toString() === userId);
        if (!userRankInfo) {
            return res.status(404).json({
                status: false,
                message: "User not found in the ranking."
            });
        }

        res.status(200).json({
            status: true,
            message: "Leaderboard fetched successfully.",
            userRank: userRankInfo.rank,
            userTotalPoints: userRankInfo.totalPoints,
            userName: userRankInfo.userInfo.fullName,
            topUsers: topUsers.map(user => ({
                userId: user._id,
                totalPoints: user.totalPoints,
                rank: user.rank,
                userName: user.userInfo.fullName
            }))
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the leaderboard."
        });
    }
};






export { createUserQuestionMapping, getAllUserQuestionMapping, getGeneralQuizGlobalResultByUserId, getUserQuestionMappingById, getCategoryStatistics, getCategoryPoints, updateUserQuestionMappingById, deleteUserQuestionMappingById, getSubmittedQuestions, getRecentQuizs }