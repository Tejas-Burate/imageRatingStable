import { Request, Response } from "express";
import subscriptionPlanModel from "./subscriptionPlanModel";

const createSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptionPlan = await subscriptionPlanModel.create({ ...req.body });
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: "Failed to create new subscription type" })
        }

        return res.status(200).json({ status: true, message: "Subscription type created successfully", data: subscriptionPlan });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const getAllSubscriptionPlans = async (req: Request, res: Response) => {
    try {
        const subscriptionPlan = await subscriptionPlanModel.find().populate("subscriptionTypeId");
        if (subscriptionPlan.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: subscriptionPlan.length, data: subscriptionPlan });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const getSubscriptionPlanById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionPlan = await subscriptionPlanModel.findById(id).populate("subscriptionTypeId");
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", data: subscriptionPlan });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const getSubscriptionPlanBySubscriptionTypeId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionPlan = await subscriptionPlanModel.find({ subscriptionTypeId: id }).populate("subscriptionTypeId");
        if (subscriptionPlan.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: subscriptionPlan.length, data: subscriptionPlan });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const updateSubscriptionPlanById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionPlan = await subscriptionPlanModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` })
        }

        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionPlan });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const deleteSubscriptionPlanById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionPlan = await subscriptionPlanModel.findByIdAndDelete(id, { ...req.body });
        if (!subscriptionPlan) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` })
        }

        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionPlan });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}

export {
    createSubscriptions, getAllSubscriptionPlans, getSubscriptionPlanById, updateSubscriptionPlanById, deleteSubscriptionPlanById, getSubscriptionPlanBySubscriptionTypeId
}