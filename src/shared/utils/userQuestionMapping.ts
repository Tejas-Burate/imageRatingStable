import userQuestionMappingModel from "../../api/userQuestionMapping/userQuestionMappingModel";
import settingModel from "../../api/setting/settingModel";
import questionModel from "../../api/questions/questionModel";
import { ObjectId } from "mongoose";

const createUserQuestionMapping = async (data: any) => {

    const userQuestion = await userQuestionMappingModel.create(data);
    if (!userQuestion) {
        return false;
    }
    return true;
}

const getPointsBySessionId = async (sessionId: ObjectId) => {
    const points = await settingModel.find();
    const data = await userQuestionMappingModel.find({ sessionId: sessionId });
    let pointsCounter: number = 0;
    pointsCounter = data.reduce((accumulator, item) => {
        if (item.isCorrect === true) {
            return accumulator + (points[0].correctAnswerPoints as number);
        } else {
            return accumulator;
        }
    }, 0);
    return pointsCounter;
};

const checkAvailableQuestion = async (categoryId: ObjectId, userId: ObjectId) => {
    const targetDistribution = [
        { difficultyRange: [1, 2], required: 1 },
        { difficultyRange: [3, 5], required: 2 },
        { difficultyRange: [6, 8], required: 2 }
    ];

    let totalQuestions = 0;

    for (const level of targetDistribution) {
        const { difficultyRange, required } = level;

        const availableQuestions = await questionModel.find({
            categoryId: categoryId,
            difficultyLevel: { $gte: difficultyRange[0], $lte: difficultyRange[1] },
            _id: { $nin: await getAnsweredQuestionIds(userId, categoryId) }
        });

        if (availableQuestions.length >= required) {
            totalQuestions += required;
        } else {
            totalQuestions += availableQuestions.length; // add what's available
        }

        if (totalQuestions >= 5) {
            return true;
        }
    }

    return totalQuestions >= 5;
};


const getAnsweredQuestionIds = async (userId: ObjectId, categoryId: ObjectId) => {
    const userQuestions = await userQuestionMappingModel.find({ userId: userId, categoryId: categoryId });
    return userQuestions.map((item) => item.questionId);
}

export = { createUserQuestionMapping, getPointsBySessionId, checkAvailableQuestion };
