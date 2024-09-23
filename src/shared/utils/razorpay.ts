import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance with key_id and key_secret
const razorpay = new Razorpay({
    // key_id: process.env.RZP_KEY_ID as string,
    // key_secret: process.env.RZP_KEY_SECRET as string,
    key_id: "rzp_test_3GcNnPVRYq1AN9",
    key_secret: "qOV3jxYoEJ71Ksn1sbeZEJP7",
});

// Function to create a Razorpay order
const createOrder = async (amount: any) => {
    try {
        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);
        return order;
    } catch (err) {
        // Log and throw the error for further handling
        console.error(err);
        throw err;
    }
};

const verifyPaymentSignature = (razorpayResData: any) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = razorpayResData;

    const data = `${razorpay_order_id}|${razorpay_payment_id}`;

    const generatedSignature = crypto
        .createHmac("sha256", "qOV3jxYoEJ71Ksn1sbeZEJP7")
        .update(data)
        .digest("hex");
    console.log('generatedSignature', generatedSignature)

    if (generatedSignature === razorpay_signature) {
        return true;
    } else {
        return false;
    }
};

export = { createOrder, verifyPaymentSignature };
