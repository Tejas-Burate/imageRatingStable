"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessionController_1 = require("./sessionController");
const router = express_1.default.Router();
router.post("/createSession", sessionController_1.createSession);
router.get("/getAllSession", sessionController_1.getAllSession);
router.get("/getSessionById/:id", sessionController_1.getSessionById);
router.put("/updateSessionById/:id", sessionController_1.updateSessionById);
exports.default = router;
