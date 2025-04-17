const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { razorpayInstance } = require("../utils/razorpay");
const Payment = require("../models/payment");
const { memberShipAmount } = require("../utils/constants");
const paymentRouter = express.Router();
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const user = require("../models/user");

paymentRouter.post("/create", userAuth, async (req, res) => {
    try {
        const { memberShipType } = req.body.memberShipType;
        const { firstName, lastName, emailId } = req.user;
        const order = await razorpayInstance.orders.create({
            amount: memberShipAmount[memberShipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                "firstName": firstName,
                "lastName": lastName,
                "emailId": emailId,
                "membershipType": memberShipType
            }
        });

        //Save it in my database
        console.log("-----------------------------------------------------------" + order);
        const payment = new Payment({
            userId: req?.user?._id,
            orderId: order?.id,
            amount: order?.amount,
            currency: order?.currency,
            receipt: order?.receipt,
            notes: order?.notes,
            status: order?.status
        });
        const savedPayment = await payment.save();
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    }
    /**
     * {
        "id": "order_IluGWxBm9U8zJ8",
        "entity": "order",
        "amount": 5000,
        "amount_paid": 0,
        "amount_due": 5000,
        "currency": "INR",
        "receipt": "rcptid_11",
        "offer_id": null,
        "status": "created",
        "attempts": 0,
        "notes": [],
        "created_at": 1642662092
    }
     */

    //Return back my order details to frontend
    catch (error) {
        console.log('error: ', error);
        res.status(500).send(error);
    }
})
paymentRouter.post("/webhook", async (req, res) => {
    //Razorpay External will call to this api .so we should no put userAuth middleware.
    try {
        /* NODE SDK: https://github.com/razorpay/razorpay-node */
        const webhookSignature = req.headers['x-razorpay-signature'];
        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
        if (!isWebhookValid) {
            return res.status(500).json({ message: "Webhook Signature  is not valid" });
        }
        //If webhook is valid then do the following
        //Update my payment status in my database
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOneAndUpdate({ orderId: paymentDetails.order_id }, { status: paymentDetails.status });
        //Update my user status in my database as premium user
        const user=await user.findOneAndUpdate({_id:payment.userId},{isPremiumUser:true},{memberShipType:payment?.notes?.membershipType});
        //Return success response to razorpay
        // if(req.body.event==="payment.captured"){

        // }
        // if(req.body.event==="payment.failed"){

        // }
        res.status(200).json({ message: "Webhook is valid" });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send(error);
    }
});
module.exports = { paymentRouter };