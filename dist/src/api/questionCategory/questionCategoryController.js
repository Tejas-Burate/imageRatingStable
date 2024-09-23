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
exports.deleteQuestionCategoryById = exports.updateQuestionCategoryById = exports.getQuestionCategoryById = exports.getAllMinorQuestionCategoryByUserId = exports.getQuestionCategoryFilters = exports.getAllQuestionCategory = exports.createQuestionCategory = void 0;
const authModel_1 = __importDefault(require("../auth/authModel"));
const superQuestionCategoryModel_1 = __importDefault(require("../superQuestionCategory/superQuestionCategoryModel"));
const userSuperCategoryModel_1 = __importDefault(require("../userSuperCategory/userSuperCategoryModel"));
const questionCategoryModel_1 = __importDefault(require("./questionCategoryModel"));
const createQuestionCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionCategory = yield questionCategoryModel_1.default.create(Object.assign({}, req.body));
        console.log('questionCategory', questionCategory);
        if (!questionCategory) {
            res.status(400).json({ status: false, message: "Error for creating QuestionCategory" });
            return;
        }
        res.status(200).json({ status: true, message: "QuestionCategory data fetch successfully..", data: questionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createQuestionCategory = createQuestionCategory;
const getAllQuestionCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionCategory = yield questionCategoryModel_1.default.find();
        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "QuestionCategory data not found" });
            return;
        }
        res.status(200).json({ status: true, totalRecords: yield questionCategoryModel_1.default.countDocuments(), message: "QuestionCategory data fetch successfully..", data: questionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllQuestionCategory = getAllQuestionCategory;
const getQuestionCategoryFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, // Default limit
        start, // Default start
        categoryName, } = req.body;
        const filter = {};
        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");
            // Array to hold search conditions
            const searchConditions = [
                { categoryName: searchRegex },
            ];
            filter.$or = searchConditions;
        }
        // Additional filters for specific fields
        if (categoryName) {
            filter.categoryName = new RegExp(categoryName, "i");
        }
        const questionCategory = yield questionCategoryModel_1.default.find(filter).skip(parseInt(start)).limit(parseInt(limit));
        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Question Category data not found" });
            return;
        }
        res
            .status(200)
            .json({
            status: true,
            totalRecords: yield questionCategoryModel_1.default.countDocuments(filter),
            message: "Question category data fetch successfully..",
            data: questionCategory,
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getQuestionCategoryFilters = getQuestionCategoryFilters;
const getAllMinorQuestionCategoryByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield authModel_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: `User od id ${id} is not found..` });
        }
        const userSuperCategory = yield userSuperCategoryModel_1.default.findOne({ userId: id }).select("superQuestionCategoryId");
        if (!userSuperCategory) {
            return res.status(400).json({ status: false, message: "this minor user does not selected superCategory" });
        }
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.findById(userSuperCategory.superQuestionCategoryId).populate("questionCategories");
        if (!superQuestionCategory) {
            return res.status(404).json({ status: false, message: `userSuperCategory for user id ${id} is not found` });
        }
        res.status(200).json({ status: true, totalRecords: yield questionCategoryModel_1.default.countDocuments(), message: "QuestionCategory data fetch successfully..", data: superQuestionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllMinorQuestionCategoryByUserId = getAllMinorQuestionCategoryByUserId;
const getQuestionCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const questionCategory = yield questionCategoryModel_1.default.findById(id);
        if (!questionCategory) {
            res.status(404).json({ status: false, message: `QuestionCategory data of questionCategoryID ${id} not found` });
            return;
        }
        res.status(200).json({ status: true, message: "QuestionCategory data fetch successfully..", data: questionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getQuestionCategoryById = getQuestionCategoryById;
const updateQuestionCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const questionCategory = yield questionCategoryModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!questionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated QuestionCategory data of questionCategoryID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "QuestionCategory data updated successfully..", data: questionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateQuestionCategoryById = updateQuestionCategoryById;
const deleteQuestionCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const questionCategory = yield questionCategoryModel_1.default.findByIdAndDelete(id);
        if (!questionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated QuestionCategory data of questionCategoryID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "QuestionCategory data updated successfully..", data: questionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteQuestionCategoryById = deleteQuestionCategoryById;
