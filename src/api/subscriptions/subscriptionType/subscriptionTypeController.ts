import { Request, Response } from "express";
import subscriptionTypeModel from "./subscriptionTypeModel";

const createSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptionType = await subscriptionTypeModel.create({ ...req.body });
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: "Failed to create new subscription type" })
        }

        return res.status(200).json({ status: true, message: "Subscription type created successfully", data: subscriptionType });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const getAllSubscriptionTypes = async (req: Request, res: Response) => {
    try {
        const subscriptionType = await subscriptionTypeModel.find();
        if (subscriptionType.length === 0) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", totalRecords: subscriptionType.length, data: subscriptionType });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const getSubscriptionTypesFilters = async (req: Request, res: Response) => {
    try {

        const {
            search,
            limit, // Default limit
            start, // Default start
            subscriptionType,
            description,


        } = req.body;

        const filter: any = {};

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


        const questionCategory = await subscriptionTypeModel.find(filter).skip(parseInt(start)).limit(parseInt(limit));

        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Question Category data not found" });
            return;
        }

        res
            .status(200)
            .json({
                status: true,
                totalRecords: await subscriptionTypeModel.countDocuments(),
                message: "Question category data fetch successfully..",
                data: questionCategory,
            });


    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}

const getSubscriptionTypeById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionType = await subscriptionTypeModel.findById(id);
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: "data not found" })
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", data: subscriptionType });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const updateSubscriptionTypeById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionType = await subscriptionTypeModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` })
        }

        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionType });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}
const deleteSubscriptionTypeById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const subscriptionType = await subscriptionTypeModel.findByIdAndDelete(id, { ...req.body });
        if (!subscriptionType) {
            return res.status(404).json({ status: false, message: `Subscription type of Id ${id} is not found ` })
        }

        return res.status(200).json({ status: true, message: "Subscription type updated successfully", data: subscriptionType });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
}

export {
    createSubscriptions, getAllSubscriptionTypes, getSubscriptionTypesFilters, getSubscriptionTypeById, updateSubscriptionTypeById, deleteSubscriptionTypeById
}