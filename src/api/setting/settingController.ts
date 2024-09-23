import settingModel from "./settingModel";
import { Request, Response } from "express";


const createSetting = async (req: Request, res: Response) => {
    try {
        const user = await settingModel.create({ ...req.body });

        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Setting" });
            return;
        }

        res.status(201).json({ status: true, message: "Setting data created successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllSetting = async (req: Request, res: Response) => {
    try {
        const user = await settingModel.find();

        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Setting data not found" });
            return;
        }

        res.status(200).json({ status: true, totalRecords: await settingModel.countDocuments(), message: "Setting data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getSettingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await settingModel.findById(id).populate(" settingCategoryId");

        if (!user) {
            res.status(404).json({ status: false, message: `Setting data of userID ${id} not found` });
            return;
        }

        res.status(200).json({ status: true, message: "Setting data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateSettingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await settingModel.findByIdAndUpdate(id, { ...req.body });

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Setting data of userID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "Setting data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteSettingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await settingModel.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Setting data of userID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "Setting data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};



export { createSetting, getAllSetting, getSettingById, updateSettingById, deleteSettingById }