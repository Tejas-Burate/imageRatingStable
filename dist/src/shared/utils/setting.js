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
const settingModel_1 = __importDefault(require("../../api/setting/settingModel"));
const getTotalQuestionsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield settingModel_1.default.find();
    return session[0].noOfQuizQuestions;
});
const getQuestionsTime = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield settingModel_1.default.find();
    return session[0].questionTime;
});
const getCompetitionTotalQuestionsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield settingModel_1.default.find();
    return session[1].noOfQuizQuestions;
});
const getCompetitionQuestionsTime = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield settingModel_1.default.find();
    return session[1].questionTime;
});
module.exports = {
    getTotalQuestionsCount, getQuestionsTime, getCompetitionTotalQuestionsCount, getCompetitionQuestionsTime
};
