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
exports.getCompetitionQuestionsFilters = exports.deleteQuestionById = exports.updateQuestionById = exports.getNextQuestionByQuizId = exports.bulkUploadCompetitionQuestions = exports.getFiveByQuestionByQuizId = exports.getAllQuestionByCategoryId = exports.getQuestionById = exports.getAllQuestion = exports.verifyQuizQuestionAnswer = exports.createQuizQuestion = void 0;
const userQuizQuestion_1 = __importDefault(require("../../../shared/utils/userQuizQuestion"));
const questionModel_1 = __importDefault(require("./questionModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const competitionSession_1 = __importDefault(require("../../../shared/utils/competitionSession"));
const setting_1 = __importDefault(require("../../../shared/utils/setting"));
const userQuizCompetitionQuestionModel_1 = __importDefault(require("../userQuizCompetitionQuestion/userQuizCompetitionQuestionModel"));
const authModel_1 = __importDefault(require("../../auth/authModel"));
const xlsx_1 = __importDefault(require("xlsx"));
const quizModel_1 = __importDefault(require("../quiz/quizModel"));
const subscription_1 = __importDefault(require("../../../shared/utils/subscription"));
const { ObjectId } = mongoose_1.default.Types;
const { createUserQuizQuestionMapping, getActiveQuizSessionBySessionId, getPointsBySessionId, } = userQuizQuestion_1.default;
const { getCompetitionTotalQuestionsCount, getCompetitionQuestionsTime } = setting_1.default;
const { createSession, updateSession, hasQuizStarted, getActiveSession, getActiveSessionBySessionId, getCurrentQuestionNoBySessions, } = competitionSession_1.default;
const { competitionQuizPlanExpired, isCompetitionQuizSubscription } = subscription_1.default;
const createQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ status: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.Jwt_Secret_Key);
        const question = yield questionModel_1.default.create(Object.assign(Object.assign({}, req.body), { questionCreator: decoded.userInfo._id, questionOwner: decoded.userInfo._id }));
        if (!question) {
            res
                .status(400)
                .json({ status: false, message: "Error for creating Quiz Question" });
            return;
        }
        res.status(201).json({
            status: true,
            message: "Quiz Question data fetch successfully..",
            data: question,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createQuizQuestion = createQuizQuestion;
const getAllQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield questionModel_1.default
            .find()
            .populate({ path: "questionCreator", select: "_id fullName" })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "quizId", select: "_id quizName" });
        if (question.length === 0) {
            res
                .status(404)
                .json({ status: false, message: "Question data not found" });
            return;
        }
        res.status(200).json({
            status: true,
            totalRecords: yield questionModel_1.default.countDocuments(),
            message: "Question data fetch successfully..",
            data: question,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllQuestion = getAllQuestion;
const getCompetitionQuestionsFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit = 10, // Default limit
        start = 0, // Default start
        quizName, question, difficultyLevel, country, questionCreator, questionOwner, } = req.body;
        const filter = {};
        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { question: searchRegex },
                { orgImgUrl: searchRegex },
                { compImgUrl: searchRegex },
                { country: searchRegex },
                { "optionList.optionValue": searchRegex },
            ];
        }
        if (quizName) {
            const categories = yield quizModel_1.default.find({
                quizName: new RegExp(quizName, "i"),
            });
            if (categories.length > 0) {
                filter.quizId = { $in: categories.map((c) => c._id) };
            }
            else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching categories found" });
            }
        }
        if (question) {
            filter.question = new RegExp(question, "i");
        }
        if (difficultyLevel) {
            filter.difficultyLevel = parseInt(difficultyLevel);
        }
        if (country) {
            filter.country = new RegExp(country, "i");
        }
        if (questionCreator) {
            const creators = yield authModel_1.default.find({
                fullName: new RegExp(questionCreator, "i"),
            });
            if (creators.length > 0) {
                filter.questionCreator = { $in: creators.map((c) => c._id) };
            }
            else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching creators found" });
            }
        }
        if (questionOwner) {
            const owners = yield authModel_1.default.find({
                fullName: new RegExp(questionOwner, "i"),
            });
            if (owners.length > 0) {
                filter.questionOwner = { $in: owners.map((o) => o._id) };
            }
            else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching owners found" });
            }
        }
        const questions = yield questionModel_1.default
            .find(filter)
            .skip(parseInt(start))
            .limit(parseInt(limit))
            .populate("quizId questionCreator questionOwner");
        if (questions.length === 0) {
            res.status(404).json({ status: false, message: "No questions found" });
            return;
        }
        res.status(200).json({
            status: true,
            totalRecords: yield questionModel_1.default.countDocuments(filter),
            message: "Questions fetched successfully",
            data: questions,
        });
    }
    catch (error) {
        console.error("Error fetching questions:", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getCompetitionQuestionsFilters = getCompetitionQuestionsFilters;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const question = yield questionModel_1.default
            .findById(id)
            .populate({ path: "questionCreator", select: "_id fullName" })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "quizId", select: "_id quizName" });
        if (!question) {
            res.status(404).json({
                status: false,
                message: `Question data of questionID ${id} not found`,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Question data fetch successfully..",
            data: question,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getQuestionById = getQuestionById;
const getAllQuestionByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const question = yield questionModel_1.default
            .find({ quizId: id })
            .populate({ path: "questionCreator", select: "_id fullName" })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "quizId", select: "_id quizName" });
        if (question.length === 0) {
            res.status(404).json({
                status: false,
                message: `Question data of questionID ${id} not found`,
            });
            return;
        }
        res.status(200).json({
            status: true,
            totalRecords: question.length,
            message: "Question data fetch successfully..",
            data: question,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllQuestionByCategoryId = getAllQuestionByCategoryId;
const updateQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const question = yield questionModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!question) {
            res.status(404).json({
                status: false,
                message: `Failed to updated Question data of questionID ${id}`,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Question data updated successfully..",
            data: question,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateQuestionById = updateQuestionById;
const deleteQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const question = yield questionModel_1.default.findByIdAndDelete(id);
        if (!question) {
            res.status(404).json({
                status: false,
                message: `Failed to updated Question data of questionID ${id}`,
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Question data updated successfully..",
            data: question,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteQuestionById = deleteQuestionById;
// const getFiveByQuestionByQuizId = async (req: Request, res: Response) => {
//     try {
//         const { userId, quizId } = req.body;
//         if (!quizId || !userId) {
//             return res
//                 .status(400)
//                 .json({ status: false, message: "Missing required parameters." });
//         }
//         const user = await authModel.findById(userId);
//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ status: false, message: `User with ID ${userId} is not found.` });
//         }
//         const quizIsGiven = await sessionModel.findOne({ userId: userId, quizId: quizId });
//         if (quizIsGiven) {
//             return res.status(401).json({ status: false, message: "You have already given this quiz" });
//         }
//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);
//         const endOfDay = new Date();
//         endOfDay.setHours(23, 59, 59, 999);
//         const allQuestions = await questionModel.find({ quizId })
//             .populate({ path: "quizId", select: "_id quizName" });
//         if (allQuestions.length === 0) {
//             return res.status(404).json({
//                 status: false,
//                 message: `No questions found for category ID ${quizId}.`,
//             });
//         }
//         const questionsWithOptionValues = allQuestions.map((question) => {
//             const optionListWithIds = question.optionList.map((option) => ({
//                 optionValue: option.optionValue,
//                 _id: option._id,
//             }));
//             return {
//                 ...question.toObject(), // Convert Mongoose document to plain object
//                 optionList: optionListWithIds, // Replace optionList with optionValue and _id
//             };
//         });
//         const answeredQuestions = await userQuizCompetitionModel.find({ userId, quizId }).select("questionId status");
//         const answeredQuestionIds = answeredQuestions.map(q => q.questionId.toString());
//         const notYetPresented = questionsWithOptionValues.filter(q => !answeredQuestionIds.includes(q._id.toString()));
//         const unAttempted = answeredQuestions.filter(q => q.status === "UnAttempted").map(q => q.questionId.toString());
//         const wronglyAnswered = answeredQuestions.filter(q => q.status === "WronglyAnswered").map(q => q.questionId.toString());
//         const correctlyAnswered = answeredQuestions.filter(q => q.status === "CorrectlyAnswered").map(q => q.questionId.toString());
//         let prioritizedQuestions = notYetPresented.length > 0 ? notYetPresented
//             : unAttempted.length > 0 ? questionsWithOptionValues.filter(q => unAttempted.includes(q._id.toString()))
//                 : wronglyAnswered.length > 0 ? questionsWithOptionValues.filter(q => wronglyAnswered.includes(q._id.toString()))
//                     : questionsWithOptionValues.filter(q => correctlyAnswered.includes(q._id.toString()));
//         if (prioritizedQuestions.length === 0) {
//             return res.status(404).json({
//                 status: false,
//                 message: "No new questions available for this category.",
//             });
//         }
//         const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
//         const selectedQuestion = prioritizedQuestions[randomIndex];
//         const activeSession = await createSession(userId, quizId);
//         return res.status(200).json({
//             status: true,
//             message: "Question data fetched successfully.",
//             sessionId: activeSession,
//             data: selectedQuestion,
//             questionNumber: activeSession.questionCount + 1,
//             totalQuestions: await getCompetitionTotalQuestionsCount(),
//             questionTime: await getCompetitionQuestionsTime(),
//         });
//     } catch (error: any) {
//         console.log("error", error);
//         res.status(500).json({
//             status: false,
//             message: error.message || "Internal server error",
//         });
//     }
// };
const getFiveByQuestionByQuizId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, quizId } = req.body;
        if (!quizId || !userId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }
        const user = yield authModel_1.default.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                status: false,
                message: `User with ID ${userId} is not found.`,
            });
        }
        const quiz = yield quizModel_1.default.findById(quizId);
        if (!quiz) {
            return res
                .status(404)
                .json({
                status: false,
                message: `Quiz with ID ${quizId} is not found.`,
            });
        }
        // const isQuizStarted = await hasQuizStarted(quizId);
        // if (isQuizStarted) {
        //     return res
        //         .status(403)
        //         .json({ status: false, message: "Quiz has not started yet." });
        // }
        // const quizIsGiven = await sessionModel.findOne({
        //     userId: userId,
        //     quizId: quizId,
        //     sessionStatus: "Completed"
        // });
        // if (quizIsGiven) {
        //     return res
        //         .status(401)
        //         .json({ status: false, message: "You have already given this quiz" });
        // }
        if (!(yield isCompetitionQuizSubscription(userId))) {
            return res
                .status(401)
                .json({
                status: false,
                message: "Please buy subscription before starting quiz competition..",
            });
        }
        if (yield competitionQuizPlanExpired(userId)) {
            return res
                .status(401)
                .json({
                status: false,
                message: "Your subscription is expired, please renew your competition quiz subscription",
            });
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const allQuestions = yield questionModel_1.default
            .find({ quizId })
            .populate({ path: "quizId", select: "_id quizName" });
        if (allQuestions.length === 0) {
            return res.status(404).json({
                status: false,
                message: `No questions found for category ID ${quizId}.`,
            });
        }
        const questionsWithOptionValues = allQuestions.map((question) => {
            const optionListWithIds = question.optionList.map((option) => ({
                optionValue: option.optionValue,
                _id: option._id,
            }));
            return Object.assign(Object.assign({}, question.toObject()), { optionList: optionListWithIds });
        });
        const answeredQuestions = yield userQuizCompetitionQuestionModel_1.default
            .find({ userId, quizId })
            .select("questionId status");
        const answeredQuestionIds = answeredQuestions.map((q) => q.questionId.toString());
        const notYetPresented = questionsWithOptionValues.filter((q) => !answeredQuestionIds.includes(q._id.toString()));
        const unAttempted = answeredQuestions
            .filter((q) => q.status === "UnAttempted")
            .map((q) => q.questionId.toString());
        const wronglyAnswered = answeredQuestions
            .filter((q) => q.status === "WronglyAnswered")
            .map((q) => q.questionId.toString());
        const correctlyAnswered = answeredQuestions
            .filter((q) => q.status === "CorrectlyAnswered")
            .map((q) => q.questionId.toString());
        let prioritizedQuestions = notYetPresented.length > 0
            ? notYetPresented
            : unAttempted.length > 0
                ? questionsWithOptionValues.filter((q) => unAttempted.includes(q._id.toString()))
                : wronglyAnswered.length > 0
                    ? questionsWithOptionValues.filter((q) => wronglyAnswered.includes(q._id.toString()))
                    : questionsWithOptionValues.filter((q) => correctlyAnswered.includes(q._id.toString()));
        if (prioritizedQuestions.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No new questions available for this category.",
            });
        }
        const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
        const selectedQuestion = prioritizedQuestions[randomIndex];
        const activeSession = yield createSession(userId, quizId);
        return res.status(200).json({
            status: true,
            message: "Question data fetched successfully.",
            sessionId: activeSession,
            data: selectedQuestion,
            questionNumber: activeSession.questionCount + 1,
            totalQuestions: yield getCompetitionTotalQuestionsCount(),
            questionTime: yield getCompetitionQuestionsTime(),
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.getFiveByQuestionByQuizId = getFiveByQuestionByQuizId;
const getNextQuestionByQuizId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userId, questionId, quizId, difficultyLevel, timeTaken, sessionId, isCorrect, } = req.body;
        if (!quizId || !difficultyLevel || !userId || !questionId || !sessionId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }
        let session = yield getActiveQuizSessionBySessionId(sessionId);
        if (!session) {
            return res
                .status(400)
                .json({ status: false, message: "User already answered 5 questions" });
        }
        difficultyLevel = isCorrect
            ? Math.min(difficultyLevel + 1, 8)
            : Math.max(difficultyLevel - 1, 1);
        const questions = yield questionModel_1.default
            .find({ quizId, difficultyLevel })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "quizId", select: "_id quizName" });
        if (questions.length === 0) {
            return res.status(404).json({
                status: false,
                message: `No questions found for quiz ID ${quizId} at difficulty level ${difficultyLevel}`,
            });
        }
        const answeredQuestions = yield userQuizCompetitionQuestionModel_1.default
            .find({ userId, quizId })
            .select("questionId status sessionId");
        const answeredQuestionIds = answeredQuestions.map((q) => ({
            id: q.questionId.toString(),
            status: q.status,
            sessionId: q.sessionId,
        }));
        const presentedQuestionsInSession = answeredQuestionIds
            .filter((q) => q.sessionId === sessionId)
            .map((q) => q.id);
        const questionsWithOptionValues = questions.map((question) => {
            const optionListWithIds = question.optionList.map((option) => ({
                optionValue: option.optionValue,
                _id: option._id,
            }));
            return Object.assign(Object.assign({}, question.toObject()), { optionList: optionListWithIds, _id: question._id });
        });
        // Filter questions based on priorities and session presentation
        const notPresented = questionsWithOptionValues.filter((q) => !answeredQuestionIds.some((a) => a.id === q._id.toString()));
        const unattempted = questionsWithOptionValues.filter((q) => answeredQuestionIds.some((a) => a.id === q._id.toString() && a.status === "UnAttempted"));
        const wronglyAnswered = questionsWithOptionValues.filter((q) => answeredQuestionIds.some((a) => a.id === q._id.toString() && a.status === "WronglyAnswered"));
        const correctlyAnswered = questionsWithOptionValues.filter((q) => answeredQuestionIds.some((a) => a.id === q._id.toString() && a.status === "CorrectlyAnswered"));
        let prioritizedQuestions = [
            ...notPresented.filter((q) => !presentedQuestionsInSession.includes(q._id.toString())),
            ...(notPresented.length === 0 ? unattempted : []).filter((q) => !presentedQuestionsInSession.includes(q._id.toString())),
            ...(notPresented.length === 0 && unattempted.length === 0
                ? wronglyAnswered
                : []).filter((q) => !presentedQuestionsInSession.includes(q._id.toString())),
            ...(notPresented.length === 0 &&
                unattempted.length === 0 &&
                wronglyAnswered.length === 0
                ? correctlyAnswered
                : []).filter((q) => !presentedQuestionsInSession.includes(q._id.toString())),
        ];
        if (prioritizedQuestions.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No new questions available for this quiz.",
            });
        }
        const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
        const question = prioritizedQuestions[randomIndex];
        res.status(200).json({
            status: true,
            message: "Question data fetched successfully.",
            data: question,
            questionNumber: yield getCurrentQuestionNoBySessions(sessionId),
            totalQuestions: yield getCompetitionTotalQuestionsCount(),
            questionTime: yield getCompetitionQuestionsTime(),
        });
    }
    catch (error) {
        console.error("Error fetching next question:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the next question.",
            error: error,
        });
    }
});
exports.getNextQuestionByQuizId = getNextQuestionByQuizId;
const verifyQuizQuestionAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId, answer, answerId, sessionId, userId, quizId, difficultyLevel, timeTaken, } = req.body;
        const getQuestion = yield questionModel_1.default.findById(questionId);
        if (!getQuestion) {
            res.status(404).json({
                status: false,
                message: `Question of ID ${questionId} is not found`,
            });
            return;
        }
        const correctAnswer = getQuestion.optionList.filter((q) => q.isCorrect == true);
        const checkAnswer = getQuestion.optionList.some((q) => q._id == answerId && q.isCorrect == true);
        const mappingData = {
            userId,
            questionId,
            quizId,
            answer,
            isCorrect: checkAnswer,
            difficultyLevel,
            sessionId,
            timeTaken,
            status: answer === "null"
                ? "UnAttempted"
                : checkAnswer
                    ? "CorrectlyAnswered"
                    : "WronglyAnswered",
        };
        const mappingResult = yield createUserQuizQuestionMapping(mappingData);
        if (!mappingResult) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to create new record" });
        }
        yield updateSession(sessionId);
        res.status(200).json({
            isCorrect: checkAnswer,
            submittedAnswer: answer,
            answerId: answerId,
            correctAnswer: correctAnswer,
            totalPoints: yield getPointsBySessionId(sessionId),
            limitExceed: competitionSession_1.default,
        });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error: error });
    }
});
exports.verifyQuizQuestionAnswer = verifyQuizQuestionAnswer;
const bulkUploadCompetitionQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const quizId = req.query.quizId;
        if (!file) {
            return res
                .status(400)
                .json({ status: false, message: "No file uploaded" });
        }
        if (!quizId) {
            return res.status(400).json({
                status: 400,
                message: "QuizId is required",
            });
        }
        const workbook = xlsx_1.default.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx_1.default.utils.sheet_to_json(worksheet);
        const errors = [];
        const badData = [];
        const questions = data.map((item, index) => {
            const optionList = [];
            for (let i = 0; i < 5; i++) {
                const optionValue = item[`optionList[${i}].optionValue`];
                const isCorrect = item[`optionList[${i}].isCorrect`];
                if (optionValue !== undefined && optionValue !== "") {
                    optionList.push({ optionValue, isCorrect: isCorrect || false });
                }
            }
            const missingFields = [];
            const invalidFields = [];
            if (!item.question) {
                missingFields.push("question");
            }
            else if (typeof item.question !== "string") {
                invalidFields.push("question (should be string)");
            }
            // if (!item.orgImgUrl) {
            //     missingFields.push("orgImgUrl");
            // } else if (typeof item.orgImgUrl !== "string") {
            //     invalidFields.push("orgImgUrl (should be string)");
            // }
            // if (!item.compImgUrl) {
            //     missingFields.push("compImgUrl");
            // } else if (typeof item.compImgUrl !== "string") {
            //     invalidFields.push("compImgUrl (should be string)");
            // }
            if (!item.difficultyLevel) {
                missingFields.push("difficultyLevel");
            }
            else if (typeof item.difficultyLevel !== "number") {
                invalidFields.push("difficultyLevel (should be number)");
            }
            if (!item.country) {
                missingFields.push("country");
            }
            else if (typeof item.country !== "string") {
                invalidFields.push("country (should be string)");
            }
            if (!item.questionCreator) {
                missingFields.push("questionCreator");
            }
            else if (typeof item.questionCreator !== "string") {
                invalidFields.push("questionCreator (should be string)");
            }
            if (!item.questionOwner) {
                missingFields.push("questionOwner");
            }
            else if (typeof item.questionOwner !== "string") {
                invalidFields.push("questionOwner (should be string)");
            }
            if (missingFields.length > 0 || invalidFields.length > 0) {
                errors.push({
                    row: index + 1,
                    missingFields,
                    invalidFields,
                });
                badData.push(Object.assign(Object.assign({}, item), { row: index + 1 }));
            }
            return {
                question: item.question,
                quizId: quizId, // Use quizId from req.params
                questionTime: item.questionTime,
                orgImgUrl: item.orgImgUrl,
                compImgUrl: item.compImgUrl,
                difficultyLevel: item.difficultyLevel,
                country: item.country,
                globalView: item.globalView,
                questionCreator: item.questionCreator,
                questionOwner: item.questionOwner,
                optionList,
            };
        });
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "There are errors in the Excel file",
                errors,
                badData,
            });
        }
        const insertedQuestions = yield questionModel_1.default.insertMany(questions);
        res
            .status(201)
            .json({
            status: true,
            message: "Questions uploaded successfully",
            data: insertedQuestions,
        });
    }
    catch (error) {
        console.error("Error during bulk upload:", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error });
    }
});
exports.bulkUploadCompetitionQuestions = bulkUploadCompetitionQuestions;
