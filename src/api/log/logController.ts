import logModel from "./logModel";
import { Request, Response } from "express";


const createLog = async (req: Request, res: Response) => {
    try {
        const user = await logModel.create({ ...req.body });

        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Log" });
            return;
        }

        res.status(201).json({ status: true, message: "Log data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllLog = async (req: Request, res: Response) => {
    try {
        const user = await logModel.find();

        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Log data not found" });
            return;
        }

        res.status(200).json({ status: true, totalRecords: await logModel.countDocuments(), message: "Log data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getLogById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await logModel.findById(id);

        if (!user) {
            res.status(404).json({ status: false, message: `Log data of userID ${id} not found` });
            return;
        }

        res.status(200).json({ status: true, message: "Log data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateLogById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await logModel.findByIdAndUpdate(id, { ...req.body });

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Log data of userID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "Log data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteLogById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await logModel.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Log data of userID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "Log data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};



export { createLog, getAllLog, getLogById, updateLogById, deleteLogById }