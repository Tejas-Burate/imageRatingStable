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
exports.getSubscriptionPlanBySubscriptionTypeId = exports.deleteSubscriptionPlanById = exports.updateSubscriptionPlanById = exports.getSubscriptionPlanById = exports.getAllSubscriptionPlans = exports.createSubscriptions = void 0;
const subscriptionPlanModel_1 = __importDefault(require("./subscriptionPlanModel"));
const createSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionPlan = yield subscriptionPlanModel_1.default.create(Object.assign({}, req.body));
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: "Failed to create new subscription type" });
        }
        return res.status(200).json({ status: true, message: "Subscription type created successfully", data: subscriptionPlan });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.createSubscriptions = createSubscriptions;
const getAllSubscriptionPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionPlan = yield subscriptionPlanModel_1.default.find().populate("subscriptionTypeId");
        if (subscriptionPlan.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: subscriptionPlan.length, data: subscriptionPlan });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getAllSubscriptionPlans = getAllSubscriptionPlans;
const getSubscriptionPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionPlan = yield subscriptionPlanModel_1.default.findById(id).populate("subscriptionTypeId");
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", data: subscriptionPlan });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getSubscriptionPlanById = getSubscriptionPlanById;
const getSubscriptionPlanBySubscriptionTypeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionPlan = yield subscriptionPlanModel_1.default.find({ subscriptionTypeId: id }).populate("subscriptionTypeId");
        if (subscriptionPlan.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" });
        }
        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: subscriptionPlan.length, data: subscriptionPlan });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getSubscriptionPlanBySubscriptionTypeId = getSubscriptionPlanBySubscriptionTypeId;
const updateSubscriptionPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionPlan = yield subscriptionPlanModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` });
        }
        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionPlan });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.updateSubscriptionPlanById = updateSubscriptionPlanById;
const deleteSubscriptionPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const subscriptionPlan = yield subscriptionPlanModel_1.default.findByIdAndDelete(id, Object.assign({}, req.body));
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` });
        }
        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionPlan });
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.deleteSubscriptionPlanById = deleteSubscriptionPlanById;
