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
exports.deleteSettingById = exports.updateSettingById = exports.getSettingById = exports.getAllSetting = exports.createSetting = void 0;
const settingModel_1 = __importDefault(require("./settingModel"));
const createSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield settingModel_1.default.create(Object.assign({}, req.body));
        if (!user) {
            res.status(400).json({ status: false, message: "Error for creating Setting" });
            return;
        }
        res.status(201).json({ status: true, message: "Setting data created successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.createSetting = createSetting;
const getAllSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield settingModel_1.default.find();
        if (user.length === 0) {
            res.status(404).json({ status: false, message: "Setting data not found" });
            return;
        }
        res.status(200).json({ status: true, totalRecords: yield settingModel_1.default.countDocuments(), message: "Setting data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getAllSetting = getAllSetting;
const getSettingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield settingModel_1.default.findById(id).populate(" settingCategoryId");
        if (!user) {
            res.status(404).json({ status: false, message: `Setting data of userID ${id} not found` });
            return;
        }
        res.status(200).json({ status: true, message: "Setting data fetch successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getSettingById = getSettingById;
const updateSettingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield settingModel_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Setting data of userID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "Setting data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.updateSettingById = updateSettingById;
const deleteSettingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield settingModel_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ status: false, message: `Failed to updated Setting data of userID ${id}` });
            return;
        }
        res.status(200).json({ status: true, message: "Setting data updated successfully..", data: user });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.deleteSettingById = deleteSettingById;
