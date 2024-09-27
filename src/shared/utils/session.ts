import sessionModel from "../../api/session/sessionModel";
import settingModel from "../../api/setting/settingModel";
import { ObjectId } from "mongoose";
import userQuestionMappingModel from "../../api/userQuestionMapping/userQuestionMappingModel";

const createSession = async (userId: ObjectId, categoryId: ObjectId) => {
    const session = await sessionModel.create({ userId, categoryId, questionCount: 0, sessionStatus: "Running" });
    return session;
};

const updateSession = async (sessionId: ObjectId) => {
    try {
        const updatedSession = await sessionModel.findByIdAndUpdate(
            sessionId,
            { $inc: { questionCount: 1 } },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating session:', error);
    }
};


const getActiveSession = async (userId: ObjectId, categoryId: ObjectId) => {
    return await sessionModel.findOne({ userId, categoryId, questionCount: { $lt: 5 } }).select("_id questionCount");
};

const getActiveSessionBySessionId = async (sessionId: ObjectId) => {
    const points = await settingModel.find();
    const data: any = await sessionModel.findById(sessionId).select("_id questionCount");
    if (data.questionCount >= (points[0].noOfQuizQuestions as number)) {
        return false;
    } else {
        return true;
    }
};

const verifyGivenQuestionLimit = async (sessionId: ObjectId) => {
    const points = await settingModel.find();

    const userQuestions = await userQuestionMappingModel.find({ sessionId: sessionId });

    if (userQuestions.length >= (points[0].noOfQuizQuestions as number)) {
        const session = await sessionModel.findById(sessionId);
        if (session) {
            session.sessionStatus = "Completed";
            await session.save();
        }
        return false;
    } else {
        return true;
    }
};


const getRecentThreeSessions = async (userId: String) => {
    const recentSessions = await sessionModel.find({ userId: userId })
        .sort({ createdAt: -1 })  // Sort by the `createdAt` field in descending order
        .limit(3).select("_id");  // Limit to the most recent three records

    return recentSessions
}

const getCurrentQuestionNoBySessions = async (sessionId: string) => {
    const recentSession = await sessionModel.findById(sessionId).select("questionCount");

    if (!recentSession) {
        throw new Error("Session not found while getting question number");
    }

    return (recentSession.questionCount || 0) + 1;
}

export = {
    createSession, updateSession, getActiveSession, getActiveSessionBySessionId, verifyGivenQuestionLimit, getRecentThreeSessions, getCurrentQuestionNoBySessions
}



