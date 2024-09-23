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
exports.getQuestionsFilters = exports.getQuestionsCountByCategory = exports.bulkUploadQuestions = exports.deleteQuestionById = exports.updateQuestionById = exports.getNextQuestionByCategoryId = exports.getFiveQuestionByCategoryId = exports.getAllQuestionByCategoryId = exports.getQuestionById = exports.getAllQuestion = exports.verifyQuestionAnswer = exports.createQuestion = void 0;
const userQuestionMapping_1 = __importDefault(require("../../shared/utils/userQuestionMapping"));
const questionModel_1 = __importDefault(require("./questionModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const xlsx_1 = __importDefault(require("xlsx"));
const session_1 = __importDefault(require("../../shared/utils/session"));
const setting_1 = __importDefault(require("../../shared/utils/setting"));
const subscription_1 = __importDefault(require("../../shared/utils/subscription"));
const userQuestionMappingModel_1 = __importDefault(require("../userQuestionMapping/userQuestionMappingModel"));
const authModel_1 = __importDefault(require("../auth/authModel"));
const questionCategoryModel_1 = __importDefault(require("../questionCategory/questionCategoryModel"));
const { ObjectId } = mongoose_1.default.Types;
const { getTotalQuestionsCount, getQuestionsTime } = setting_1.default;
const { createSession, updateSession, getActiveSession, getActiveSessionBySessionId, verifyGivenQuestionLimit, getCurrentQuestionNoBySessions, } = session_1.default;
const { createUserQuestionMapping, getPointsBySessionId, checkAvailableQuestion, } = userQuestionMapping_1.default;
const { planExpired } = subscription_1.default;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                .json({ status: false, message: "Error for creating Question" });
            return;
        }
        res.status(201).json({
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
exports.createQuestion = createQuestion;
const getAllQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield questionModel_1.default
            .find()
            .populate({ path: "questionCreator", select: "_id fullName" })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "categoryId", select: "_id categoryName" });
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
const getQuestionsFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit = 10, // Default limit
        start = 0, // Default start
        categoryName, question, questionTime, difficultyLevel, country, questionCreator, questionOwner, } = req.body;
        const filter = {};
        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { question: searchRegex },
                { orgImgUrl: searchRegex },
                { compImgUrl: searchRegex },
                { country: searchRegex },
            ];
        }
        if (categoryName) {
            const categories = yield questionCategoryModel_1.default.find({
                categoryName: new RegExp(categoryName, "i")
            });
            if (categories.length > 0) {
                filter.categoryId = { $in: categories.map(c => c._id) };
            }
            else {
                return res.status(404).json({ status: false, message: "No matching categories found" });
            }
        }
        if (question) {
            filter.question = new RegExp(question, "i");
        }
        if (questionTime) {
            filter.questionTime = new RegExp(questionTime, "i");
        }
        if (difficultyLevel) {
            filter.difficultyLevel = parseInt(difficultyLevel);
        }
        if (country) {
            filter.country = new RegExp(country, "i");
        }
        if (questionCreator) {
            const creators = yield authModel_1.default.find({
                fullName: new RegExp(questionCreator, "i")
            });
            if (creators.length > 0) {
                filter.questionCreator = { $in: creators.map(c => c._id) };
            }
            else {
                return res.status(404).json({ status: false, message: "No matching creators found" });
            }
        }
        if (questionOwner) {
            const owners = yield authModel_1.default.find({
                fullName: new RegExp(questionOwner, "i")
            });
            if (owners.length > 0) {
                filter.questionOwner = { $in: owners.map(o => o._id) };
            }
            else {
                return res.status(404).json({ status: false, message: "No matching owners found" });
            }
        }
        const questions = yield questionModel_1.default.find(filter)
            .skip(parseInt(start))
            .limit(parseInt(limit))
            .populate("categoryId questionCreator questionOwner");
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
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getQuestionsFilters = getQuestionsFilters;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const question = yield questionModel_1.default
            .findById(id)
            .populate({ path: "questionCreator", select: "_id fullName" })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "categoryId", select: "_id categoryName" });
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
            .find({ categoryId: id })
            .populate({ path: "questionCreator", select: "_id fullName" })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "categoryId", select: "_id categoryName" });
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
const getFiveQuestionByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, categoryId } = req.body;
        if (!categoryId || !userId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }
        const user = yield authModel_1.default.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ status: false, message: `User with ID ${userId} is not found.` });
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        if (user.subscription === true) {
            // For subscribed users, apply question prioritization logic
            const allQuestions = yield questionModel_1.default.find({ categoryId })
                .populate({ path: "categoryId", select: "_id categoryName" });
            if (allQuestions.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: `No questions found for category ID ${categoryId}.`,
                });
            }
            const questionsWithOptionValues = allQuestions.map((question) => {
                const optionListWithIds = question.optionList.map((option) => ({
                    optionValue: option.optionValue,
                    _id: option._id,
                }));
                return Object.assign(Object.assign({}, question.toObject()), { optionList: optionListWithIds });
            });
            const answeredQuestions = yield userQuestionMappingModel_1.default.find({ userId, categoryId }).select("questionId status");
            const answeredQuestionIds = answeredQuestions.map(q => q.questionId.toString());
            const notYetPresented = questionsWithOptionValues.filter(q => !answeredQuestionIds.includes(q._id.toString()));
            const unAttempted = answeredQuestions.filter(q => q.status === "UnAttempted").map(q => q.questionId.toString());
            const wronglyAnswered = answeredQuestions.filter(q => q.status === "WronglyAnswered").map(q => q.questionId.toString());
            const correctlyAnswered = answeredQuestions.filter(q => q.status === "CorrectlyAnswered").map(q => q.questionId.toString());
            let prioritizedQuestions = notYetPresented.length > 0 ? notYetPresented
                : unAttempted.length > 0 ? questionsWithOptionValues.filter(q => unAttempted.includes(q._id.toString()))
                    : wronglyAnswered.length > 0 ? questionsWithOptionValues.filter(q => wronglyAnswered.includes(q._id.toString()))
                        : questionsWithOptionValues.filter(q => correctlyAnswered.includes(q._id.toString()));
            if (prioritizedQuestions.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "No new questions available for this category.",
                });
            }
            const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
            const selectedQuestion = prioritizedQuestions[randomIndex];
            const activeSession = yield createSession(userId, categoryId);
            return res.status(200).json({
                status: true,
                message: "Question data fetched successfully.",
                sessionId: activeSession,
                data: selectedQuestion,
                questionNumber: activeSession.questionCount + 1,
                totalQuestions: yield getTotalQuestionsCount(),
                questionTime: yield getQuestionsTime(),
            });
        }
        else {
            const todayQuestions = yield userQuestionMappingModel_1.default.find({
                userId,
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            }).sort({ createdAt: -1 }).exec();
            if (todayQuestions.length >= 10) {
                return res.status(403).json({
                    status: false,
                    message: "You have reached the daily limit of 10 questions for non-subscribed users."
                });
            }
            const allQuestions = yield questionModel_1.default.find({ categoryId })
                .populate({ path: "categoryId", select: "_id categoryName" });
            if (allQuestions.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: `No questions found for category ID ${categoryId}.`,
                });
            }
            const questionsWithOptionValues = allQuestions.map((question) => {
                const optionListWithIds = question.optionList.map((option) => ({
                    optionValue: option.optionValue,
                    _id: option._id,
                }));
                return Object.assign(Object.assign({}, question.toObject()), { optionList: optionListWithIds });
            });
            const answeredQuestions = yield userQuestionMappingModel_1.default.find({ userId, categoryId }).select("questionId status");
            const answeredQuestionIds = answeredQuestions.map(q => q.questionId.toString());
            const notYetPresented = questionsWithOptionValues.filter(q => !answeredQuestionIds.includes(q._id.toString()));
            const unAttempted = answeredQuestions.filter(q => q.status === "UnAttempted").map(q => q.questionId.toString());
            const wronglyAnswered = answeredQuestions.filter(q => q.status === "WronglyAnswered").map(q => q.questionId.toString());
            let prioritizedQuestions = notYetPresented.length > 0 ? notYetPresented
                : unAttempted.length > 0 ? questionsWithOptionValues.filter(q => unAttempted.includes(q._id.toString()))
                    : wronglyAnswered.length > 0 ? questionsWithOptionValues.filter(q => wronglyAnswered.includes(q._id.toString()))
                        : [];
            if (prioritizedQuestions.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "No new questions available for this category.",
                });
            }
            const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
            const selectedQuestion = prioritizedQuestions[randomIndex];
            const activeSession = yield createSession(userId, categoryId);
            return res.status(200).json({
                status: true,
                message: "Question data fetched successfully.",
                sessionId: activeSession,
                data: selectedQuestion,
                questionNumber: activeSession.questionCount + 1,
                totalQuestions: yield getTotalQuestionsCount(),
                questionTime: yield getQuestionsTime(),
            });
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.getFiveQuestionByCategoryId = getFiveQuestionByCategoryId;
const getNextQuestionByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userId, questionId, categoryId, difficultyLevel, timeTaken, sessionId, isCorrect, } = req.body;
        if (!categoryId ||
            !difficultyLevel ||
            !userId ||
            !questionId ||
            !sessionId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }
        // let session: any = await getActiveSessionBySessionId(sessionId);
        // if (!session) {
        //     return res
        //         .status(400)
        //         .json({ status: false, message: "User already answered 5 questions" });
        // }
        let userQuestionLimit = yield verifyGivenQuestionLimit(sessionId);
        if (!userQuestionLimit) {
            return res
                .status(400)
                .json({ status: false, message: "User already answered 5 questions" });
        }
        difficultyLevel = isCorrect
            ? Math.min(difficultyLevel + 1, 8)
            : Math.max(difficultyLevel - 1, 1);
        const questions = yield questionModel_1.default
            .find({ categoryId, difficultyLevel })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "categoryId", select: "_id categoryName" });
        if (questions.length === 0) {
            return res.status(404).json({
                status: false,
                message: `No questions found for category ID ${categoryId} at difficulty level ${difficultyLevel}`,
            });
        }
        const answeredQuestions = yield userQuestionMappingModel_1.default
            .find({ userId, categoryId })
            .select("questionId status");
        const answeredQuestionIds = answeredQuestions.map((q) => ({
            id: q.questionId.toString(),
            status: q.status,
        }));
        const questionsWithOptionValues = questions.map((question) => {
            const optionListWithIds = question.optionList.map((option) => ({
                optionValue: option.optionValue,
                _id: option._id,
            }));
            return Object.assign(Object.assign({}, question.toObject()), { optionList: optionListWithIds, _id: question._id });
        });
        // Filter questions based on priorities
        const notPresented = questionsWithOptionValues.filter((q) => !answeredQuestionIds.some((a) => a.id === q._id.toString()));
        const unattempted = questionsWithOptionValues.filter((q) => answeredQuestionIds.some((a) => a.id === q._id.toString() && a.status === "UnAttempted"));
        const wronglyAnswered = questionsWithOptionValues.filter((q) => answeredQuestionIds.some((a) => a.id === q._id.toString() && a.status === "WronglyAnswered"));
        const correctlyAnswered = questionsWithOptionValues.filter((q) => answeredQuestionIds.some((a) => a.id === q._id.toString() && a.status === "CorrectlyAnswered"));
        let prioritizedQuestions = [
            ...notPresented,
            ...(notPresented.length === 0 ? unattempted : []),
            ...(notPresented.length === 0 && unattempted.length === 0
                ? wronglyAnswered
                : []),
            ...(notPresented.length === 0 &&
                unattempted.length === 0 &&
                wronglyAnswered.length === 0
                ? correctlyAnswered
                : []),
        ];
        if (prioritizedQuestions.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No new questions available for this category.",
            });
        }
        const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
        const question = prioritizedQuestions[randomIndex];
        res.status(200).json({
            status: true,
            message: "Question data fetched successfully.",
            data: question,
            questionNumber: yield getCurrentQuestionNoBySessions(sessionId),
            totalQuestions: yield getTotalQuestionsCount(),
            questionTime: yield getQuestionsTime(),
        });
    }
    catch (error) {
        console.error("Error fetching next question:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the next question.",
        });
    }
});
exports.getNextQuestionByCategoryId = getNextQuestionByCategoryId;
const verifyQuestionAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId, answer, answerId, sessionId, userId, categoryId, difficultyLevel, timeTaken, } = req.body;
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
            categoryId,
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
        const mappingResult = yield createUserQuestionMapping(mappingData);
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
            limitExceed: session_1.default,
        });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error: error });
    }
});
exports.verifyQuestionAnswer = verifyQuestionAnswer;
const bulkUploadQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const categoryId = req.query.categoryId;
        if (!file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (!categoryId) {
            return res.status(400).json({
                status: 400,
                message: "CategoryId is required",
            });
        }
        const workbook = xlsx_1.default.read(file.buffer, { type: 'buffer' });
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
                if (optionValue !== undefined && optionValue !== '') {
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
                categoryId: categoryId, // Use categoryId from req.params
                questionTime: item.questionTime,
                orgImgUrl: item.orgImgUrl,
                compImgUrl: item.compImgUrl,
                difficultyLevel: item.difficultyLevel,
                country: item.country,
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
        res.status(201).json({ status: true, message: 'Questions uploaded successfully', data: insertedQuestions });
    }
    catch (error) {
        console.error('Error during bulk upload:', error);
        res.status(500).json({ status: false, message: 'Internal server error', error });
    }
});
exports.bulkUploadQuestions = bulkUploadQuestions;
const getQuestionsCountByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionCounts = yield questionModel_1.default.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'questioncategories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $project: {
                    _id: 0,
                    categoryName: '$categoryDetails.categoryName',
                    categoryId: '$categoryDetails._id',
                    count: 1
                }
            }
        ]);
        res.status(200).json({
            status: true,
            message: 'Question count by category retrieved successfully',
            data: questionCounts
        });
    }
    catch (error) {
        console.error('Error getting question count by category:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            error
        });
    }
});
exports.getQuestionsCountByCategory = getQuestionsCountByCategory;
