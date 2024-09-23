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
const userQuizCompetitionQuestionModel_1 = __importDefault(require("../../api/quizCompetition/userQuizCompetitionQuestion/userQuizCompetitionQuestionModel"));
const sessionModel_1 = __importDefault(require("../../api/quizCompetition/session/sessionModel"));
const settingModel_1 = __importDefault(require("../../api/setting/settingModel"));
const createUserQuizQuestionMapping = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuestion = yield userQuizCompetitionQuestionModel_1.default.create(data);
    if (!userQuestion) {
        return false;
    }
    return true;
});
const getPointsBySessionId = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const points = yield settingModel_1.default.find();
    const data = yield userQuizCompetitionQuestionModel_1.default.find({ sessionId: sessionId });
    let pointsCounter = 0;
    pointsCounter = data.reduce((accumulator, item) => {
        if (item.isCorrect === true) {
            return accumulator + points[1].correctAnswerPoints;
        }
        else {
            return accumulator;
        }
    }, 0);
    return pointsCounter;
});
const getActiveQuizSessionBySessionId = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield sessionModel_1.default.findById(sessionId).select("_id questionCount");
    if (data.questionCount >= 30) {
        return false;
    }
    else {
        return true;
    }
});
module.exports = { createUserQuizQuestionMapping, getPointsBySessionId, getActiveQuizSessionBySessionId };
