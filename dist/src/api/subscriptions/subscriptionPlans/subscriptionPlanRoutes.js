"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriptionPlanController_1 = require("./subscriptionPlanController");
const router = express_1.default.Router();
router.post("/createSubscriptions", subscriptionPlanController_1.createSubscriptions);
router.post("/getSubscriptionPlanFilters", subscriptionPlanController_1.getSubscriptionPlanFilters);
router.get("/getAllSubscriptionPlans", subscriptionPlanController_1.getAllSubscriptionPlans);
router.get("/getSubscriptionPlanById/:id", subscriptionPlanController_1.getSubscriptionPlanById);
router.get("/getSubscriptionPlanBySubscriptionTypeId/:id", subscriptionPlanController_1.getSubscriptionPlanBySubscriptionTypeId);
router.put("/updateSubscriptionPlanById/:id", subscriptionPlanController_1.updateSubscriptionPlanById);
router.delete("/deleteSubscriptionPlanById/:id", subscriptionPlanController_1.deleteSubscriptionPlanById);
exports.default = router;
