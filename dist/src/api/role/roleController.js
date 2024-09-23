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
exports.deleteRoleById = exports.updateRoleById = exports.getRoleById = exports.getAllRole = exports.createRole = void 0;
const roleModel_1 = __importDefault(require("./roleModel"));
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield roleModel_1.default.create(Object.assign({}, req.body));
        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Role" });
            return;
        }
        res.status(201).json({ status: true, message: "Role data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createRole = createRole;
const getAllRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield roleModel_1.default.find();
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Role data not found" });
            return;
        }
        res.status(201).json({ status: true, totalRecords: yield roleModel_1.default.countDocuments(), message: "Role data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllRole = getAllRole;
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield roleModel_1.default.findById(id);
        if (!user) {
            res.status(404).json({ status: false, message: `Role data of userID ${id} not found` });
            return;
        }
        res.status(201).json({ status: true, message: "Role data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getRoleById = getRoleById;
const updateRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield roleModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Role data of userID ${id}` });
            return;
        }
        res.status(201).json({ status: true, message: "Role data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateRoleById = updateRoleById;
const deleteRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield roleModel_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Role data of userID ${id}` });
            return;
        }
        res.status(201).json({ status: true, message: "Role data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteRoleById = deleteRoleById;
