import sessionModel from "./sessionModel";
import { Request, Response } from "express";


const createSession = async (req: Request, res: Response) => {
    try {
        const session = await sessionModel.create({ ...req.body });

        if (!session) {
            res.status(400).json({ status: false, message: "Error for creating Session" });
            return;
        }

        res.status(200).json({ status: true, message: "Session data fetch successfully..", data: session })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getAllSession = async (req: Request, res: Response) => {
    try {
        const session = await sessionModel.find();

        if (session.length === 0) {
            res.status(404).json({ status: false, message: "Session data not found" });
            return;
        }

        res.status(200).json({ status: true, totalRecords: await sessionModel.countDocuments(), message: "Session data fetch successfully..", data: session })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const getSessionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const session = await sessionModel.findById(id);

        if (!session) {
            res.status(404).json({ status: false, message: `Session data of sessionID ${id} not found` });
            return;
        }

        res.status(200).json({ status: true, message: "Session data fetch successfully..", data: session })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const updateSessionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const session = await sessionModel.findByIdAndUpdate(id, { ...req.body });

        if (!session) {
            res.status(404).json({ status: false, message: `Failed to updated Session data of sessionID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "Session data updated successfully..", data: session })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};

const deleteSessionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const session = await sessionModel.findByIdAndDelete(id);

        if (!session) {
            res.status(404).json({ status: false, message: `Failed to updated Session data of sessionID ${id}` });
            return;
        }

        res.status(200).json({ status: true, message: "Session data updated successfully..", data: session })

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error })
    }
};
const getRecentSessions = async (req: Request, res: Response) => {
    try {
        // Fetch the most recent three session records
        const recentSessions = await sessionModel.find()
            .sort({ createdAt: -1 })  // Sort by the `createdAt` field in descending order
            .limit(3);  // Limit to the most recent three records

        if (!recentSessions.length) {
            res.status(404).json({ status: false, message: "No recent session data found." });
            return;
        }

        res.status(200).json({ status: true, message: "Recent session data retrieved successfully.", data: recentSessions });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
};




export { createSession, getAllSession, getSessionById, updateSessionById, deleteSessionById, getRecentSessions }