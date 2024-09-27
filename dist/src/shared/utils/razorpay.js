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
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
// Initialize Razorpay instance with key_id and key_secret
const razorpay = new razorpay_1.default({
    // key_id: process.env.RZP_KEY_ID as string,
    // key_secret: process.env.RZP_KEY_SECRET as string,
    key_id: "rzp_test_3GcNnPVRYq1AN9",
    key_secret: "qOV3jxYoEJ71Ksn1sbeZEJP7",
});
// Function to create a Razorpay order
const createOrder = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };
        // Create order with Razorpay
        const order = yield razorpay.orders.create(options);
        return order;
    }
    catch (err) {
        // Log and throw the error for further handling
        console.error(err);
        throw err;
    }
});
const verifyPaymentSignature = (razorpayResData) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = razorpayResData;
    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto_1.default
        .createHmac("sha256", "qOV3jxYoEJ71Ksn1sbeZEJP7")
        .update(data)
        .digest("hex");
    if (generatedSignature === razorpay_signature) {
        return true;
    }
    else {
        return false;
    }
};
module.exports = { createOrder, verifyPaymentSignature };
