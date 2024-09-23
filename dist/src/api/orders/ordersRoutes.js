"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ordersController_1 = require("./ordersController");
const router = express_1.default.Router();
router.get("/getAllOrders", ordersController_1.getAllOrders);
router.post("/createOrders", ordersController_1.createOrders);
router.post("/verifyPayment", ordersController_1.verifyPayment);
exports.default = router;
