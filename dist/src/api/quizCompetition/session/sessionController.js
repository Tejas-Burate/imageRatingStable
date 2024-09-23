"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentSessions = exports.deleteSessionById = exports.updateSessionById = exports.getSessionById = exports.getAllSession = exports.createSession = void 0;
const sessionModel_1 = __importDefault(require("./sessionModel"));
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield sessionModel_1.default.create(Object.assign({}, req.body));
        if (!session) {
            res.status(400).json({ status: false, message: "Error for creating Session" });
            return;
        }
        res.status(200).json({ status: true, message: "Session data fetch successfully..", data: session });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createSession = createSession;
const getAllSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield sessionModel_1.default.find();
        if (session.length === 0) {
            res.status(404).json({ status: false, message: "Session data not found" });
            return;
        }
        res.status(200).json({ status: true, totalRecords: yield sessionModel_1.default.countDocuments(), message: "Session data fetch successfully..", data: session });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllSession = getAllSession;
const getSessionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const session = yield sessionModel_1.default.findById(id);
        if (!session) {
            res.status(404).json({ status: false, message: `Session data of sessionID ${id} not found` });
            return;
        }
        res.status(200).json({ status: true, message: "Session data fetch successfully..", data: session });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getSessionById = getSessionById;
const updateSessionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const session = yield sessionModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!session) {
            res.status(404).json({ status: false, message: `Failed to updated Session data of sessionID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "Session data updated successfully..", data: session });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateSessionById = updateSessionById;
const deleteSessionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const session = yield sessionModel_1.default.findByIdAndDelete(id);
        if (!session) {
            res.status(404).json({ status: false, message: `Failed to updated Session data of sessionID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "Session data updated successfully..", data: session });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteSessionById = deleteSessionById;
const getRecentSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the most recent three session records
        const recentSessions = yield sessionModel_1.default.find()
            .sort({ createdAt: -1 }) // Sort by the `createdAt` field in descending order
            .limit(3); // Limit to the most recent three records
        if (!recentSessions.length) {
            res.status(404).json({ status: false, message: "No recent session data found." });
            return;
        }
        res.status(200).json({ status: true, message: "Recent session data retrieved successfully.", data: recentSessions });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getRecentSessions = getRecentSessions;
