import { Request, Response } from "express";
import userSubscriptionsModel from "./userSubscriptionsModel";

const getAllUserSubscriptions = async (req: Request, res: Response) => {
    const userSubscriptions = await userSubscriptionsModel.find();
    if (userSubscriptions.length === 0) {
        return res.status(404).json({ status: false, message: "User Subscriptions data not found" })
    }

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: userSubscriptions })
}
const getUserSubscriptionsById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userSubscriptions = await userSubscriptionsModel.findById(id);
    if (!userSubscriptions) {
        return res.status(404).json({ status: false, message: "User Subscriptions data not found" })
    }

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: userSubscriptions })
}

const getAllUserSubscriptionsByUserId = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userSubscriptions = await userSubscriptionsModel.find({ userId: id }).populate("userId planId");
    if (userSubscriptions.length === 0) {
        return res.status(404).json({ status: false, message: "User Subscriptions data not found" })
    }

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: userSubscriptions })
}

export { getAllUserSubscriptions, getUserSubscriptionsById, getAllUserSubscriptionsByUserId }