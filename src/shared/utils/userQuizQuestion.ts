
import userQuizQuestionModel from "../../api/quizCompetition/userQuizCompetitionQuestion/userQuizCompetitionQuestionModel";
import sessionModel from "../../api/quizCompetition/session/sessionModel";
import { ObjectId } from "mongoose";
import settingModel from "../../api/setting/settingModel";
const createUserQuizQuestionMapping = async (data: any) => {

    const userQuestion = await userQuizQuestionModel.create(data);
    if (!userQuestion) {
        return false;
    }
    return true;
}

const getPointsBySessionId = async (sessionId: ObjectId) => {
    const points = await settingModel.find();
    const data = await userQuizQuestionModel.find({ sessionId: sessionId });
    let pointsCounter: number = 0;
    pointsCounter = data.reduce((accumulator, item) => {
        if (item.isCorrect === true) {
            return accumulator + (points[1].correctAnswerPoints as number);
        } else {
            return accumulator;
        }
    }, 0);
    return pointsCounter;
};

const getActiveQuizSessionBySessionId = async (sessionId: ObjectId) => {
    const data: any = await sessionModel.findById(sessionId).select("_id questionCount");
    if (data.questionCount >= 30) {
        return false;
    } else {
        return true;
    }
};

export = { createUserQuizQuestionMapping, getPointsBySessionId, getActiveQuizSessionBySessionId };