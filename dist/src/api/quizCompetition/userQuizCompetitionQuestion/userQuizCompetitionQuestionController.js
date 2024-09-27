"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizCompetitionResultByUser = exports.getTopFiveResult = exports.getUserQuizCompetitionQuestionById = exports.getAllUserQuizCompetitionQuestion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userQuizCompetitionQuestionModel_1 = __importDefault(require("./userQuizCompetitionQuestionModel"));
const settingModel_1 = __importDefault(require("../../setting/settingModel"));
const getAllUserQuizCompetitionQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userQuizCompetitionQuestion = yield userQuizCompetitionQuestionModel_1.default.find();
        if (userQuizCompetitionQuestion.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: userQuizCompetitionQuestion.length, data: userQuizCompetitionQuestion });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getAllUserQuizCompetitionQuestion = getAllUserQuizCompetitionQuestion;
const getUserQuizCompetitionQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userQuizCompetitionQuestion = yield userQuizCompetitionQuestionModel_1.default.findById(id);
        if (!userQuizCompetitionQuestion) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", data: userQuizCompetitionQuestion });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getUserQuizCompetitionQuestionById = getUserQuizCompetitionQuestionById;
const getTopFiveResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.body;
        // Convert quizId to ObjectId
        const objectIdQuizId = new mongoose_1.default.Types.ObjectId(quizId);
        // Fetch the top five users with the most correct answers and the least time taken
        const topFiveResults = yield userQuizCompetitionQuestionModel_1.default.aggregate([
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
    }
    catch (error) {
        console.log('Error fetching top five results:', error);
        return res.status(500).json({ status: false, message: "Internal server error", error });
    }
});
exports.getTopFiveResult = getTopFiveResult;
const getQuizCompetitionResultByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, quizId, sessionId } = req.body;
        const quizCompetitionSetting = yield settingModel_1.default.findOne({ settingName: "Competition Quiz" });
        if (!quizCompetitionSetting) {
            return res.status(404).json({ status: false, message: "Competition Quiz setting not found.." });
        }
        // Fetch the user's quiz competition results
        const userResult = yield userQuizCompetitionQuestionModel_1.default.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    quizId: new mongoose_1.default.Types.ObjectId(quizId),
                    sessionId: new mongoose_1.default.Types.ObjectId(sessionId),
                }
            },
            {
                $group: {
                    _id: "$userId", // Group by `userId` to aggregate results for each user
                    UnAttempted: { $sum: { $cond: [{ $eq: ["$status", "UnAttempted"] }, 1, 0] } }, // Count of unattempted answers
                    correctAnswers: { $sum: { $cond: [{ $eq: ["$status", "CorrectlyAnswered"] }, 1, 0] } }, // Count of correct answers
                    incorrectAnswers: { $sum: { $cond: [{ $eq: ["$status", "WronglyAnswered"] }, 1, 0] } }, // Count of incorrect answers
                }
            }
        ]);
        if (userResult.length === 0) {
            return res.status(404).json({ status: false, message: "No results found for the specified user and session." });
        }
        const result = userResult[0];
        const totalPoints = result.correctAnswers * quizCompetitionSetting.correctAnswerPoints;
        return res.status(200).json({
            status: true,
            message: "User's quiz competition results fetched successfully",
            data: Object.assign(Object.assign({}, result), { totalPoints: totalPoints, totalQuestions: quizCompetitionSetting.noOfQuizQuestions })
        });
    }
    catch (error) {
        console.log('Error fetching quiz competition results:', error);
        return res.status(500).json({ status: false, message: "Internal server error", error });
    }
});
exports.getQuizCompetitionResultByUser = getQuizCompetitionResultByUser;
