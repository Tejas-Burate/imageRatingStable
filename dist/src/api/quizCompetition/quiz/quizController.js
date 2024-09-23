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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuizById = exports.updateQuizById = exports.getQuizFilters = exports.getAllQuiz = exports.getQuizById = exports.createQuiz = void 0;
const quizModel_1 = __importDefault(require("./quizModel"));
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { registrationStartDate } = _a, body = __rest(_a, ["registrationStartDate"]);
        if (!registrationStartDate) {
            return res.status(400).json({ status: false, message: "registrationStartDate is required" });
        }
        const startDate = new Date(registrationStartDate);
        const endDate = new Date(startDate.getTime() - 15 * 60 * 1000);
        const quizData = Object.assign(Object.assign({}, body), { quizStartDateAndTime: startDate, registrationStartDate: startDate, registrationEndDate: endDate });
        console.log('Quiz data:', quizData);
        const quiz = yield quizModel_1.default.create(quizData);
        if (!quiz) {
            return res.status(400).json({ status: false, message: "Failed to create new quiz" });
        }
        res.status(201).json({ status: true, message: "Quiz created successfully", data: quiz });
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.createQuiz = createQuiz;
// const createQuiz = async (req: Request, res: Response) => {
//     try {
//         const quiz = await quizModel.create({ ...req.body });
//         if (!quiz) {
//             return res.status(400).json({ status: false, message: "Failed to created new quiz" });
//         }
//         res.status(201).json({ status: true, message: "Quiz created successfully", data: quiz });
//     } catch (error) {
//         console.log('error', error)
//         res.status(500).json({ status: false, error: "Internal server error", message: error })
//     }
// }
const getQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const quiz = yield quizModel_1.default.findById(id);
        if (!quiz) {
            return res.status(404).json({ status: false, message: "Quiz data not found" });
        }
        res.status(200).json({ status: true, message: "Quiz data fetch successfully", data: quiz });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getQuizById = getQuizById;
const getAllQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield quizModel_1.default.find();
        if (!quiz) {
            return res.status(404).json({ status: false, message: "Quiz data not found" });
        }
        res.status(200).json({ status: true, message: "Quiz created successfully", data: quiz });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getAllQuiz = getAllQuiz;
const getQuizFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, // Default limit
        start, // Default start
        quizName, quizDescription, totalQuestions, quizTime } = req.body;
        const filter = {};
        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");
            // Array to hold search conditions for string fields
            const searchConditions = [
                { quizName: searchRegex },
                { quizDescription: searchRegex },
            ];
            filter.$or = searchConditions;
        }
        // Additional filters for specific fields
        if (quizName) {
            filter.quizName = new RegExp(quizName, "i");
        }
        if (quizDescription) {
            filter.quizDescription = new RegExp(quizDescription, "i");
        }
        if (totalQuestions) {
            filter.totalQuestions = Number(totalQuestions);
        }
        if (quizTime) {
            filter.quizTime = Number(quizTime);
        }
        const questionCategory = yield quizModel_1.default.find(filter).skip(Number(start)).limit(Number(limit));
        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Quiz Competition Category data not found" });
            return;
        }
        res.status(200).json({
            status: true,
            totalRecords: yield quizModel_1.default.countDocuments(filter),
            message: "Quiz Competition category data fetch successfully.",
            data: questionCategory,
        });
    }
    catch (error) {
        console.error('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getQuizFilters = getQuizFilters;
const updateQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const quiz = yield quizModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!quiz) {
            return res.status(400).json({ status: false, message: "Failed to update the quiz" });
        }
        res.status(200).json({ status: true, message: "Quiz updated successfully", data: quiz });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.updateQuizById = updateQuizById;
const deleteQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const quiz = yield quizModel_1.default.findByIdAndDelete(id);
        if (!quiz) {
            return res.status(400).json({ status: false, message: "Failed to delete the quiz" });
        }
        res.status(200).json({ status: true, message: "Quiz deleted successfully", data: quiz });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.deleteQuizById = deleteQuizById;
