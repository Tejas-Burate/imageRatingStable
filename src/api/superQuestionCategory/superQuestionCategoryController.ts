import superQuestionCategoryModel from "./superQuestionCategoryModel";
import userSuperCategoryModel from "../userSuperCategory/userSuperCategoryModel";
import { Request, Response } from "express";


const createSuperQuestionCategory = async (req: Request, res: Response) => {
    try {
        const superQuestionCategory = await superQuestionCategoryModel.create({ ...req.body });

        if (!superQuestionCategory) {
            res.status(400).json({ status: false, message: "Error for creating SuperQuestionCategory" });
            return;
        }

        res.status(200).json({ status: true, message: "SuperQuestionCategory data fetch successfully..", data: superQuestionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllSuperQuestionCategory = async (req: Request, res: Response) => {
    try {
        const superQuestionCategory = await superQuestionCategoryModel.find();

        if (superQuestionCategory.length === 0) {
            res.status(404).json({ status: false, message: "SuperQuestionCategory data not found" });
            return;
        }

        const reorderedCategories = [
            superQuestionCategory.find(category => category.superCategoryName === "Astronaut"),
            superQuestionCategory.find(category => category.superCategoryName === "Sports Person"),
            superQuestionCategory.find(category => category.superCategoryName === "Scientist"),
            superQuestionCategory.find(category => category.superCategoryName === "Artist"),
            superQuestionCategory.find(category => category.superCategoryName === "Social Servant")
        ].filter(category => category !== undefined); // Filter out undefined values in case any category is not found

        res.status(200).json({
            status: true,
            totalRecords: reorderedCategories.length,
            message: "SuperQuestionCategory data fetched successfully.",
            data: reorderedCategories
        });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
};

const getSuperQuestionCategoryFilters = async (req: Request, res: Response) => {
    try {
        const {
            search,
            limit,
            start,
            superCategoryName,

        } = req.body;

        const filter: any = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");

            const searchConditions = [
                { superCategoryName: searchRegex },

            ];

            filter.$or = searchConditions;
        }

        // Additional filters for specific fields
        if (superCategoryName) {
            filter.superCategoryName = new RegExp(superCategoryName, "i");
        }


        const questionCategory = await superQuestionCategoryModel.find(filter).skip(parseInt(start)).limit(parseInt(limit));

        if (questionCategory.length === 0) {
            res.status(404).json({ status: false, message: "Question Category data not found" });
            return;
        }

        res
            .status(200)
            .json({
                status: true,
                totalRecords: await superQuestionCategoryModel.countDocuments(filter),
                message: "Super Question category data fetch successfully..",
                data: questionCategory,
            });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
};

const getSuperQuestionCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const superQuestionCategory = await superQuestionCategoryModel.findById(id).populate("questionCategories");
        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `SuperQuestionCategory data of superQuestionCategoryID ${id} not found` });
            return;
        }
        res.status(200).json({ status: true, message: "SuperQuestionCategory data fetch successfully..", data: superQuestionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const setSuperQuestionCategory = async (req: Request, res: Response) => {
    try {
        const { userId, superQuestionCategoryId } = req.body
        const superQuestionCategory = await superQuestionCategoryModel.findById(superQuestionCategoryId).populate("questionCategories");
        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `SuperQuestionCategory data of superQuestionCategoryID ${superQuestionCategoryId} not found` });
            return;
        }
        const userSuperCategory = await userSuperCategoryModel.findOneAndUpdate(
            { userId: userId },
            { superQuestionCategoryId: superQuestionCategoryId }, { new: true, upsert: true }
        ); res.status(200).json({ status: true, message: "SuperQuestionCategory data fetch successfully..", data: superQuestionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateSuperQuestionCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const superQuestionCategory = await superQuestionCategoryModel.findByIdAndUpdate(id, { ...req.body });

        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated SuperQuestionCategory data of superQuestionCategoryID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "SuperQuestionCategory data updated successfully..", data: superQuestionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteSuperQuestionCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const superQuestionCategory = await superQuestionCategoryModel.findByIdAndDelete(id);

        if (!superQuestionCategory) {
            res.status(404).json({ status: false, message: `Failed to updated SuperQuestionCategory data of superQuestionCategoryID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "SuperQuestionCategory data updated successfully..", data: superQuestionCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};



export { createSuperQuestionCategory, getAllSuperQuestionCategory, getSuperQuestionCategoryById, updateSuperQuestionCategoryById, deleteSuperQuestionCategoryById, setSuperQuestionCategory, getSuperQuestionCategoryFilters }