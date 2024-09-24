import { Request, Response } from "express";
import ordersModel from "./ordersModel";
import Orders from "../../shared/utils/razorpay";
import userSubscriptionsModel from "../subscriptions/userSubscriptions/userSubscriptionsModel";
import subscriptionTypeModel from "../subscriptions/subscriptionType/subscriptionTypeModel";

const { createOrder, verifyPaymentSignature } = Orders;

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await ordersModel.find().populate("userId planId");
        if (orders.length === 0) {
            return res.status(404).json({ status: false, message: "Orders data not found" })
        }
        res.status(200).json({ status: true, message: "Orders data fetch successfully", data: orders })
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error })

    }
}

const createOrders = async (req: Request, res: Response) => {
    try {
        const { userId, planId, typeId, amount } = req.body;

        const rzpOrderResp = await createOrder(amount)

        const order = await ordersModel.create({
            userId: userId, planId: planId, typeId: typeId, rzpResponseData: {
                razorpay_order_id: rzpOrderResp.id
            }, orderStatus: rzpOrderResp.status, amount: rzpOrderResp.amount, currency: rzpOrderResp.currency, paymentStatus: "pending"
        });
        if (!order) {
            return res.status(400).json({ status: false, message: "Failed to create order.." })
        }
        res.status(200).json({ status: true, message: "Order created successfully", data: order })
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error: error })

    }
}

const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;


        const isVerified = verifyPaymentSignature({ razorpay_payment_id, razorpay_order_id, razorpay_signature });

        if (!isVerified) {
            return res.status(400).json({ status: false, message: "Invalid payment signature." });
        }

        const order: any = await ordersModel.findOneAndUpdate(
            { "rzpResponseData.razorpay_order_id": razorpay_order_id },
            { paymentStatus: "paid", "rzpResponseData.razorpay_payment_id": razorpay_payment_id, "rzpResponseData.razorpay_signature": razorpay_signature },
            { new: true }
        ).populate("planId typeId");

        const subscriptions: any = await subscriptionTypeModel.findById(order.typeId);


        if (!order) {
            return res.status(400).json({ status: false, message: "Failed to update order status." });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + order.planId.duration); // Assuming a 1-month subscription

        const subscription = await userSubscriptionsModel.findOneAndUpdate(
            { userId: order.userId, planId: order.planId },
            {
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
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ status: true, message: "Payment verified successfully", data: order });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ status: false, message: "Internal server error", error });
    }
}

export { getAllOrders, createOrders, verifyPayment }