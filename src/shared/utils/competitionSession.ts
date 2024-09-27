import quizModel from "../../api/quizCompetition/quiz/quizModel";
import sessionModel from "../../api/quizCompetition/session/sessionModel";
import settingModel from "../../api/setting/settingModel";
import { ObjectId } from "mongoose";

const createSession = async (userId: ObjectId, quizId: ObjectId) => {
    const session = await sessionModel.create({ userId, quizId, questionCount: 0, sessionStatus: "Running" });
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


const getActiveSession = async (userId: ObjectId, quizId: ObjectId) => {
    return await sessionModel.findOne({ userId, quizId, questionCount: { $lt: 5 } }).select("_id questionCount");
};

const getActiveSessionBySessionId = async (sessionId: ObjectId) => {
    const points = await settingModel.find();
    const data: any = await sessionModel.findById(sessionId).select("_id questionCount");
    if (data.questionCount >= (points[1].noOfQuizQuestions as number)) {
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

const hasQuizStarted = async (quizId: string) => {
    const quiz = await quizModel.findById(quizId);
    if (!quiz) {
        throw new Error(`Quiz with ID ${quizId} not found.`);
    }

    const currentTime = new Date();
    return currentTime > quiz.quizStartDateAndTime;
}

export = {
    createSession, updateSession, getActiveSession, hasQuizStarted, getActiveSessionBySessionId, getRecentThreeSessions, getCurrentQuestionNoBySessions
}



