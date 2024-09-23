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
exports.updateUserCountry = exports.checkUser = exports.googleAuthLogAndRegister = exports.getAuthFilters = exports.updateAuthById = exports.getAuthById = exports.getAllAuth = exports.login = exports.register = void 0;
const authModel_1 = __importDefault(require("./authModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roleModel_1 = __importDefault(require("../role/roleModel"));
const jwtToken_1 = __importDefault(require("../../shared/utils/jwtToken"));
const auth_1 = __importDefault(require("../../shared/utils/auth"));
const geoip_country_1 = __importDefault(require("geoip-country"));
const { calculateAge } = auth_1.default;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield roleModel_1.default.findOne({ roleName: RegExp("User", "i") });
        if (!role) {
            res.status(400).json({ status: false, message: "User role not found." });
            return;
        }
        const user = yield authModel_1.default.create(Object.assign({}, req.body));
        if (!user) {
            res
                .status(400)
                .json({ status: false, message: "Failed to register new user." });
            return;
        }
        let token = yield (0, jwtToken_1.default)({ email: user.email, _id: user._id });
        if (token) {
            user.token = token;
            yield user.save();
        }
        res
            .status(201)
            .json({ status: true, message: "User registered successfully.", token });
    }
    catch (error) {
        if (error.code === 11000) {
            res
                .status(400)
                .json({
                status: false,
                message: `${error.keyValue.email} is already registered.`,
            });
        }
        else {
            console.log("Error:", error);
            res
                .status(500)
                .json({
                status: false,
                message: "An error occurred during registration.",
            });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.findOne({
            email: req.body.email,
            password: req.body.password,
        });
        if (!user) {
            res.status(404).json({ status: false, message: "Failed to login" });
            return;
        }
        let token = yield (0, jwtToken_1.default)({ email: user.email, _id: user._id });
        if (token) {
            user.token = token;
            user.save();
        }
        res
            .status(200)
            .json({ status: true, message: "User login successfully..", token });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.login = login;
const getAllAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.find();
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Auth data not found" });
            return;
        }
        res
            .status(200)
            .json({
            status: true,
            totalRecords: yield authModel_1.default.countDocuments(),
            message: "Auth data fetch successfully..",
            data: user,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllAuth = getAllAuth;
const getAuthFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, // Default limit
        start, // Default start
        fullName, email, country } = req.body;
        const filter = {};
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
        const user = yield authModel_1.default.find(filter).skip(parseInt(start)).limit(parseInt(limit));
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Auth data not found" });
            return;
        }
        res
            .status(200)
            .json({
            status: true,
            totalRecords: yield authModel_1.default.countDocuments(),
            message: "Auth data fetch successfully..",
            data: user,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAuthFilters = getAuthFilters;
const getAuthById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield authModel_1.default.findById(id);
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
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAuthById = getAuthById;
const updateAuthById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield authModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
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
        }
        else {
            isMinor = false;
        }
        res
            .status(200)
            .json({
            status: true,
            message: "Auth data updated successfully..",
            data: Object.assign(Object.assign({}, user.toObject()), { isMinor }),
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateAuthById = updateAuthById;
const updateUserCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const ip = req.headers['x-forwarded-for'];
        let ipAddress;
        if (ip) {
            ipAddress = ip.split(',')[0].trim();
        }
        else {
            ipAddress = req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
        }
        let geo = geoip_country_1.default.lookup(ipAddress);
        if (!geo) {
            res.status(404).json({ status: false, message: "Failed to get country by ip address" });
        }
        const user = yield authModel_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: `User of Id ${id} is not found` });
        }
        user.country = geo.name;
        yield user.save();
        return res.status(200).json({ status: true, message: "User location updated" });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.updateUserCountry = updateUserCountry;
const googleAuthLogAndRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.headers['x-forwarded-for'];
    let ipAddress;
    if (ip) {
        ipAddress = ip.split(',')[0].trim();
    }
    else {
        ipAddress = req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
    }
    let geo = geoip_country_1.default.lookup(ipAddress);
    if (!geo) {
        res.status(404).json({ status: false, message: "Failed to get country by ip address" });
    }
    try {
        const { email, emailVerified, photoUrl, fullName, googleAuthId } = req.body;
        if (!email || !photoUrl || !fullName) {
            res.status(402).json({ status: false, message: "All fields required" });
            return;
        }
        let isMinor = false;
        let data = yield authModel_1.default.findOne({ email: email });
        if (data) {
            if (data.dob && calculateAge(data.dob) <= 16) {
                isMinor = true;
            }
            else {
                isMinor = false;
            }
            const token = jsonwebtoken_1.default.sign({ userId: data._id, email: data.email }, process.env.Jwt_Secret_Key, { expiresIn: "8h" });
            data.fullName = fullName;
            data.profileImg = photoUrl;
            data.emailVerified = emailVerified;
            data.googleAuthId = googleAuthId;
            data.token = token;
            data.existingUser = true;
            data.country = geo.name;
            yield data.save();
            return res.status(200).json({
                status: true,
                message: "User log in successfully",
                data: Object.assign(Object.assign({}, data.toObject()), { isMinor })
            });
        }
        else {
            data = yield authModel_1.default.create({
                fullName: fullName,
                email: email,
                profileImg: photoUrl,
                emailVerified: emailVerified,
                googleAuthId: googleAuthId,
                existingUser: false,
                country: geo.name
            });
            const token = jsonwebtoken_1.default.sign({ userId: data._id, email: data.email }, process.env.Jwt_Secret_Key, { expiresIn: "8h" });
            data.token = token;
            yield data.save();
            return res.status(200).json({
                status: true,
                message: "User registered successfully",
                data,
            });
        }
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, error: "500", message: "Internal server error" });
    }
});
exports.googleAuthLogAndRegister = googleAuthLogAndRegister;
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield authModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: `User of UserId ${userId} is not found..` });
        }
        if (calculateAge(user.dob) <= 16) {
            return res.status(200).json({ status: true, isMinor: true });
        }
        else {
            return res.status(200).json({ status: true, isMinor: false });
        }
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal sever error", error: error });
    }
});
exports.checkUser = checkUser;
