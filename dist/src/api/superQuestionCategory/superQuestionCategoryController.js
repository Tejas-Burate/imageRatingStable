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
exports.getSuperQuestionCategoryFilters = exports.setSuperQuestionCategory = exports.deleteSuperQuestionCategoryById = exports.updateSuperQuestionCategoryById = exports.getSuperQuestionCategoryById = exports.getAllSuperQuestionCategory = exports.createSuperQuestionCategory = void 0;
const superQuestionCategoryModel_1 = __importDefault(require("./superQuestionCategoryModel"));
const userSuperCategoryModel_1 = __importDefault(require("../userSuperCategory/userSuperCategoryModel"));
const createSuperQuestionCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.create(Object.assign({}, req.body));
        if (!superQuestionCategory) {
            res.status(400).json({ status: false, message: "Error for creating SuperQuestionCategory" });
            return;
        }
        res.status(200).json({ status: true, message: "SuperQuestionCategory data fetch successfully..", data: superQuestionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createSuperQuestionCategory = createSuperQuestionCategory;
const getAllSuperQuestionCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.find();
        if (superQuestionCategory.length === 0) {
            res.status(404).json({ status: false, message: "SuperQuestionCategory data not found" });
            return;
        }
        const reorderedCategories = [
            superQuestionCategory.find(category => category.superCategoryName === "Astronaut"),
            superQuestionCategory.find(category => category.superCategoryName === "Sports Person"),
            superQuestionCategory.find(category => category.superCategoryName === "Scientist"),
            superQuestionCategory.find(category => category.superCategoryName === "Artist"),
            superQuestionCategory.find(category => category.superCategoryName === "Social Servant")
        ].filter(category => category !== undefined); // Filter out undefined values in case any category is not found
        res.status(200).json({
            status: true,
            totalRecords: reorderedCategories.length,
            message: "SuperQuestionCategory data fetched successfully.",
            data: reorderedCategories
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getAllSuperQuestionCategory = getAllSuperQuestionCategory;
const getSuperQuestionCategoryFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, start, superCategoryName, } = req.body;
        const filter = {};
        if (search) {
            const searchRegex = new RegExp(search, "i");
            const searchConditions = [
                { superCategoryName: searchRegex },
            ];
            filter.$or = searchConditions;
        }
        // Additional filters for specific fields
        if (superCategoryName) {
            filter.superCategoryName = new RegExp(superCategoryName, "i");
        }
        const questionCategory = yield superQuestionCategoryModel_1.default.find(filter).skip(parseInt(start)).limit(parseInt(limit));
        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Question Category data not found" });
            return;
        }
        res
            .status(200)
            .json({
            status: true,
            totalRecords: yield superQuestionCategoryModel_1.default.countDocuments(filter),
            message: "Super Question category data fetch successfully..",
            data: questionCategory,
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getSuperQuestionCategoryFilters = getSuperQuestionCategoryFilters;
const getSuperQuestionCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.findById(id).populate("questionCategories");
        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `SuperQuestionCategory data of superQuestionCategoryID ${id} not found` });
            return;
        }
        res.status(200).json({ status: true, message: "SuperQuestionCategory data fetch successfully..", data: superQuestionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getSuperQuestionCategoryById = getSuperQuestionCategoryById;
const setSuperQuestionCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, superQuestionCategoryId } = req.body;
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.findById(superQuestionCategoryId).populate("questionCategories");
        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `SuperQuestionCategory data of superQuestionCategoryID ${superQuestionCategoryId} not found` });
            return;
        }
        const userSuperCategory = yield userSuperCategoryModel_1.default.findOneAndUpdate({ userId: userId }, { superQuestionCategoryId: superQuestionCategoryId }, { new: true, upsert: true });
        res.status(200).json({ status: true, message: "SuperQuestionCategory data fetch successfully..", data: superQuestionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.setSuperQuestionCategory = setSuperQuestionCategory;
const updateSuperQuestionCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated SuperQuestionCategory data of superQuestionCategoryID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "SuperQuestionCategory data updated successfully..", data: superQuestionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateSuperQuestionCategoryById = updateSuperQuestionCategoryById;
const deleteSuperQuestionCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const superQuestionCategory = yield superQuestionCategoryModel_1.default.findByIdAndDelete(id);
        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated SuperQuestionCategory data of superQuestionCategoryID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "SuperQuestionCategory data updated successfully..", data: superQuestionCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteSuperQuestionCategoryById = deleteSuperQuestionCategoryById;
