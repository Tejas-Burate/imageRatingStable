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
const sessionModel_1 = __importDefault(require("../../api/quizCompetition/session/sessionModel"));
const generalQuizPlanExpired = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield userSubscriptionsModel_1.default.findOne({ userId: userId, subscriptionType: "General Quiz" });
    if (!plans) {
        throw new Error("No plan found for the user.");
    }
    const currentDate = new Date();
    if (currentDate > new Date(plans.endDate)) {
        plans.status = "expired";
        yield plans.save();
        return true;
    }
    if (plans.status === "expired") {
        return true; // Plan is already marked as expired
    }
    return false;
});
const isGeneralQuizSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield userSubscriptionsModel_1.default.find({ userId }).populate("typeId");
    if (!plan || plan.length === 0) {
        return false;
    }
    const generalSubscription = plan.some(subscription => subscription.subscriptionType === "General Quiz");
    return generalSubscription;
});
const competitionQuizPlanExpired = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield userSubscriptionsModel_1.default.findOne({ userId, subscriptionType: "Competition Quiz" });
    if (!plan) {
        throw new Error("No plan found for the user.");
    }
    const currentDate = new Date();
    const planEndDate = new Date(plan.endDate);
    if (currentDate > planEndDate) {
        plan.status = "expired";
        yield plan.save();
        return true; // Plan has expired
    }
    if (plan.status === "expired") {
        return true; // Plan is already marked as expired
    }
    const distinctSessionIds = yield sessionModel_1.default.distinct('sessionId', { userId });
    const count = distinctSessionIds.length;
    const subscriptionPlan = yield subscriptionPlanModel_1.default.findById(plan.planId);
    if (!subscriptionPlan) {
        throw new Error("No subscription plan found.");
    }
    // Ensure quizAllowed is defined
    if (subscriptionPlan.quizAllowed == null) {
        throw new Error("Quiz limit is not defined in the subscription plan.");
    }
    // Check if quiz limit is exceeded
    if (count >= subscriptionPlan.quizAllowed) {
        plan.status = "expired";
        yield plan.save();
        return false; // Quiz limit reached
    }
    return false; // Plan is active and within limits
});
const isCompetitionQuizSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield userSubscriptionsModel_1.default.find({ userId }).populate("typeId");
    if (!plan || plan.length === 0) {
        return false;
    }
    const generalSubscription = plan.some(subscription => subscription.subscriptionType === "Competition Quiz");
    return generalSubscription;
});
module.exports = { generalQuizPlanExpired, isGeneralQuizSubscription, competitionQuizPlanExpired, isCompetitionQuizSubscription };
