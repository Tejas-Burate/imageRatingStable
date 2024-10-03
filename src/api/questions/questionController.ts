import userQuestion from "../../shared/utils/userQuestionMapping";
import questionModel from "./questionModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import xlsx from "xlsx";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import sharp from 'sharp';
import session from "../../shared/utils/session";
import setting from "../../shared/utils/setting";
import subscription from "../../shared/utils/subscription";
import userQuestionMappingModel from "../userQuestionMapping/userQuestionMappingModel";
import authModel from "../auth/authModel";
import userSubscriptionsModel from "../subscriptions/userSubscriptions/userSubscriptionsModel";
import questionCategoryModel from "../questionCategory/questionCategoryModel";
const { ObjectId } = mongoose.Types;

const { getTotalQuestionsCount, getQuestionsTime } = setting;
const {
    createSession,
    updateSession,
    getActiveSession,
    getActiveSessionBySessionId,
    verifyGivenQuestionLimit,
    getCurrentQuestionNoBySessions,
} = session;
const {
    createUserQuestionMapping,
    getPointsBySessionId,
    checkAvailableQuestion,
} = userQuestion;
const { generalQuizPlanExpired, isGeneralQuizSubscription } = subscription;


const createQuestion = async (req: Request, res: Response) => {
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
            questionCreator: decoded.userId as string,
            questionOwner: decoded.userId,
        });

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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error, error: error });
    }
};

const getAllQuestion = async (req: Request, res: Response) => {
    try {
        const question = await questionModel
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
            totalRecords: await questionModel.countDocuments(),
            message: "Question data fetch successfully..",
            data: question,
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getQuestionsFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit = 10, // Default limit
            start = 0,  // Default start
            categoryName,
            question,
            questionTime,
            difficultyLevel,
            country,
            questionCreator,
            questionOwner
        } = req.body;

        const filter: any = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            const [fullName, categoryName] = await Promise.all([
                authModel.findOne({ fullName: searchRegex }),
                questionCategoryModel.findOne({ categoryName: searchRegex }),
            ]);
            filter.$or = [
                { question: searchRegex },
                { orgImgUrl: searchRegex },
                { compImgUrl: searchRegex },
                { country: searchRegex },
                { questionCreator: fullName?._id },
                { questionOwner: fullName?._id },
                { categoryId: categoryName?._id },
                { "optionList.optionValue": searchRegex }
            ];
        }

        if (categoryName) {
            const categories = await questionCategoryModel.find({
                categoryName: new RegExp(categoryName, "i")
            });

            if (categories.length > 0) {
                filter.categoryId = { $in: categories.map(c => c._id) };
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
            const creators = await authModel.find({
                fullName: new RegExp(questionCreator, "i")
            });

            if (creators.length > 0) {
                filter.questionCreator = { $in: creators.map(c => c._id) };
            }
        }

        if (questionOwner) {
            const owners = await authModel.find({
                fullName: new RegExp(questionOwner, "i")
            });

            if (owners.length > 0) {
                filter.questionOwner = { $in: owners.map(o => o._id) };
            }
        }

        const questions = await questionModel.find(filter)
            .skip(parseInt(start))
            .limit(parseInt(limit))
            .populate("categoryId questionCreator questionOwner");

        if (questions.length === 0) {
            return res.status(404).json({ status: false, message: "No questions found" });
        }

        res.status(200).json({
            status: true,
            totalRecords: await questionModel.countDocuments(filter),
            message: "Questions fetched successfully",
            data: questions,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
};




const getQuestionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const question = await questionModel
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
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getAllQuestionByCategoryId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const question = await questionModel
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


const getFiveQuestionByCategoryId = async (req: Request, res: Response) => {
    try {
        const { userId, categoryId } = req.body;

        if (!categoryId || !userId) {
            return res.status(400).json({ status: false, message: "Missing required parameters." });
        }

        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: `User with ID ${userId} is not found.` });
        }

        const category = await questionCategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ status: false, message: `Category with ID ${categoryId} not found.` });
        }

        const categoryName: any = category.categoryName;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const categoriesWithCountryFilter = ["Geography", "Sports", "History", "Arts"];
        let questionQuery: any = { categoryId };

        if (categoriesWithCountryFilter.includes(categoryName)) {
            questionQuery = {
                categoryId,
                $or: [
                    { globalView: true },
                    { country: { $in: user.country } }
                ]
            };
        } else {
            questionQuery.globalView = true; // Ensure global questions are always included
        }

        console.log('questionQuery', questionQuery);


        if (await isGeneralQuizSubscription(userId)) {
            if (await generalQuizPlanExpired(userId)) {
                return res.status(400).json({ status: false, message: "Your general quiz plan has expired. Please renew your subscription." });
            }

            const allQuestions = await questionModel.find(questionQuery).populate({ path: "categoryId", select: "_id categoryName" });

            if (allQuestions.length === 0) {
                return res.status(404).json({ status: false, message: `No questions found for category ID ${categoryId}.` });
            }

            const questionsWithOptionValues = allQuestions.map((question) => {
                const optionListWithIds = question.optionList.map((option) => ({
                    optionValue: option.optionValue,
                    _id: option._id,
                }));
                return { ...question.toObject(), optionList: optionListWithIds };
            });

            const answeredQuestions = await userQuestionMappingModel.find({ userId, categoryId }).select("questionId status");
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
                return res.status(404).json({ status: false, message: "No new questions available for this category." });
            }

            const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
            const selectedQuestion = prioritizedQuestions[randomIndex];

            const activeSession = await createSession(userId, categoryId);

            return res.status(200).json({
                status: true,
                message: "Question data fetched successfully.",
                sessionId: activeSession,
                data: selectedQuestion,
                questionOccurringCount: await userQuestionMappingModel.countDocuments({ userId: userId, questionId: selectedQuestion._id }) + 1,
                questionNumber: activeSession.questionCount + 1,
                totalQuestions: await getTotalQuestionsCount(),
                questionTime: await getQuestionsTime(),
            });
        } else {
            const todayQuestions = await userQuestionMappingModel.find({
                userId,
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            }).sort({ createdAt: -1 }).exec();

            if (todayQuestions.length >= 15 || todayQuestions.length == 15) {
                return res.status(403).json({ status: false, message: "You have reached the daily limit of 15 questions for non-subscribed users." });
            }

            const allQuestions = await questionModel.find(questionQuery).populate({ path: "categoryId", select: "_id categoryName" });
            // console.log('allQuestions', allQuestions)

            if (allQuestions.length === 0) {
                return res.status(404).json({ status: false, message: `No questions found for category ID ${categoryId}.` });
            }

            const questionsWithOptionValues = allQuestions.map((question) => {
                const optionListWithIds = question.optionList.map((option) => ({
                    optionValue: option.optionValue,
                    _id: option._id,
                }));
                return { ...question.toObject(), optionList: optionListWithIds };
            });

            const answeredQuestions = await userQuestionMappingModel.find({ userId, categoryId }).select("questionId status");
            const answeredQuestionIds = answeredQuestions.map(q => q.questionId.toString());

            const notYetPresented = questionsWithOptionValues.filter(q => !answeredQuestionIds.includes(q._id.toString()));
            const unAttempted = answeredQuestions.filter(q => q.status === "UnAttempted").map(q => q.questionId.toString());
            const wronglyAnswered = answeredQuestions.filter(q => q.status === "WronglyAnswered").map(q => q.questionId.toString());

            let prioritizedQuestions = notYetPresented.length > 0 ? notYetPresented
                : unAttempted.length > 0 ? questionsWithOptionValues.filter(q => unAttempted.includes(q._id.toString()))
                    : wronglyAnswered.length > 0 ? questionsWithOptionValues.filter(q => wronglyAnswered.includes(q._id.toString()))
                        : [];


            if (prioritizedQuestions.length === 0) {
                return res.status(404).json({ status: false, message: "No new questions available for this category." });
            }

            const randomIndex = Math.floor(Math.random() * prioritizedQuestions.length);
            // console.log('randomIndex', randomIndex)
            const selectedQuestion = prioritizedQuestions[randomIndex];
            //Count Logic
            console.log('userQuestion', userQuestion)
            console.log('selectedQuestion', selectedQuestion)

            const activeSession = await createSession(userId, categoryId);

            return res.status(200).json({
                status: true,
                message: "Question data fetched successfully.",
                sessionId: activeSession,
                data: selectedQuestion,
                questionOccurringCount: await userQuestionMappingModel.countDocuments({ userId: userId, questionId: selectedQuestion._id }) + 1,
                questionNumber: activeSession.questionCount + 1,
                totalQuestions: await getTotalQuestionsCount(),
                questionTime: await getQuestionsTime(),
            });
        }
    } catch (error: any) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error.message || "Internal server error" });
    }
};




const getNextQuestionByCategoryId = async (req: Request, res: Response) => {
    try {
        let {
            userId,
            questionId,
            categoryId,
            difficultyLevel,
            timeTaken,
            sessionId,
            isCorrect,
        } = req.body;

        if (!categoryId || !difficultyLevel || !userId || !questionId || !sessionId) {
            return res
                .status(400)
                .json({ status: false, message: "Missing required parameters." });
        }

        let user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: `User with ID ${userId} is not found.` });
        }

        let userQuestionLimit = await verifyGivenQuestionLimit(sessionId);
        if (!userQuestionLimit) {
            return res
                .status(400)
                .json({ status: false, message: "User already answered 5 questions" });
        }

        difficultyLevel = isCorrect
            ? Math.min(difficultyLevel + 1, 8)
            : Math.max(difficultyLevel - 1, 1);

        const category = await questionCategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ status: false, message: `Category with ID ${categoryId} not found.` });
        }

        const categoryName: any = category.categoryName;
        const categoriesWithCountryFilter = ["Geography", "Sports", "History", "Arts"];

        let questionQuery: any = { categoryId, difficultyLevel };

        // Add country filter if the category is one of the specified categories
        // if (categoriesWithCountryFilter.includes(categoryName)) {
        //     questionQuery.country = { $in: user.country };
        // }

        if (categoriesWithCountryFilter.includes(categoryName)) {
            questionQuery = {
                categoryId,
                difficultyLevel,
                $or: [
                    { globalView: true },
                    { country: { $in: user.country } }
                ]
            };
        } else {
            questionQuery.globalView = true; // Ensure global questions are always included
        }


        // Find answered questions in the current session to exclude them from the next question selection
        const answeredQuestionsInSession = await userQuestionMappingModel
            .find({ userId, categoryId, sessionId })
            .select("questionId status");

        const answeredQuestionIdsInSession = answeredQuestionsInSession.map((q) => ({
            id: q.questionId.toString(),
            status: q.status,
        }));

        const answeredQuestionIds = answeredQuestionIdsInSession.map(q => q.id);

        // Exclude questions that were answered in the current session
        questionQuery._id = { $nin: answeredQuestionIds };

        const questions = await questionModel
            .find(questionQuery)
            .populate({ path: "questionOwner", select: "_id fullName" })
            .populate({ path: "categoryId", select: "_id categoryName" });

        if (questions.length === 0) {
            return res.status(404).json({
                status: false,
                message: `No questions found for category ID ${categoryId} at difficulty level ${difficultyLevel}`,
            });
        }

        const answeredQuestions = await userQuestionMappingModel
            .find({ userId, categoryId })
            .select("questionId status");

        const answeredQuestionIdsOverall = answeredQuestions.map((q) => ({
            id: q.questionId.toString(),
            status: q.status,
        }));

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

        // Filter questions based on priorities
        const notPresented = questionsWithOptionValues.filter(
            (q) => !answeredQuestionIdsOverall.some((a) => a.id === q._id.toString())
        );
        const unattempted = questionsWithOptionValues.filter((q) =>
            answeredQuestionIdsOverall.some(
                (a) => a.id === q._id.toString() && a.status === "UnAttempted"
            )
        );
        const wronglyAnswered = questionsWithOptionValues.filter((q) =>
            answeredQuestionIdsOverall.some(
                (a) => a.id === q._id.toString() && a.status === "WronglyAnswered"
            )
        );
        const correctlyAnswered = questionsWithOptionValues.filter((q) =>
            answeredQuestionIdsOverall.some(
                (a) => a.id === q._id.toString() && a.status === "CorrectlyAnswered"
            )
        );

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
            questionOccurringCount: await userQuestionMappingModel.countDocuments({ userId: userId, questionId: question._id }) + 1,
            questionNumber: await getCurrentQuestionNoBySessions(sessionId),
            totalQuestions: await getTotalQuestionsCount(),
            questionTime: await getQuestionsTime(),
        });
    } catch (error) {
        console.error("Error fetching next question:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the next question.",
            error: error
        });
    }
};

const verifyQuestionAnswer = async (req: Request, res: Response) => {
    try {
        const {
            questionId,
            answer,
            answerId,
            sessionId,
            userId,
            categoryId,
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
            categoryId,
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

        const mappingResult = await createUserQuestionMapping(mappingData);
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

// const bulkUploadQuestions = async (req: Request, res: Response) => {
//     try {
//         const file = req.file;
//         const categoryId = req.query.categoryId;

//         if (!file) {
//             return res.status(400).json({ status: false, message: 'No file uploaded' });
//         }

//         if (!categoryId) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "CategoryId is required",
//             });
//         }

//         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);

//         const errors: any[] = [];
//         const badData: any[] = [];

//         const questions: any = data.map((item: any, index: number) => {
//             const optionList = [];
//             for (let i = 0; i < 5; i++) {
//                 const optionValue = item[`optionList[${i}].optionValue`];
//                 const isCorrect = item[`optionList[${i}].isCorrect`];

//                 if (optionValue !== undefined && optionValue !== '') {
//                     optionList.push({ optionValue, isCorrect: isCorrect || false });
//                 }
//             }

//             const missingFields = [];
//             const invalidFields = [];

//             if (!item.question) {
//                 missingFields.push("question");
//             } else if (typeof item.question !== "string") {
//                 invalidFields.push("question (should be string)");
//             }



//             // if (!item.orgImgUrl) {
//             //     missingFields.push("orgImgUrl");
//             // } else if (typeof item.orgImgUrl !== "string") {
//             //     invalidFields.push("orgImgUrl (should be string)");
//             // }

//             // if (!item.compImgUrl) {
//             //     missingFields.push("compImgUrl");
//             // } else if (typeof item.compImgUrl !== "string") {
//             //     invalidFields.push("compImgUrl (should be string)");
//             // }

//             if (!item.difficultyLevel) {
//                 missingFields.push("difficultyLevel");
//             } else if (typeof item.difficultyLevel !== "number") {
//                 invalidFields.push("difficultyLevel (should be number)");
//             }

//             if (!item.country) {
//                 missingFields.push("country");
//             } else if (typeof item.country !== "string") {
//                 invalidFields.push("country (should be string)");
//             }
//             // if (!item.globalView) {
//             //     missingFields.push("globalView");
//             // } else if (typeof item.globalView !== "boolean") {
//             //     invalidFields.push("globalView (should be boolean)");
//             // }

//             if (!item.questionCreator) {
//                 missingFields.push("questionCreator");
//             } else if (typeof item.questionCreator !== "string") {
//                 invalidFields.push("questionCreator (should be string)");
//             }

//             if (!item.questionOwner) {
//                 missingFields.push("questionOwner");
//             } else if (typeof item.questionOwner !== "string") {
//                 invalidFields.push("questionOwner (should be string)");
//             }

//             console.log('missingFields', missingFields)
//             if (missingFields.length > 0 || invalidFields.length > 0) {
//                 errors.push({
//                     row: index + 1,
//                     missingFields,
//                     invalidFields,
//                 });
//                 badData.push({ ...item, row: index + 1 });
//             }

//             return {
//                 question: item.question,
//                 categoryId: categoryId, // Use categoryId from req.params
//                 questionTime: item.questionTime,
//                 orgImgUrl: item.orgImgUrl,
//                 compImgUrl: item.compImgUrl,
//                 difficultyLevel: item.difficultyLevel,
//                 country: item.country,
//                 globalView: item.globalView,
//                 questionCreator: item.questionCreator,
//                 questionOwner: item.questionOwner,
//                 optionList,
//             };
//         });

//         if (errors.length > 0) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "There are errors in the Excel file",
//                 errors,
//                 badData,
//             });
//         }

//         const insertedQuestions = await questionModel.insertMany(questions);

//         res.status(201).json({ status: true, message: 'Questions uploaded successfully', data: insertedQuestions });
//     } catch (error) {
//         console.error('Error during bulk upload:', error);
//         res.status(500).json({ status: false, message: 'Internal server error', error });
//     }
// };


const getQuestionsCountByCategory = async (req: Request, res: Response) => {
    try {
        const questionCounts = await questionModel.aggregate([
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
    } catch (error) {
        console.error('Error getting question count by category:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            error
        });
    }
};

const originalDir = path.resolve(__dirname, "../../../public/originals");
const compressedDir = path.resolve(__dirname, "../../../public/compressed");

// Ensure the directories exist
if (!fs.existsSync(originalDir)) {
    fs.mkdirSync(originalDir, { recursive: true });
}
if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
}

// Multer storage configuration for saving original images
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
    },
});

const bulkUploadQuestions = async (req: Request, res: Response) => {
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

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const errors: any[] = [];
        const badData: any[] = [];

        const questions: any = await Promise.all(data.map(async (item: any, index: number) => {
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
            } else if (typeof item.question !== "string") {
                invalidFields.push("question (should be string)");
            }

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

            // Upload images and get URLs
            let orgImgUrl = null;
            let compImgUrl = null;

            if (item.orgImgUrl) {
                orgImgUrl = await saveImageLocallyAndCompress(item.orgImgUrl);
            }

            if (item.compImgUrl) {
                compImgUrl = await saveImageLocallyAndCompress(item.compImgUrl);
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
                categoryId: categoryId,
                questionTime: item.questionTime,
                orgImgUrl,
                compImgUrl,
                difficultyLevel: item.difficultyLevel,
                country: item.country,
                globalView: item.globalView,
                questionCreator: item.questionCreator,
                questionOwner: item.questionOwner,
                optionList,
            };
        }));

        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "There are errors in the Excel file",
                errors,
                badData,
            });
        }

        const insertedQuestions = await questionModel.insertMany(questions);

        res.status(201).json({ status: true, message: 'Questions uploaded successfully', data: insertedQuestions });
    } catch (error) {
        console.error('Error during bulk upload:', error);
        res.status(500).json({ status: false, message: 'Internal server error', error });
    }
};

// Helper function to save an image locally and compress it
const saveImageLocallyAndCompress = async (imagePath: string) => {
    try {
        const fileExt = path.extname(imagePath);
        const fileName = `${uuidv4()}${fileExt}`;
        const originalPath = path.join(originalDir, fileName);
        const compressedFileName = `compressed-${fileName.split('.')[0]}.webp`; // Convert to WebP format
        const compressedPath = path.join(compressedDir, compressedFileName);

        // Ensure the directory exists
        await fs.promises.mkdir(path.dirname(originalPath), { recursive: true });

        // Read the image file and save it to the original folder
        const fileContent = await fs.promises.readFile(imagePath);
        await fs.promises.writeFile(originalPath, fileContent);

        // Compress and convert the image to WebP using sharp
        await sharp(originalPath)
            .resize({
                width: 800,
                withoutEnlargement: true,
            })
            .webp({
                quality: 60, // Adjust the quality for WebP format
            })
            .toFile(compressedPath);

        // Return the URLs to the saved images
        return {
            // originalUrl: `/originals/${fileName}`,
            // compressedUrl: `/compressed/${compressedFileName}`,
            originalUrl: `https://imagerating.ioweb3.in/${fileName}`,
            compressedUrl: `https://imagerating.ioweb3.in/${compressedFileName}`,
        };
    } catch (error) {
        console.error('Error saving and compressing image:', error);
        throw new Error('Failed to save and compress image');
    }
};

export {
    createQuestion,
    verifyQuestionAnswer,
    getAllQuestion,
    getQuestionById,
    getAllQuestionByCategoryId,
    getFiveQuestionByCategoryId,
    getNextQuestionByCategoryId,
    updateQuestionById,
    deleteQuestionById,
    bulkUploadQuestions,
    upload,
    getQuestionsCountByCategory,
    getQuestionsFilters
};
