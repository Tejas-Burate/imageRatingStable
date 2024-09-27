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
exports.updateSelectedQuestionsQuestionOwner = exports.updateQuestionOwnerInBulk = exports.difficultyLevelStatisticsByCategory = exports.userRegistrationStatistics = exports.mostTrendingCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userQuestionMappingModel_1 = __importDefault(require("../userQuestionMapping/userQuestionMappingModel"));
const date_fns_1 = require("date-fns");
const authModel_1 = __importDefault(require("../auth/authModel"));
const questionModel_1 = __importDefault(require("../questions/questionModel"));
const mostTrendingCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statistics = yield userQuestionMappingModel_1.default.aggregate([
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
        res.status(200).json({ status: true, message: "data fetch successfully", data: statistics.sort((a, b) => b.totalQuestionsAttempted - a.totalQuestionsAttempted) });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.mostTrendingCategory = mostTrendingCategory;
const userRegistrationStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const lastWeek = (0, date_fns_1.subWeeks)(today, 1);
        const lastMonth = (0, date_fns_1.subMonths)(today, 1);
        const statistics = yield authModel_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.userRegistrationStatistics = userRegistrationStatistics;
const difficultyLevelStatisticsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const statistics = yield userQuestionMappingModel_1.default.aggregate([
            {
                $match: {
                    categoryId: new mongoose_1.default.Types.ObjectId(categoryId),
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
        const rankedStatistics = statistics.map((stat, index) => (Object.assign(Object.assign({}, stat), { rank: index + 1 })));
        res.status(200).json({ status: true, message: "Data fetched successfully", data: rankedStatistics });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.difficultyLevelStatisticsByCategory = difficultyLevelStatisticsByCategory;
const updateQuestionOwnerInBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldOwnerId, newOwnerId } = req.body;
        if (!oldOwnerId || !newOwnerId) {
            return res.status(400).json({ status: false, message: "Old and new owner IDs are required" });
        }
        const oldOwnerObjectId = oldOwnerId;
        const newOwnerObjectId = newOwnerId;
        const result = yield questionModel_1.default.updateMany({ questionOwner: oldOwnerObjectId }, // Filter criteria
        { $set: { questionOwner: newOwnerObjectId } } // Update operation
        );
        res.status(200).json({
            status: true,
            message: "Question owners updated successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    }
    catch (error) {
        console.error('Error updating question owners:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.updateQuestionOwnerInBulk = updateQuestionOwnerInBulk;
const updateSelectedQuestionsQuestionOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldOwnerId, newOwnerId, selectedQuestionIds } = req.body;
        if (!oldOwnerId || !newOwnerId) {
            return res.status(400).json({ status: false, message: "Old and new owner IDs are required" });
        }
        const oldOwnerObjectId = oldOwnerId;
        const newOwnerObjectId = newOwnerId;
        const result = yield questionModel_1.default.updateMany({
            questionOwner: oldOwnerObjectId,
            _id: { $in: selectedQuestionIds }
        }, { $set: { questionOwner: newOwnerObjectId } } // Update operation
        );
        res.status(200).json({
            status: true,
            message: "Question owners updated successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    }
    catch (error) {
        console.error('Error updating question owners:', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.updateSelectedQuestionsQuestionOwner = updateSelectedQuestionsQuestionOwner;
