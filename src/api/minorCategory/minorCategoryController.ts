import MinorCategoryModel from "./minorCategoryModel";
import { Request, Response } from "express";

const createMinorCategory = async (req: Request, res: Response) => {
    try {
        const MinorCategory = await MinorCategoryModel.create({ ...req.body });
        console.log('MinorCategory', MinorCategory)

        if (!MinorCategory) {
            res.status(400).json({ status: false, message: "Error for creating MinorCategory" });
            return;
        }

        res.status(200).json({ status: true, message: "MinorCategory data fetch successfully..", data: MinorCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllMinorCategory = async (req: Request, res: Response) => {
    try {
        const MinorCategory = await MinorCategoryModel.find().populate({ path: "CategoryId" }).populate({ path: "superCategoryId" });

        if (MinorCategory.length === 0) {
            res.status(404).json({ status: false, message: "MinorCategory data not found" });
            return;
        }

        res.status(200).json({ status: true, totalRecords: await MinorCategoryModel.countDocuments(), message: "MinorCategory data fetch successfully..", data: MinorCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getMinorCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const minorCategories = await MinorCategoryModel.findById(id).populate({ path: "categoryId" }).populate({ path: "superCategoryId" });


        if (!minorCategories || minorCategories.length === 0) {
            res.status(404).json({ status: false, message: `No MinorCategory data found for Id ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "MinorCategory data fetched successfully.", data: minorCategories });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error || "Internal Server Error" });
    }
};
const getMinorCategoryByCategoryId = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId;
        const minorCategories = await MinorCategoryModel.find({ CategoryId: categoryId }).populate({ path: "CategoryId" }).populate({ path: "superCategoryId" });

        if (!minorCategories || minorCategories.length === 0) {
            res.status(404).json({ status: false, message: `No MinorCategory data found for CategoryId ${categoryId}` });
            return;
        }

        res.status(200).json({ status: true, message: "MinorCategory data fetched successfully.", data: minorCategories });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error || "Internal Server Error" });
    }
};


const updateMinorCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const MinorCategory = await MinorCategoryModel.findByIdAndUpdate(id, { ...req.body });

        if (!MinorCategory) {
            res.status(404).json({ status: false, message: `Failed to updated MinorCategory data of MinorCategoryID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "MinorCategory data updated successfully..", data: MinorCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteMinorCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const MinorCategory = await MinorCategoryModel.findByIdAndDelete(id);

        if (!MinorCategory) {
            res.status(404).json({ status: false, message: `Failed to updated MinorCategory data of MinorCategoryID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "MinorCategory data updated successfully..", data: MinorCategory })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

export { createMinorCategory, getAllMinorCategory, getMinorCategoryById, getMinorCategoryByCategoryId, updateMinorCategoryById, deleteMinorCategoryById }