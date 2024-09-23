"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSubscriptionsController_1 = require("./userSubscriptionsController");
const router = express_1.default.Router();
router.get("/getAllUserSubscriptions", userSubscriptionsController_1.getAllUserSubscriptions);
router.get("/getUserSubscriptionsById", userSubscriptionsController_1.getUserSubscriptionsById);
router.get("/getAllUserSubscriptionsByUserId", userSubscriptionsController_1.getAllUserSubscriptionsByUserId);
exports.default = router;
