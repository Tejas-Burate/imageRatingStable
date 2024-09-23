"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriptionTypeController_1 = require("./subscriptionTypeController");
const router = express_1.default.Router();
router.post("/createSubscriptions", subscriptionTypeController_1.createSubscriptions);
router.get("/getAllSubscriptionTypes", subscriptionTypeController_1.getAllSubscriptionTypes);
router.post("/getSubscriptionTypesFilters", subscriptionTypeController_1.getSubscriptionTypesFilters);
router.get("/getSubscriptionTypeById/:id", subscriptionTypeController_1.getSubscriptionTypeById);
router.put("/updateSubscriptionTypeById/:id", subscriptionTypeController_1.updateSubscriptionTypeById);
router.delete("/deleteSubscriptionTypeById/:id", subscriptionTypeController_1.deleteSubscriptionTypeById);
exports.default = router;
