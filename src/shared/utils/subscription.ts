import userSubscriptionsModel from "../../api/subscriptions/userSubscriptions/userSubscriptionsModel";
import subscriptionPlanModel from "../../api/subscriptions/subscriptionPlans/subscriptionPlanModel";

const planExpired = async (endDate: any, planId: any, userId: any) => {
    const plan = await subscriptionPlanModel.findById(planId)
    if (!plan) {
        throw new Error("No plan found")
    }

    const durationInDays = plan.duration;

    const expirationDate = new Date(endDate);
    expirationDate.setDate(expirationDate.getDate() + durationInDays);

    const currentDate = new Date();
    if (currentDate > expirationDate) {
        const userSubscription = await userSubscriptionsModel.findOne({ userId: userId, planId: planId });
        if (userSubscription) {

            userSubscription.status = "expired";
        }

        userSubscription?.save()
        return true
    } else {
        return false
    }

}


export = { planExpired }