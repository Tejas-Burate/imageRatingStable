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
exports.deleteMinorCategoryById = exports.updateMinorCategoryById = exports.getMinorCategoryByCategoryId = exports.getMinorCategoryById = exports.getAllMinorCategory = exports.createMinorCategory = void 0;
const minorCategoryModel_1 = __importDefault(require("./minorCategoryModel"));
const createMinorCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MinorCategory = yield minorCategoryModel_1.default.create(Object.assign({}, req.body));
        if (!MinorCategory) {
            res.status(400).json({ status: false, message: "Error for creating MinorCategory" });
            return;
        }
        res.status(200).json({ status: true, message: "MinorCategory data fetch successfully..", data: MinorCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createMinorCategory = createMinorCategory;
const getAllMinorCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MinorCategory = yield minorCategoryModel_1.default.find().populate({ path: "CategoryId" }).populate({ path: "superCategoryId" });
        if (MinorCategory.length === 0) {
            res.status(404).json({ status: false, message: "MinorCategory data not found" });
            return;
        }
        res.status(200).json({ status: true, totalRecords: yield minorCategoryModel_1.default.countDocuments(), message: "MinorCategory data fetch successfully..", data: MinorCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllMinorCategory = getAllMinorCategory;
const getMinorCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const minorCategories = yield minorCategoryModel_1.default.findById(id).populate({ path: "categoryId" }).populate({ path: "superCategoryId" });
        if (!minorCategories || minorCategories.length === 0) {
            res.status(404).json({ status: false, message: `No MinorCategory data found for Id ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "MinorCategory data fetched successfully.", data: minorCategories });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error || "Internal Server Error" });
    }
});
exports.getMinorCategoryById = getMinorCategoryById;
const getMinorCategoryByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        const minorCategories = yield minorCategoryModel_1.default.find({ CategoryId: categoryId }).populate({ path: "CategoryId" }).populate({ path: "superCategoryId" });
        if (!minorCategories || minorCategories.length === 0) {
            res.status(404).json({ status: false, message: `No MinorCategory data found for CategoryId ${categoryId}` });
            return;
        }
        res.status(200).json({ status: true, message: "MinorCategory data fetched successfully.", data: minorCategories });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error || "Internal Server Error" });
    }
});
exports.getMinorCategoryByCategoryId = getMinorCategoryByCategoryId;
const updateMinorCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const MinorCategory = yield minorCategoryModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!MinorCategory) {
            res.status(404).json({ status: false, message: `Failed to updated MinorCategory data of MinorCategoryID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "MinorCategory data updated successfully..", data: MinorCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateMinorCategoryById = updateMinorCategoryById;
const deleteMinorCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const MinorCategory = yield minorCategoryModel_1.default.findByIdAndDelete(id);
        if (!MinorCategory) {
            res.status(404).json({ status: false, message: `Failed to updated MinorCategory data of MinorCategoryID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "MinorCategory data updated successfully..", data: MinorCategory });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteMinorCategoryById = deleteMinorCategoryById;
