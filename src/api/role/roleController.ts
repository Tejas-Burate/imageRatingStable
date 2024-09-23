import roleModel from "./roleModel";
import { Request, Response } from "express";


const createRole = async (req: Request, res: Response) => {
    try {
        const user = await roleModel.create({ ...req.body });

        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Role" });
            return;
        }

        res.status(201).json({ status: true, message: "Role data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllRole = async (req: Request, res: Response) => {
    try {
        const user = await roleModel.find();

        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Role data not found" });
            return;
        }

        res.status(201).json({ status: true, totalRecords: await roleModel.countDocuments(), message: "Role data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getRoleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await roleModel.findById(id);

        if (!user) {
            res.status(404).json({ status: false, message: `Role data of userID ${id} not found` });
            return;
        }

        res.status(201).json({ status: true, message: "Role data fetch successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateRoleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await roleModel.findByIdAndUpdate(id, { ...req.body });

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Role data of userID ${id}` });
            return;
        }

        res.status(201).json({ status: true, message: "Role data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteRoleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await roleModel.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Role data of userID ${id}` });
            return;
        }

        res.status(201).json({ status: true, message: "Role data updated successfully..", data: user })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};



export { createRole, getAllRole, getRoleById, updateRoleById, deleteRoleById }