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
exports.verifyPayment = exports.getOrderDataFilters = exports.createOrders = exports.getAllOrders = void 0;
const ordersModel_1 = __importDefault(require("./ordersModel"));
const razorpay_1 = __importDefault(require("../../shared/utils/razorpay"));
const userSubscriptionsModel_1 = __importDefault(require("../subscriptions/userSubscriptions/userSubscriptionsModel"));
const subscriptionTypeModel_1 = __importDefault(require("../subscriptions/subscriptionType/subscriptionTypeModel"));
const authModel_1 = __importDefault(require("../auth/authModel"));
const subscriptionPlanModel_1 = __importDefault(require("../subscriptions/subscriptionPlans/subscriptionPlanModel"));
const nodemailer_1 = __importDefault(require("../../shared/utils/nodemailer"));
const { sendEmail } = nodemailer_1.default;
const { createOrder, verifyPaymentSignature } = razorpay_1.default;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield ordersModel_1.default.find().populate("userId planId");
        if (orders.length === 0) {
            return res
                .status(404)
                .json({ status: false, message: "Orders data not found" });
        }
        res
            .status(200)
            .json({
            status: true,
            message: "Orders data fetch successfully",
            data: orders,
        });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error: error });
    }
});
exports.getAllOrders = getAllOrders;
const createOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, planId, typeId, amount } = req.body;
        const rzpOrderResp = yield createOrder(amount);
        const order = yield ordersModel_1.default.create({
            userId: userId,
            planId: planId,
            typeId: typeId,
            rzpResponseData: {
                razorpay_order_id: rzpOrderResp.id,
            },
            orderStatus: rzpOrderResp.status,
            amount: rzpOrderResp.amount,
            currency: rzpOrderResp.currency,
            paymentStatus: "pending",
        });
        if (!order) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to create order.." });
        }
        res
            .status(200)
            .json({
            status: true,
            message: "Order created successfully",
            data: order,
        });
    }
    catch (error) {
        console.log("error", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error: error });
    }
});
exports.createOrders = createOrders;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const isVerified = verifyPaymentSignature({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        });
        if (!isVerified) {
            return res
                .status(400)
                .json({ status: false, message: "Invalid payment signature." });
        }
        const order = yield ordersModel_1.default
            .findOneAndUpdate({ "rzpResponseData.razorpay_order_id": razorpay_order_id }, {
            paymentStatus: "paid",
            "rzpResponseData.razorpay_payment_id": razorpay_payment_id,
            "rzpResponseData.razorpay_signature": razorpay_signature,
        }, { new: true })
            .populate("planId typeId");
        if (!order) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to update order status." });
        }
        const subscriptions = yield subscriptionTypeModel_1.default.findById(order.typeId);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + order.planId.duration); // Assuming a 1-month subscription
        const subscription = yield userSubscriptionsModel_1.default
            .findOneAndUpdate({ userId: order.userId, planId: order.planId }, {
            userId: order.userId,
            planId: order.planId,
            typeId: order.typeId,
            subscriptionType: subscriptions.subscriptionType,
            startDate: startDate,
            endDate: endDate,
            status: "active",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        }, { upsert: true, new: true });
        const user = yield authModel_1.default.findById(order.userId).select("fullName email");
        const subscriptionPlan = yield subscriptionPlanModel_1.default.findById(order.planId).select("planName price");
        const subscriptionType = yield subscriptionTypeModel_1.default.findById(order.typeId).select("subscriptionType");
        if (!user || !subscriptionPlan || !subscriptionType) {
            return res
                .status(400)
                .json({ status: false, message: "Failed to retrieve user, plan or subscription type details." });
        }
        const message = `
          <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        .header img {
            width: 60%;
            height: auto;
        }

        .content {
            padding: 20px;
        }

        .content p {
            font-size: 18px;
            line-height: 1.8;
        }

        .content ul {
            list-style-type: none;
            padding: 0;
        }

        .content li {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 10px;
        }

        .content li::before {
            content: "• ";
            color: #0066cc;
            font-weight: bold;
        }

        .content b {
            font-weight: bold;
        }

        .button {
            display: block;
            width: 220px;
            margin: 30px auto;
            padding: 12px 25px;
            text-align: center;
            background-color: #0066cc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #005bb5;
        }

        .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 14px;
            color: #777;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            margin: 0 10px;
            text-decoration: none;
            color: #777;
        }

        .social-links img {
            width: 24px;
            height: 24px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://imagerating.ioweb3.in/1726463694017-401447154-Quiz-Daily-(4)-1.png" alt="DataGyani Logo">
        </div>
        <div class="content">
            <p>Hello, <b>${user.fullName}</b></p>
            <p>Thank you for registering with <b>DataGyani</b>! Here are the details of your plan:</p>
            <ul>
                <li><b>Subscription Type:</b> ${subscriptionType.subscriptionType}</li>
                <li><b>Plan Name:</b> ${subscriptionPlan.planName}</li>
                <li><b>Plan Price:</b> ₹ ${subscriptionPlan.price}</li>
                <li><b>Start Date:</b> ${new Date(subscription.startDate)}</li>
                <li><b>Expiration Date:</b> ${new Date(subscription.endDate)}</li>
            </ul>
            <p>Thank you,<br>The <b>DataGyani</b> Team</p>
        </div>
        <div class="footer">
            <div class="social-links">
                <a href="https://facebook.com/yourpage" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook">
                </a>
                <a href="https://twitter.com/yourpage" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter">
                </a>
                <a href="https://linkedin.com/yourpage" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn">
                </a>
                <a href="https://instagram.com/yourpage" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram">
                </a>
            </div>
            &copy; 2024 <b>DataGyani</b>. All rights reserved.
        </div>
    </div>
</body>

</html>
        `;
        // Send email using your email service provider
        yield sendEmail(user.email, "Verify Your Email Address", message);
        res
            .status(200)
            .json({
            status: true,
            message: "Payment verified successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("error", error);
        res
            .status(500)
            .json({ status: false, message: "Internal server error", error });
    }
});
exports.verifyPayment = verifyPayment;
const getOrderDataFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, limit, start, paymentStatus, amount, currency, fullName, planName, } = req.body;
        const filter = {};
        if (search) {
            const searchRegex = new RegExp(search, "i");
            const [fullName, planName] = yield Promise.all([
                authModel_1.default.findOne({ fullName: searchRegex }),
                subscriptionPlanModel_1.default.findOne({ planName: searchRegex }),
            ]);
            const searchConditions = [
                { paymentStatus: searchRegex },
                { amount: searchRegex },
                { currency: searchRegex },
                { userId: fullName === null || fullName === void 0 ? void 0 : fullName._id },
                { planId: planName === null || planName === void 0 ? void 0 : planName._id },
            ];
            filter.$or = searchConditions;
        }
        if (fullName) {
            const users = yield authModel_1.default.find({
                fullName: new RegExp(fullName, "i"),
            });
            if (users.length > 0) {
                filter.userId = { $in: users.map((c) => c._id) };
            }
            else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching users found" });
            }
        }
        if (planName) {
            const plans = yield subscriptionPlanModel_1.default.find({
                planName: new RegExp(planName, "i"),
            });
            if (plans.length > 0) {
                filter.planId = { $in: plans.map((c) => c._id) };
            }
            else {
                return res
                    .status(404)
                    .json({ status: false, message: "No matching plan found" });
            }
        }
        if (paymentStatus) {
            filter.paymentStatus = new RegExp(paymentStatus, "i");
        }
        if (amount) {
            filter.amount = new RegExp(amount, "i");
        }
        if (currency) {
            filter.currency = new RegExp(currency, "i");
        }
        const OrderData = yield ordersModel_1.default
            .find(filter)
            .populate("userId", "fullName")
            .populate("planId", "planName")
            .skip(parseInt(start))
            .limit(parseInt(limit));
        if (OrderData.length === 0) {
            res.status(404).json({ status: false, message: "Orders not found" });
            return;
        }
        res.status(200).json({
            status: true,
            totalRecords: OrderData.length,
            message: "Orders fetch successfully..",
            data: OrderData,
        });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getOrderDataFilters = getOrderDataFilters;
