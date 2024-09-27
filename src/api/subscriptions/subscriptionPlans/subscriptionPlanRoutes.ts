import express from 'express';
import { createSubscriptions, getAllSubscriptionPlans, getSubscriptionPlanFilters, getSubscriptionPlanBySubscriptionTypeId, getSubscriptionPlanById, updateSubscriptionPlanById, deleteSubscriptionPlanById } from "./subscriptionPlanController";

const router = express.Router();

router.post("/createSubscriptions", createSubscriptions);
router.post("/getSubscriptionPlanFilters", getSubscriptionPlanFilters);
router.get("/getAllSubscriptionPlans", getAllSubscriptionPlans);
router.get("/getSubscriptionPlanById/:id", getSubscriptionPlanById);
router.get("/getSubscriptionPlanBySubscriptionTypeId/:id", getSubscriptionPlanBySubscriptionTypeId);
router.put("/updateSubscriptionPlanById/:id", updateSubscriptionPlanById);
router.delete("/deleteSubscriptionPlanById/:id", deleteSubscriptionPlanById);

export default router