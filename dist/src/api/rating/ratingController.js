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
exports.deleteRatingById = exports.updateRatingById = exports.getRatingById = exports.getAllRating = exports.createRating = void 0;
const ratingModel_1 = __importDefault(require("./ratingModel"));
const createRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield ratingModel_1.default.create(Object.assign({}, req.body));
        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Rating" });
            return;
        }
        res.status(201).json({ status: true, message: "Rating data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createRating = createRating;
const getAllRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield ratingModel_1.default.find().populate("imageId userId");
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Rating data not found" });
            return;
        }
        res.status(201).json({ status: true, totalRecords: yield ratingModel_1.default.countDocuments(), message: "Rating data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllRating = getAllRating;
const getRatingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield ratingModel_1.default.findById(id).populate("imageId userId");
        if (!user) {
            res.status(404).json({ status: false, message: `Rating data of userID ${id} not found` });
            return;
        }
        res.status(201).json({ status: true, message: "Rating data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getRatingById = getRatingById;
const updateRatingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield ratingModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Rating data of userID ${id}` });
            return;
        }
        res.status(201).json({ status: true, message: "Rating data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateRatingById = updateRatingById;
const deleteRatingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield ratingModel_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Rating data of userID ${id}` });
            return;
        }
        res.status(201).json({ status: true, message: "Rating data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteRatingById = deleteRatingById;
