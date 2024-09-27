import { Request, Response } from "express";
import subscriptionPlanModel from "./subscriptionPlanModel";
import subscriptionTypeModel from "../subscriptionType/subscriptionTypeModel";

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

const getSubscriptionPlanFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit,
            start,
            subscriptionType,
            price,
            duration,
            benefits,
        } = req.body;

        const filter: any = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            const [subscriptionType] = await Promise.all([
                subscriptionTypeModel.findOne({ subscriptionType: searchRegex })
            ]);
            filter.$or = [
                { price: isNaN(Number(searchRegex)) ? undefined : Number(searchRegex) },
                { duration: isNaN(Number(searchRegex)) ? undefined : Number(searchRegex) },
                { subscriptionTypeId: subscriptionType?._id },
                { benefits: searchRegex }
            ];
        }

        if (subscriptionType) {
            const subscription = await subscriptionTypeModel.find({
                subscriptionType: new RegExp(subscriptionType, "i")
            });

            if (subscription.length > 0) {
                filter.subscriptionTypeId = { $in: subscription.map(c => c._id) };
            } else {
                return res.status(404).json({ status: false, message: "No matching subscription found" });
            }
        }

        if (price && !isNaN(Number(price))) {
            filter.price = Number(price);
        }
        if (duration && !isNaN(Number(duration))) {
            filter.duration = Number(duration);
        }
        if (benefits) {
            filter.benefits = new RegExp(benefits, "i");
        }

        const subscriptionPlan = await subscriptionPlanModel.find(filter)
            .skip(parseInt(start))
            .limit(parseInt(limit))
            .populate("subscriptionTypeId");

        if (subscriptionPlan.length === 0) {
            res.status(404).json({ status: false, message: "No subscriptionPlan found" });
            return;
        }

        res.status(200).json({
            status: true,
            totalRecords: subscriptionPlan.length,
            message: "subscriptionPlan fetched successfully",
            data: subscriptionPlan,
        });
    } catch (error) {
        console.error("Error fetching subscriptionPlan:", error);
        res.status(500).json({ status: false, error: "Internal server error", message: error });
    }
};

export {
    createSubscriptions, getAllSubscriptionPlans, getSubscriptionPlanById, getSubscriptionPlanFilters, updateSubscriptionPlanById, deleteSubscriptionPlanById, getSubscriptionPlanBySubscriptionTypeId
}