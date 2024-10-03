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
exports.deleteTagById = exports.updateTagById = exports.getTagFilters = exports.getAllTag = exports.getTagById = exports.createTag = void 0;
const tagModel_1 = __importDefault(require("./tagModel"));
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield tagModel_1.default.create(Object.assign({}, req.body));
        if (!tag) {
            return res.status(400).json({ status: false, message: "Failed to created new tag" });
        }
        res.status(201).json({ status: true, message: "tag created successfully", data: tag });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
});
exports.createTag = createTag;
const getTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tag = yield tagModel_1.default.findById(id);
        if (!tag) {
            return res
                .status(404)
                .json({ status: false, message: "tag data not found" });
        }
        res
            .status(200)
            .json({
            status: true,
            message: "tag data fetch successfully",
            data: tag,
        });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getTagById = getTagById;
const getTagByTagging = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tag = yield tagModel_1.default.findById(id);
        if (!tag) {
            return res
                .status(404)
                .json({ status: false, message: "tag data not found" });
        }
        res
            .status(200)
            .json({
            status: true,
            message: "tag data fetch successfully",
            data: tag,
        });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
const getAllTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield tagModel_1.default.find();
        if (!tag) {
            return res
                .status(404)
                .json({ status: false, message: "tag data not found" });
        }
        res
            .status(200)
            .json({ status: true, message: "tag created successfully", data: tag });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getAllTag = getAllTag;
const getTagFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, // Default limit
        start, // Default start
        tagName, } = req.body;
        const filter = {};
        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");
            // Array to hold search conditions for string fields
            const searchConditions = [
                { tagName: searchRegex },
            ];
            filter.$or = searchConditions;
        }
        // Additional filters for specific fields
        if (tagName) {
            filter.tagName = new RegExp(tagName, "i");
        }
        const questionCategory = yield tagModel_1.default
            .find(filter)
            .skip(Number(start))
            .limit(Number(limit));
        if (questionCategory.length === 0) {
            res
                .status(404)
                .json({
                status: false,
                message: "tag Competition Category data not found",
            });
            return;
        }
        res.status(200).json({
            status: true,
            totalRecords: yield tagModel_1.default.countDocuments(filter),
            message: "tag Competition category data fetch successfully.",
            data: questionCategory,
        });
    }
    catch (error) {
        console.error("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
exports.getTagFilters = getTagFilters;
const updateTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tag = yield tagModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!tag) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to update the tag" });
        }
        res
            .status(200)
            .json({ status: true, message: "tag updated successfully", data: tag });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
exports.updateTagById = updateTagById;
const deleteTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tag = yield tagModel_1.default.findByIdAndDelete(id);
        if (!tag) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to delete the tag" });
        }
        res
            .status(200)
            .json({ status: true, message: "tag deleted successfully", data: tag });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
});
exports.deleteTagById = deleteTagById;
