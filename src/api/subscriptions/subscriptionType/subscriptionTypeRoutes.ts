import express from 'express';
import { createSubscriptions, getAllSubscriptionTypes, getSubscriptionTypesFilters, getSubscriptionTypeById, updateSubscriptionTypeById, deleteSubscriptionTypeById } from "./subscriptionTypeController";

const router = express.Router();

router.post("/createSubscriptions", createSubscriptions);
router.get("/getAllSubscriptionTypes", getAllSubscriptionTypes);
router.post("/getSubscriptionTypesFilters", getSubscriptionTypesFilters);
router.get("/getSubscriptionTypeById/:id", getSubscriptionTypeById);
router.put("/updateSubscriptionTypeById/:id", updateSubscriptionTypeById);
router.delete("/deleteSubscriptionTypeById/:id", deleteSubscriptionTypeById);

export default router