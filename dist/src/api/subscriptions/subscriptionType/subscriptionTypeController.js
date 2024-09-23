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
exports.deleteSubscriptionTypeById = exports.updateSubscriptionTypeById = exports.getSubscriptionTypeById = exports.getSubscriptionTypesFilters = exports.getAllSubscriptionTypes = exports.createSubscriptions = void 0;
const subscriptionTypeModel_1 = __importDefault(require("./subscriptionTypeModel"));
const createSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionType = yield subscriptionTypeModel_1.default.create(Object.assign({}, req.body));
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: "Failed to create new subscription type" });
        }
        return res.status(200).json({ status: true, message: "Subscription type created successfully", data: subscriptionType });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.createSubscriptions = createSubscriptions;
const getAllSubscriptionTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionType = yield subscriptionTypeModel_1.default.find();
        if (subscriptionType.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: subscriptionType.length, data: subscriptionType });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getAllSubscriptionTypes = getAllSubscriptionTypes;
const getSubscriptionTypesFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, // Default limit
        start, // Default start
        subscriptionType, description, } = req.body;
        const filter = {};
        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");
            // Array to hold search conditions
            const searchConditions = [
                { subscriptionType: searchRegex },
            ];
            filter.$or = searchConditions;
        }
        // Additional filters for specific fields
        if (subscriptionType) {
            filter.subscriptionType = new RegExp(subscriptionType, "i");
        }
        if (description) {
            filter.description = new RegExp(description, "i");
        }
        const questionCategory = yield subscriptionTypeModel_1.default.find(filter).skip(parseInt(start)).limit(parseInt(limit));
        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Question Category data not found" });
            return;
        }
        res
            .status(200)
            .json({
            status: true,
            totalRecords: yield subscriptionTypeModel_1.default.countDocuments(),
            message: "Question category data fetch successfully..",
            data: questionCategory,
        });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getSubscriptionTypesFilters = getSubscriptionTypesFilters;
const getSubscriptionTypeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionType = yield subscriptionTypeModel_1.default.findById(id);
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", data: subscriptionType });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getSubscriptionTypeById = getSubscriptionTypeById;
const updateSubscriptionTypeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionType = yield subscriptionTypeModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` });
        }
        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionType });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.updateSubscriptionTypeById = updateSubscriptionTypeById;
const deleteSubscriptionTypeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionType = yield subscriptionTypeModel_1.default.findByIdAndDelete(id, Object.assign({}, req.body));
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` });
        }
        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionType });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.deleteSubscriptionTypeById = deleteSubscriptionTypeById;
