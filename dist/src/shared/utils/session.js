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
const sessionModel_1 = __importDefault(require("../../api/session/sessionModel"));
const settingModel_1 = __importDefault(require("../../api/setting/settingModel"));
const userQuestionMappingModel_1 = __importDefault(require("../../api/userQuestionMapping/userQuestionMappingModel"));
const createSession = (userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield sessionModel_1.default.create({ userId, categoryId, questionCount: 0, sessionStatus: "Running" });
    return session;
});
const updateSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSession = yield sessionModel_1.default.findByIdAndUpdate(sessionId, { $inc: { questionCount: 1 } }, { new: true });
    }
    catch (error) {
        console.error('Error updating session:', error);
    }
});
const getActiveSession = (userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sessionModel_1.default.findOne({ userId, categoryId, questionCount: { $lt: 5 } }).select("_id questionCount");
});
const getActiveSessionBySessionId = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const points = yield settingModel_1.default.find();
    const data = yield sessionModel_1.default.findById(sessionId).select("_id questionCount");
    if (data.questionCount >= points[0].noOfQuizQuestions) {
        return false;
    }
    else {
        return true;
    }
});
const verifyGivenQuestionLimit = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const points = yield settingModel_1.default.find();
    const userQuestions = yield userQuestionMappingModel_1.default.find({ sessionId: sessionId });
    if (userQuestions.length >= points[0].noOfQuizQuestions) {
        const session = yield sessionModel_1.default.findById(sessionId);
        if (session) {
            session.sessionStatus = "Completed";
            yield session.save();
        }
        return false;
    }
    else {
        return true;
    }
});
const getRecentThreeSessions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const recentSessions = yield sessionModel_1.default.find({ userId: userId })
        .sort({ createdAt: -1 }) // Sort by the `createdAt` field in descending order
        .limit(3).select("_id"); // Limit to the most recent three records
    return recentSessions;
});
const getCurrentQuestionNoBySessions = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const recentSession = yield sessionModel_1.default.findById(sessionId).select("questionCount");
    if (!recentSession) {
        throw new Error("Session not found while getting question number");
    }
    return (recentSession.questionCount || 0) + 1;
});
module.exports = {
    createSession, updateSession, getActiveSession, getActiveSessionBySessionId, verifyGivenQuestionLimit, getRecentThreeSessions, getCurrentQuestionNoBySessions
};
