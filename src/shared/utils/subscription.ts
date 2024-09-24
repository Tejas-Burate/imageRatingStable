import userSubscriptionsModel from "../../api/subscriptions/userSubscriptions/userSubscriptionsModel";
import subscriptionPlanModel from "../../api/subscriptions/subscriptionPlans/subscriptionPlanModel";
import sessionModel from "../../api/quizCompetition/session/sessionModel";
import subscriptionTypeModel from "../../api/subscriptions/subscriptionType/subscriptionTypeModel";

const generalQuizPlanExpired = async (userId: any) => {
    const plans = await userSubscriptionsModel.findOne({ userId: userId, subscriptionType: "General Quiz" });

    if (!plans) {
        throw new Error("No plan found for the user.");
    }

    const currentDate = new Date();

    if (currentDate > new Date(plans.endDate)) {
        plans.status = "expired";
        await plans.save();
        return true;
    }

    if (plans.status === "expired") {
        return true; // Plan is already marked as expired
    }


    return false;
};


const isGeneralQuizSubscription = async (userId: string) => {
    const plan = await userSubscriptionsModel.find({ userId }).populate("typeId");
    if (!plan || plan.length === 0) {
        return false
    }

    const generalSubscription = plan.some(subscription => subscription.subscriptionType === "General Quiz");
    return generalSubscription;

};

const competitionQuizPlanExpired = async (userId: any) => {
    const plan = await userSubscriptionsModel.findOne({ userId, subscriptionType: "Competition Quiz" });

    if (!plan) {
        throw new Error("No plan found for the user.");
    }

    const currentDate = new Date();
    const planEndDate = new Date(plan.endDate);

    if (currentDate > planEndDate) {
        plan.status = "expired";
        await plan.save();
        return true; // Plan has expired
    }

    if (plan.status === "expired") {
        return true; // Plan is already marked as expired
    }

    const distinctSessionIds = await sessionModel.distinct('sessionId', { userId });
    const count = distinctSessionIds.length;

    const subscriptionPlan = await subscriptionPlanModel.findById(plan.planId);

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
        await plan.save();
        return false; // Quiz limit reached
    }

    return false; // Plan is active and within limits
};



const isCompetitionQuizSubscription = async (userId: string) => {
    const plan = await userSubscriptionsModel.find({ userId }).populate("typeId");
    if (!plan || plan.length === 0) {
        return false
    }

    const generalSubscription = plan.some(subscription => subscription.subscriptionType === "Competition Quiz");
    return generalSubscription;

};



export = { generalQuizPlanExpired, isGeneralQuizSubscription, competitionQuizPlanExpired, isCompetitionQuizSubscription }