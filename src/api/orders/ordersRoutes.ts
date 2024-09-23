import express from "express";
import { getAllOrders, createOrders, verifyPayment } from "./ordersController";

const router = express.Router();

router.get("/getAllOrders", getAllOrders);
router.post("/createOrders", createOrders);
router.post("/verifyPayment", verifyPayment);

export default router