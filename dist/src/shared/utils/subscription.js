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
const userSubscriptionsModel_1 = __importDefault(require("../../api/subscriptions/userSubscriptions/userSubscriptionsModel"));
const subscriptionPlanModel_1 = __importDefault(require("../../api/subscriptions/subscriptionPlans/subscriptionPlanModel"));
const planExpired = (endDate, planId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield subscriptionPlanModel_1.default.findById(planId);
    if (!plan) {
        throw new Error("No plan found");
    }
    const durationInDays = plan.duration;
    const expirationDate = new Date(endDate);
    expirationDate.setDate(expirationDate.getDate() + durationInDays);
    const currentDate = new Date();
    if (currentDate > expirationDate) {
        const userSubscription = yield userSubscriptionsModel_1.default.findOne({ userId: userId, planId: planId });
        if (userSubscription) {
            userSubscription.status = "expired";
        }
        userSubscription === null || userSubscription === void 0 ? void 0 : userSubscription.save();
        return true;
    }
    else {
        return false;
    }
});
module.exports = { planExpired };
