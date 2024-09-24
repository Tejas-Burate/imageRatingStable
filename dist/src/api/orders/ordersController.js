"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrders = exports.getAllOrders = void 0;
const ordersModel_1 = __importDefault(require("./ordersModel"));
const razorpay_1 = __importDefault(require("../../shared/utils/razorpay"));
const userSubscriptionsModel_1 = __importDefault(require("../subscriptions/userSubscriptions/userSubscriptionsModel"));
const subscriptionTypeModel_1 = __importDefault(require("../subscriptions/subscriptionType/subscriptionTypeModel"));
const { createOrder, verifyPaymentSignature } = razorpay_1.default;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield ordersModel_1.default.find().populate("userId planId");
        if (orders.length === 0) {
            return res.status(404).json({ status: false, message: "Orders data not found" });
        }
        res.status(200).json({ status: true, message: "Orders data fetch successfully", data: orders });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getAllOrders = getAllOrders;
const createOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, planId, typeId, amount } = req.body;
        const rzpOrderResp = yield createOrder(amount);
        const order = yield ordersModel_1.default.create({
            userId: userId, planId: planId, typeId: typeId, rzpResponseData: {
                razorpay_order_id: rzpOrderResp.id
            }, orderStatus: rzpOrderResp.status, amount: rzpOrderResp.amount, currency: rzpOrderResp.currency, paymentStatus: "pending"
        });
        if (!order) {
            return res.status(400).json({ status: false, message: "Failed to create order.." });
        }
        res.status(200).json({ status: true, message: "Order created successfully", data: order });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error });
    }
});
exports.createOrders = createOrders;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const isVerified = verifyPaymentSignature({ razorpay_payment_id, razorpay_order_id, razorpay_signature });
        if (!isVerified) {
            return res.status(400).json({ status: false, message: "Invalid payment signature." });
        }
        const order = yield ordersModel_1.default.findOneAndUpdate({ "rzpResponseData.razorpay_order_id": razorpay_order_id }, { paymentStatus: "paid", "rzpResponseData.razorpay_payment_id": razorpay_payment_id, "rzpResponseData.razorpay_signature": razorpay_signature }, { new: true }).populate("planId typeId");
        const subscriptions = yield subscriptionTypeModel_1.default.findById(order.typeId);
        if (!order) {
            return res.status(400).json({ status: false, message: "Failed to update order status." });
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + order.planId.duration); // Assuming a 1-month subscription
        const subscription = yield userSubscriptionsModel_1.default.findOneAndUpdate({ userId: order.userId, planId: order.planId }, {
            userId: order.userId,
            planId: order.planId,
            typeId: order.typeId,
            subscriptionType: subscriptions.subscriptionType,
            startDate: startDate,
            endDate: endDate,
            status: 'active',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        }, { upsert: true, new: true });
        res.status(200).json({ status: true, message: "Payment verified successfully", data: order });
    }
    catch (error) {
        console.error('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error });
    }
});
exports.verifyPayment = verifyPayment;
