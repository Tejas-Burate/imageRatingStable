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
const logModel_1 = __importDefault(require("../../api/log/logModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = __importDefault(require("../../api/auth/authModel"));
const requestLogger = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    console.log('token', token);
    const deviceInfo = req.headers["user-agent"] || "Unknown device";
    const loginEndpoints = ["/auth/login", "/studentRegistration/login", "/auth/googleAuthLogAndRegister"]; // Add your additional login route here
    const isLoginApi = loginEndpoints.includes(req.originalUrl);
    let user = null;
    let statusCode = null;
    try {
        if (token && !isLoginApi) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.Jwt_Secret_Key);
            user = yield authModel_1.default.findOne({ _id: decoded.userId });
            const logEntry = new logModel_1.default({
                userId: user ? user._id : null,
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                headers: req.headers,
                body: req.body,
                device: deviceInfo,
            });
            yield logEntry.save();
            next();
            return;
        }
    }
    catch (error) {
        console.error("Token verification failed:", error);
        statusCode = 401;
    }
    const logEntry = new logModel_1.default({
        userId: user ? user._id : null,
        method: req.method,
        url: req.originalUrl,
        statusCode: statusCode || res.statusCode, // Capture status code from response or set earlier error status
        headers: req.headers,
        body: req.body,
        device: deviceInfo,
    });
    try {
        yield logEntry.save();
    }
    catch (error) {
        console.error("Failed to log request:", error);
        return res
            .status(500)
            .json({ status: 500, message: "Failed to log request..." });
    }
    if (!isLoginApi && (!token || !user)) {
        return res
            .status(401)
            .json({ status: 401, message: "Unauthorized user..." });
    }
    next();
});
exports.default = requestLogger;
