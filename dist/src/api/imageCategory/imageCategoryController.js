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
exports.deleteImageCategoryById = exports.updateImageCategoryById = exports.getImageCategoryById = exports.getAllImageCategory = exports.createImageCategory = void 0;
const imageCategoryModel_1 = __importDefault(require("./imageCategoryModel"));
const createImageCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield imageCategoryModel_1.default.create(Object.assign({}, req.body));
        console.log('user', user);
        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating ImageCategory" });
            return;
        }
        res.status(200).json({ status: true, message: "ImageCategory data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createImageCategory = createImageCategory;
const getAllImageCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield imageCategoryModel_1.default.find();
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "ImageCategory data not found" });
            return;
        }
        res.status(200).json({ status: true, totalRecords: yield imageCategoryModel_1.default.countDocuments(), message: "ImageCategory data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllImageCategory = getAllImageCategory;
const getImageCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log('id', id);
        const user = yield imageCategoryModel_1.default.findById(id);
        console.log('user', user);
        if (!user) {
            res.status(404).json({ status: false, message: `ImageCategory data of userID ${id} not found` });
            return;
        }
        res.status(200).json({ status: true, message: "ImageCategory data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getImageCategoryById = getImageCategoryById;
const updateImageCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield imageCategoryModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated ImageCategory data of userID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "ImageCategory data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateImageCategoryById = updateImageCategoryById;
const deleteImageCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield imageCategoryModel_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated ImageCategory data of userID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "ImageCategory data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteImageCategoryById = deleteImageCategoryById;
