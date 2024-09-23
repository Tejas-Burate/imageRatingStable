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
const userQuestionMappingModel_1 = __importDefault(require("../../api/userQuestionMapping/userQuestionMappingModel"));
const settingModel_1 = __importDefault(require("../../api/setting/settingModel"));
const questionModel_1 = __importDefault(require("../../api/questions/questionModel"));
const createUserQuestionMapping = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuestion = yield userQuestionMappingModel_1.default.create(data);
    if (!userQuestion) {
        return false;
    }
    return true;
});
const getPointsBySessionId = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const points = yield settingModel_1.default.find();
    const data = yield userQuestionMappingModel_1.default.find({ sessionId: sessionId });
    let pointsCounter = 0;
    pointsCounter = data.reduce((accumulator, item) => {
        if (item.isCorrect === true) {
            return accumulator + points[0].correctAnswerPoints;
        }
        else {
            return accumulator;
        }
    }, 0);
    return pointsCounter;
});
const checkAvailableQuestion = (categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const targetDistribution = [
        { difficultyRange: [1, 2], required: 1 },
        { difficultyRange: [3, 5], required: 2 },
        { difficultyRange: [6, 8], required: 2 }
    ];
    let totalQuestions = 0;
    for (const level of targetDistribution) {
        const { difficultyRange, required } = level;
        const availableQuestions = yield questionModel_1.default.find({
            categoryId: categoryId,
            difficultyLevel: { $gte: difficultyRange[0], $lte: difficultyRange[1] },
            _id: { $nin: yield getAnsweredQuestionIds(userId, categoryId) }
        });
        if (availableQuestions.length >= required) {
            totalQuestions += required;
        }
        else {
            totalQuestions += availableQuestions.length; // add what's available
        }
        if (totalQuestions >= 5) {
            return true;
        }
    }
    return totalQuestions >= 5;
});
const getAnsweredQuestionIds = (userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuestions = yield userQuestionMappingModel_1.default.find({ userId: userId, categoryId: categoryId });
    return userQuestions.map((item) => item.questionId);
});
module.exports = { createUserQuestionMapping, getPointsBySessionId, checkAvailableQuestion };
