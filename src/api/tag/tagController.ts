import { Request, Response } from "express";
import tagModel from "./tagModel";



const createTag = async (req: Request, res: Response) => {
    try {
        const tag = await tagModel.create({ ...req.body });
        if (!tag) {
            return res.status(400).json({ status: false, message: "Failed to created new tag" });
        }
        res.status(201).json({ status: true, message: "tag created successfully", data: tag });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, error: "Internal server error", message: error })
    }
}

const getTagById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const tag = await tagModel.findById(id);
        if (!tag) {
            return res
                .status(404)
                .json({ status: false, message: "tag data not found" });
        }
        res
            .status(200)
            .json({
                status: true,
                message: "tag data fetch successfully",
                data: tag,
            });
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};
const getTagByTagging = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const tag = await tagModel.findById(id);
        if (!tag) {
            return res
                .status(404)
                .json({ status: false, message: "tag data not found" });
        }
        res
            .status(200)
            .json({
                status: true,
                message: "tag data fetch successfully",
                data: tag,
            });
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};

const getAllTag = async (req: Request, res: Response) => {
    try {
        const tag = await tagModel.find();
        if (!tag) {
            return res
                .status(404)
                .json({ status: false, message: "tag data not found" });
        }
        res
            .status(200)
            .json({ status: true, message: "tag created successfully", data: tag });
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};
const getTagFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit, // Default limit
            start, // Default start
            tagName,
        } = req.body;

        const filter: any = {};

        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");

            // Array to hold search conditions for string fields
            const searchConditions = [
                { tagName: searchRegex },
            ];

            filter.$or = searchConditions;
        }

        // Additional filters for specific fields
        if (tagName) {
            filter.tagName = new RegExp(tagName, "i");
        }


        const questionCategory = await tagModel
            .find(filter)
            .skip(Number(start))
            .limit(Number(limit));

        if (questionCategory.length === 0) {
            res
                .status(404)
                .json({
                    status: false,
                    message: "tag Competition Category data not found",
                });
            return;
        }

        res.status(200).json({
            status: true,
            totalRecords: await tagModel.countDocuments(filter),
            message: "tag Competition category data fetch successfully.",
            data: questionCategory,
        });
    } catch (error) {
        console.error("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};

const updateTagById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const tag = await tagModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );
        if (!tag) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to update the tag" });
        }
        res
            .status(200)
            .json({ status: true, message: "tag updated successfully", data: tag });
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};
const deleteTagById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const tag = await tagModel.findByIdAndDelete(id);
        if (!tag) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to delete the tag" });
        }
        res
            .status(200)
            .json({ status: true, message: "tag deleted successfully", data: tag });
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "Internal server error", message: error });
    }
};

export {
    createTag,
    getTagById,
    getAllTag,
    getTagFilters,
    updateTagById,
    deleteTagById,
};
