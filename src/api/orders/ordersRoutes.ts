import express from "express";
import { getAllOrders, createOrders, verifyPayment, getOrderDataFilters } from "./ordersController";

const router = express.Router();

router.get("/getAllOrders", getAllOrders);
router.post("/createOrders", createOrders);
router.post("/verifyPayment", verifyPayment);
router.post("/getOrderDataFilters", getOrderDataFilters);

export default router