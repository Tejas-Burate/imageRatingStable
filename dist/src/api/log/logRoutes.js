"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logController_1 = require("./logController");
const router = express_1.default.Router();
router.post("/createLog", logController_1.createLog);
router.get("/getAllLog", logController_1.getAllLog);
router.get("/getLogById/:id", logController_1.getLogById);
router.put("/updateLogById/:id", logController_1.updateLogById);
router.delete("/deleteLogById/:id", logController_1.deleteLogById);
exports.default = router;
