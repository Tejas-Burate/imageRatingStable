import express from "express";

import { getAllUserSubscriptions, getUserSubscriptionsById, getAllUserSubscriptionsByUserId } from "./userSubscriptionsController"

const router = express.Router();

router.get("/getAllUserSubscriptions", getAllUserSubscriptions)
router.get("/getUserSubscriptionsById", getUserSubscriptionsById)
router.get("/getAllUserSubscriptionsByUserId/:id", getAllUserSubscriptionsByUserId)

export default router