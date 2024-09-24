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
exports.getAllUserSubscriptionsByUserId = exports.getUserSubscriptionsById = exports.getAllUserSubscriptions = void 0;
const userSubscriptionsModel_1 = __importDefault(require("./userSubscriptionsModel"));
const getAllUserSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSubscriptions = yield userSubscriptionsModel_1.default.find();
    if (userSubscriptions.length === 0) {
        return res.status(404).json({ status: false, message: "User Subscriptions data not found" });
    }
    return res.status(200).json({ status: true, message: "Data fetched successfully", data: userSubscriptions });
});
exports.getAllUserSubscriptions = getAllUserSubscriptions;
const getUserSubscriptionsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userSubscriptions = yield userSubscriptionsModel_1.default.findById(id);
    if (!userSubscriptions) {
        return res.status(404).json({ status: false, message: "User Subscriptions data not found" });
    }
    return res.status(200).json({ status: true, message: "Data fetched successfully", data: userSubscriptions });
});
exports.getUserSubscriptionsById = getUserSubscriptionsById;
const getAllUserSubscriptionsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userSubscriptions = yield userSubscriptionsModel_1.default.find({ userId: id }).populate("userId planId");
    if (userSubscriptions.length === 0) {
        return res.status(404).json({ status: false, message: "User Subscriptions data not found" });
    }
    return res.status(200).json({ status: true, message: "Data fetched successfully", data: userSubscriptions });
});
exports.getAllUserSubscriptionsByUserId = getAllUserSubscriptionsByUserId;
