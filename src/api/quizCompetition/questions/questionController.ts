import userQuizCompetition from "../../../shared/utils/userQuizQuestion";
import questionModel from "./questionModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import session from "../../../shared/utils/competitionSession";
import setting from "../../../shared/utils/setting";
import userQuizCompetitionModel from "../userQuizCompetitionQuestion/userQuizCompetitionQuestionModel";
import authModel from "../../auth/authModel";
import xlsx from "xlsx";
import sessionModel from "../session/sessionModel";
import quizModel from "../quiz/quizModel";
import subscription from "../../../shared/utils/subscription";
const { ObjectId } = mongoose.Types;
const {
    createUserQuizQuestionMapping,
    getActiveQuizSessionBySessionId,
    getPointsBySessionId,
} = userQuizCompetition;
const { getCompetitionTotalQuestionsCount, getCompetitionQuestionsTime } =
    setting;
const {
    createSession,
    updateSession,
    hasQuizStarted,
    getActiveSession,
    getActiveSessionBySessionId,
    getCurrentQuestionNoBySessions,
} = session;
const { competitionQuizPlanExpired, isCompetitionQuizSubscription } =
    subscription;

const createQuizQuestion = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ status: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.Jwt_Secret_Key as string
        ) as any;

        const question = await questionModel.create({
            ...req.body,
            questionCreator: decoded.userInfo._id as string,
            questionOwner: decoded.userInfo._id,
        });

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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getAllQuestion = async (req: Request, res: Response) => {
    try {
        const question = await questionModel
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
            totalRecords: await questionModel.countDocuments(),
            message: "Question data fetch successfully..",
            data: question,
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getCompetitionQuestionsFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit = 10, // Default limit
            start = 0, // Default start
            quizName,
            question,
            difficultyLevel,
            country,
            questionCreator,
            questionOwner,
        } = req.body;

        const filter: any = {};

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
            const categories = await quizModel.find({
                quizName: new RegExp(quizName, "i"),
            });

            if (categories.length > 0) {
                filter.quizId = { $in: categories.map((c) => c._id) };
            } else {
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
            const creators = await authModel.find({
                fullName: new RegExp(questionCreator, "i"),
            });

            if (creators.length > 0) {
                filter.questionCreator = { $in: creators.map((c) => c._id) };
            } else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching creators found" });
            }
        }

        if (questionOwner) {
            const owners = await authModel.find({
                fullName: new RegExp(questionOwner, "i"),
            });

            if (owners.length > 0) {
                filter.questionOwner = { $in: owners.map((o) => o._id) };
            } else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching owners found" });
            }
        }

        const questions = await questionModel
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
            totalRecords: await questionModel.countDocuments(filter),
            message: "Questions fetched successfully",
            data: questions,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};

const getQuestionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const question = await questionModel
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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getAllQuestionByCategoryId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const question = await questionModel
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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const updateQuestionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const question = await questionModel.findByIdAndUpdate(id, { ...req.body });

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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const deleteQuestionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const question = await questionModel.findByIdAndDelete(id);

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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

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

const getFiveByQuestionByQuizId = async (req: Request, res: Response) => {
    try {
        const { userId, quizId } = req.body;

        if (!quizId || !userId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }

        const user = await authModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    status: false,
                    message: `User with ID ${userId} is not found.`,
                });
        }

        const quiz = await quizModel.findById(quizId);
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
        if (!(await isCompetitionQuizSubscription(userId))) {
            return res
                .status(401)
                .json({
                    status: false,
                    message: "Please buy subscription before starting quiz competition..",
                });
        }

        if (await competitionQuizPlanExpired(userId)) {
            return res
                .status(401)
                .json({
                    status: false,
                    message:
                        "Your subscription is expired, please renew your competition quiz subscription",
                });
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const allQuestions = await questionModel
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

            return {
                ...question.toObject(), // Convert Mongoose document to plain object
                optionList: optionListWithIds, // Replace optionList with optionValue and _id
            };
        });

        const answeredQuestions = await userQuizCompetitionModel
            .find({ userId, quizId })
            .select("questionId status");
        const answeredQuestionIds = answeredQuestions.map((q) =>
            q.questionId.toString()
        );

        const notYetPresented = questionsWithOptionValues.filter(
            (q) => !answeredQuestionIds.includes(q._id.toString())
        );
        const unAttempted = answeredQuestions
            .filter((q) => q.status === "UnAttempted")
            .map((q) => q.questionId.toString());
        const wronglyAnswered = answeredQuestions
            .filter((q) => q.status === "WronglyAnswered")
            .map((q) => q.questionId.toString());
        const correctlyAnswered = answeredQuestions
            .filter((q) => q.status === "CorrectlyAnswered")
            .map((q) => q.questionId.toString());

        let prioritizedQuestions =
            notYetPresented.length > 0
                ? notYetPresented
                : unAttempted.length > 0
                    ? questionsWithOptionValues.filter((q) =>
                        unAttempted.includes(q._id.toString())
                    )
                    : wronglyAnswered.length > 0
                        ? questionsWithOptionValues.filter((q) =>
                            wronglyAnswered.includes(q._id.toString())
                        )
                        : questionsWithOptionValues.filter((q) =>
                            correctlyAnswered.includes(q._id.toString())
                        );

        if (prioritizedQuestions.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No new questions available for this category.",
            });
        }

        const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
        const selectedQuestion = prioritizedQuestions[randomIndex];

        const activeSession = await createSession(userId, quizId);

        return res.status(200).json({
            status: true,
            message: "Question data fetched successfully.",
            sessionId: activeSession,
            data: selectedQuestion,
            questionNumber: activeSession.questionCount + 1,
            totalQuestions: await getCompetitionTotalQuestionsCount(),
            questionTime: await getCompetitionQuestionsTime(),
        });
    } catch (error: any) {
        console.log("error", error);
        res.status(500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

const getNextQuestionByQuizId = async (req: Request, res: Response) => {
    try {
        let {
            userId,
            questionId,
            quizId,
            difficultyLevel,
            timeTaken,
            sessionId,
            isCorrect,
        } = req.body;

        if (!quizId || !difficultyLevel || !userId || !questionId || !sessionId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }

        let session: any = await getActiveQuizSessionBySessionId(sessionId);
        if (!session) {
            return res
                .status(400)
                .json({ status: false, message: "User already answered 5 questions" });
        }

        difficultyLevel = isCorrect
            ? Math.min(difficultyLevel + 1, 8)
            : Math.max(difficultyLevel - 1, 1);

        const questions = await questionModel
            .find({ quizId, difficultyLevel })
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "quizId", select: "_id quizName" });

        if (questions.length === 0) {
            return res.status(404).json({
                status: false,
                message: `No questions found for quiz ID ${quizId} at difficulty level ${difficultyLevel}`,
            });
        }

        const answeredQuestions = await userQuizCompetitionModel
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

            return {
                ...question.toObject(),
                optionList: optionListWithIds,
                _id: question._id, // Assuming you want to keep the question's own _id
            };
        });

        // Filter questions based on priorities and session presentation
        const notPresented = questionsWithOptionValues.filter(
            (q) => !answeredQuestionIds.some((a) => a.id === q._id.toString())
        );
        const unattempted = questionsWithOptionValues.filter((q) =>
            answeredQuestionIds.some(
                (a) => a.id === q._id.toString() && a.status === "UnAttempted"
            )
        );
        const wronglyAnswered = questionsWithOptionValues.filter((q) =>
            answeredQuestionIds.some(
                (a) => a.id === q._id.toString() && a.status === "WronglyAnswered"
            )
        );
        const correctlyAnswered = questionsWithOptionValues.filter((q) =>
            answeredQuestionIds.some(
                (a) => a.id === q._id.toString() && a.status === "CorrectlyAnswered"
            )
        );

        let prioritizedQuestions = [
            ...notPresented.filter(
                (q) => !presentedQuestionsInSession.includes(q._id.toString())
            ),
            ...(notPresented.length === 0 ? unattempted : []).filter(
                (q) => !presentedQuestionsInSession.includes(q._id.toString())
            ),
            ...(notPresented.length === 0 && unattempted.length === 0
                ? wronglyAnswered
                : []
            ).filter((q) => !presentedQuestionsInSession.includes(q._id.toString())),
            ...(notPresented.length === 0 &&
                unattempted.length === 0 &&
                wronglyAnswered.length === 0
                ? correctlyAnswered
                : []
            ).filter((q) => !presentedQuestionsInSession.includes(q._id.toString())),
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
            questionNumber: await getCurrentQuestionNoBySessions(sessionId),
            totalQuestions: await getCompetitionTotalQuestionsCount(),
            questionTime: await getCompetitionQuestionsTime(),
        });
    } catch (error) {
        console.error("Error fetching next question:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the next question.",
            error: error,
        });
    }
};

const verifyQuizQuestionAnswer = async (req: Request, res: Response) => {
    try {
        const {
            questionId,
            answer,
            answerId,
            sessionId,
            userId,
            quizId,
            difficultyLevel,
            timeTaken,
        } = req.body;

        const getQuestion = await questionModel.findById(questionId);
        if (!getQuestion) {
            res.status(404).json({
                status: false,
                message: `Question of ID ${questionId} is not found`,
            });
            return;
        }

        const correctAnswer = getQuestion.optionList.filter(
            (q: any) => q.isCorrect == true
        );
        const checkAnswer = getQuestion.optionList.some(
            (q: any) => q._id == answerId && q.isCorrect == true
        );
        const mappingData = {
            userId,
            questionId,
            quizId,
            answer,
            isCorrect: checkAnswer,
            difficultyLevel,
            sessionId,
            timeTaken,
            status:
                answer === "null"
                    ? "UnAttempted"
                    : checkAnswer
                        ? "CorrectlyAnswered"
                        : "WronglyAnswered",
        };

        const mappingResult = await createUserQuizQuestionMapping(mappingData);
        if (!mappingResult) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to create new record" });
        }
        await updateSession(sessionId);

        res.status(200).json({
            isCorrect: checkAnswer,
            submittedAnswer: answer,
            answerId: answerId,
            correctAnswer: correctAnswer,
            totalPoints: await getPointsBySessionId(sessionId),
            limitExceed: session,
        });
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error: error });
    }
};

const bulkUploadCompetitionQuestions = async (req: Request, res: Response) => {
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

        const workbook = xlsx.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const errors: any[] = [];
        const badData: any[] = [];

        const questions: any = data.map((item: any, index: number) => {
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
            } else if (typeof item.question !== "string") {
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
            } else if (typeof item.difficultyLevel !== "number") {
                invalidFields.push("difficultyLevel (should be number)");
            }

            if (!item.country) {
                missingFields.push("country");
            } else if (typeof item.country !== "string") {
                invalidFields.push("country (should be string)");
            }

            if (!item.questionCreator) {
                missingFields.push("questionCreator");
            } else if (typeof item.questionCreator !== "string") {
                invalidFields.push("questionCreator (should be string)");
            }

            if (!item.questionOwner) {
                missingFields.push("questionOwner");
            } else if (typeof item.questionOwner !== "string") {
                invalidFields.push("questionOwner (should be string)");
            }

            if (missingFields.length > 0 || invalidFields.length > 0) {
                errors.push({
                    row: index + 1,
                    missingFields,
                    invalidFields,
                });
                badData.push({ ...item, row: index + 1 });
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

        const insertedQuestions = await questionModel.insertMany(questions);

        res
            .status(201)
            .json({
                status: true,
                message: "Questions uploaded successfully",
                data: insertedQuestions,
            });
    } catch (error) {
        console.error("Error during bulk upload:", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error });
    }
};

export {
    createQuizQuestion,
    verifyQuizQuestionAnswer,
    getAllQuestion,
    getQuestionById,
    getAllQuestionByCategoryId,
    getFiveByQuestionByQuizId,
    bulkUploadCompetitionQuestions,
    getNextQuestionByQuizId,
    updateQuestionById,
    deleteQuestionById,
    getCompetitionQuestionsFilters,
};
