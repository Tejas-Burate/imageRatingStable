import settingModel from "../../api/setting/settingModel";
import { ObjectId } from "mongoose";

const getTotalQuestionsCount = async () => {
    const session = await settingModel.find();
    return session[0].noOfQuizQuestions;
};

const getQuestionsTime = async () => {
    const session = await settingModel.find();
    return session[0].questionTime;
};
const getCompetitionTotalQuestionsCount = async () => {
    const session = await settingModel.find();
    return session[1].noOfQuizQuestions;
};

const getCompetitionQuestionsTime = async () => {
    const session = await settingModel.find();
    return session[1].questionTime;
};



export = {
    getTotalQuestionsCount, getQuestionsTime, getCompetitionTotalQuestionsCount, getCompetitionQuestionsTime
}