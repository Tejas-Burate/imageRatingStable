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
exports.deleteImageById = exports.updateImageById = exports.getImageById = exports.getAllImage = exports.createImage = void 0;
const imageModel_1 = __importDefault(require("./imageModel"));
const createImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield imageModel_1.default.create(Object.assign({}, req.body));
        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Image" });
            return;
        }
        res.status(201).json({ status: true, message: "Image data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createImage = createImage;
const getAllImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield imageModel_1.default.find().populate("imageCategoryId");
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Image data not found" });
            return;
        }
        res.status(201).json({ status: true, totalRecords: yield imageModel_1.default.countDocuments(), message: "Image data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllImage = getAllImage;
const getImageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log('id', id);
        const user = yield imageModel_1.default.findById(id).populate("imageCategoryId");
        if (!user) {
            res.status(404).json({ status: false, message: `Image data of userID ${id} not found` });
            return;
        }
        res.status(201).json({ status: true, message: "Image data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getImageById = getImageById;
const updateImageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield imageModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Image data of userID ${id}` });
            return;
        }
        res.status(201).json({ status: true, message: "Image data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateImageById = updateImageById;
const deleteImageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield imageModel_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Image data of userID ${id}` });
            return;
        }
        res.status(201).json({ status: true, message: "Image data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteImageById = deleteImageById;
