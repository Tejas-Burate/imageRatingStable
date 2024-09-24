import authModel from "./authModel";
import { Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import roleModel from "../role/roleModel";
import generateJwtToken from "../../shared/utils/jwtToken";
import Auth from "../../shared/utils/auth";
import geoip from "geoip-country";
import generalQuizSessionModel from "../session/sessionModel";
import competitionQuizSessionModel from "../quizCompetition/session/sessionModel"
import userQuestionMappingModel from "../userQuestionMapping/userQuestionMappingModel";
const { calculateAge } = Auth;

const register = async (req: Request, res: Response) => {
    try {
        const role = await roleModel.findOne({ roleName: RegExp("User", "i") });
        if (!role) {
            res.status(400).json({ status: false, message: "User role not found." });
            return;
        }
        const user = await authModel.create({ ...req.body });

        if (!user) {
            res
                .status(400)
                .json({ status: false, message: "Failed to register new user." });
            return;
        }

        let token = await generateJwtToken({ email: user.email, _id: user._id });
        if (token) {
            user.token = token;
            await user.save();
        }

        res
            .status(201)
            .json({ status: true, message: "User registered successfully.", token });
    } catch (error: any) {
        if (error.code === 11000) {
            res
                .status(400)
                .json({
                    status: false,
                    message: `${error.keyValue.email} is already registered.`,
                });
        } else {
            console.log("Error:", error);
            res
                .status(500)
                .json({
                    status: false,
                    message: "An error occurred during registration.",
                });
        }
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const user = await authModel.findOne({
            email: req.body.email,
            password: req.body.password,
        });

        if (!user) {
            res.status(404).json({ status: false, message: "Failed to login" });
            return;
        }
        let token = await generateJwtToken({ email: user.email, _id: user._id });
        if (token) {
            user.token = token;
            user.save();
        }
        res
            .status(200)
            .json({ status: true, message: "User login successfully..", token });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getAllAuth = async (req: Request, res: Response) => {
    try {
        const user = await authModel.find();

        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Auth data not found" });
            return;
        }

        res
            .status(200)
            .json({
                status: true,
                totalRecords: await authModel.countDocuments(),
                message: "Auth data fetch successfully..",
                data: user,
            });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getAuthFilters = async (req: Request, res: Response) => {
    try {

        const {
            search,
            limit, // Default limit
            start, // Default start
            fullName,
            email,
            country
        } = req.body;

        const filter: any = {};

        // Construct search conditions based on the search input
        if (search) {
            const searchRegex = new RegExp(search, "i");

            // Array to hold search conditions
            const searchConditions = [
                { fullName: searchRegex },
                { email: searchRegex },
                { country: searchRegex }
            ];

            filter.$or = searchConditions;
        }

        // Additional filters for specific fields
        if (fullName) {
            filter.fullName = new RegExp(fullName, "i");
        }
        if (email) {
            filter.email = new RegExp(email, "i");
        }
        if (country) {
            filter.country = new RegExp(country, "i");
        }

        const user = await authModel.find(filter).skip(parseInt(start)).limit(parseInt(limit));

        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Auth data not found" });
            return;
        }

        res
            .status(200)
            .json({
                status: true,
                totalRecords: await authModel.countDocuments(),
                message: "Auth data fetch successfully..",
                data: user,
            });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const getAuthById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await authModel.findById(id);

        if (!user) {
            res
                .status(404)
                .json({
                    status: false,
                    message: `Auth data of userID ${id} not found`,
                });
            return;
        }

        res
            .status(200)
            .json({
                status: true,
                message: "Auth data fetch successfully..",
                data: user,
            });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const updateAuthById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await authModel.findByIdAndUpdate(id, { ...req.body });

        if (!user) {
            res
                .status(404)
                .json({
                    status: false,
                    message: `Failed to updated Auth data of userID ${id}`,
                });
            return;
        }
        let isMinor = false;
        if (user.dob && calculateAge(user.dob) <= 16) {
            isMinor = true;
        } else {
            isMinor = false;
        }

        res
            .status(200)
            .json({
                status: true,
                message: "Auth data updated successfully..",
                data: { ...user.toObject(), isMinor },
            });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
};

const updateUserCountry = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const ip: any = req.headers['x-forwarded-for'];
        let ipAddress;
        if (ip) {
            ipAddress = ip.split(',')[0].trim();
        } else {
            ipAddress = req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
        }
        let geo: any = geoip.lookup(ipAddress);
        if (!geo) {
            res.status(404).json({ status: false, message: "Failed to get country by ip address" })
        }

        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: `User of Id ${id} is not found` });
        }

        user.country = geo.name;
        await user.save();

        return res.status(200).json({ status: true, message: "User location updated" })
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error })

    }
}

const googleAuthLogAndRegister = async (req: Request, res: Response) => {
    const ip: any = req.headers['x-forwarded-for'];
    let ipAddress;
    if (ip) {
        ipAddress = ip.split(',')[0].trim();
    } else {
        ipAddress = req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
    }
    let geo: any = geoip.lookup(ipAddress);
    if (!geo) {
        res.status(404).json({ status: false, message: "Failed to get country by ip address" })
    }

    try {
        const { email, emailVerified, photoUrl, fullName, googleAuthId } = req.body;
        if (!email || !photoUrl || !fullName) {
            res.status(402).json({ status: false, message: "All fields required" });
            return;
        }
        let isMinor = false;
        let data = await authModel.findOne({ email: email });

        if (data) {
            if (data.dob && calculateAge(data.dob) <= 16) {
                isMinor = true;
            } else {
                isMinor = false;
            }
            const token = jwt.sign(
                { userId: data._id, email: data.email },
                process.env.Jwt_Secret_Key as string,
                { expiresIn: "8h" }
            );

            data.fullName = fullName;
            data.profileImg = photoUrl;
            data.emailVerified = emailVerified;
            data.googleAuthId = googleAuthId;
            data.token = token;
            data.existingUser = true;
            data.country = geo.name;
            await data.save();
            return res.status(200).json({
                status: true,
                message: "User log in successfully",
                data: { ...data.toObject(), isMinor }
            });
        } else {
            data = await authModel.create({
                fullName: fullName,
                email: email,
                profileImg: photoUrl,
                emailVerified: emailVerified,
                googleAuthId: googleAuthId,
                existingUser: false,
                country: geo.name
            });

            const token = jwt.sign(
                { userId: data._id, email: data.email },
                process.env.Jwt_Secret_Key as string,
                { expiresIn: "8h" }
            );

            data.token = token;
            await data.save();
            return res.status(200).json({
                status: true,
                message: "User registered successfully",
                data,
            });
        }
    } catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "500", message: "Internal server error" });
    }
};

const checkUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user: any = await authModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: `User of UserId ${userId} is not found..` })
        }

        if (calculateAge(user.dob) <= 16) {
            return res.status(200).json({ status: true, isMinor: true });
        } else {
            return res.status(200).json({ status: true, isMinor: false });
        }


    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal sever error", error: error });

    }
}

const checkUserActiveSession = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const generalQuizSession = await generalQuizSessionModel.findOne({ userId, sessionStatus: "Running" });
        const competitionQuizSession = await competitionQuizSessionModel.findOne({ userId, sessionStatus: "Running" });

        if (generalQuizSession) {
            const userQuiz = await userQuestionMappingModel.findOne({ sessionId: generalQuizSession._id })
                .sort({ createdAt: -1 }) // Adjust the field name accordingly if it's not `createdAt`
                .limit(1);

            if (userQuiz) {
                // If there are submitted questions
                res.status(200).json({
                    status: true,
                    message: "User has an active general quiz session",
                    session: generalQuizSession,
                    sessionType: "general",
                    payload: {
                        userId: userQuiz.userId,
                        categoryId: userQuiz.categoryId,
                        questionId: userQuiz.questionId,
                        sessionId: userQuiz.sessionId,
                        isCorrect: userQuiz.isCorrect,
                        timeTaken: userQuiz.timeTaken,
                        status: userQuiz.status,
                        attempts: userQuiz.attempts
                    }
                });
            } else {
                // If no questions have been submitted yet, delete the session
                await generalQuizSessionModel.deleteOne({ _id: generalQuizSession._id });
                res.status(200).json({
                    status: true,
                    message: "User had an active general quiz session but no questions were submitted. The session has been deleted.",
                    session: null,
                    sessionType: "general"
                });
            }
        } else if (competitionQuizSession) {
            res.status(200).json({
                status: true,
                message: "User has an active competition quiz session",
                session: competitionQuizSession,
                sessionType: "competition"
            });
        } else {
            res.status(200).json({
                status: false,
                message: "User has no active sessions",
                session: null
            });
        }
    } catch (error) {
        console.error('Error checking for active session:', error);
        res.status(500).json({ status: false, message: "Internal server error", error });
    }
};



export {
    register,
    login,
    getAllAuth,
    getAuthById,
    updateAuthById,
    getAuthFilters,
    googleAuthLogAndRegister,
    checkUser,
    updateUserCountry,
    checkUserActiveSession
};
