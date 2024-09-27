"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userQuestionMappingController_1 = require("./userQuestionMappingController");
const router = express_1.default.Router();
router.post("/createUserQuestionMapping", userQuestionMappingController_1.createUserQuestionMapping);
router.get("/getAllUserQuestionMapping", userQuestionMappingController_1.getAllUserQuestionMapping);
router.get("/getUserQuestionMappingById/:id", userQuestionMappingController_1.getUserQuestionMappingById);
router.get("/getCategoryStatistics/:id", userQuestionMappingController_1.getCategoryStatistics);
router.get("/getCategoryPoints/:id", userQuestionMappingController_1.getCategoryPoints);
router.get("/getGeneralQuizGlobalResultByUserId/:id", userQuestionMappingController_1.getGeneralQuizGlobalResultByUserId);
router.put("/updateUserQuestionMappingById/:id", userQuestionMappingController_1.updateUserQuestionMappingById);
router.delete("/deleteUserQuestionMappingById/:id", userQuestionMappingController_1.deleteUserQuestionMappingById);
router.get("/getRecentQuizs/:id", userQuestionMappingController_1.getRecentQuizs);
router.post("/getSubmittedQuestions", userQuestionMappingController_1.getSubmittedQuestions);
exports.default = router;
