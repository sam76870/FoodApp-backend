const express = require('express');
// dependencies
// for booking we need to install razorpay
const BookingRouter = express.Router();
const protectRoute = require("./authHelper");
const BookingModel = require("../models/bookingModel");
const factory = require("../helpers/factory");
const userModel = require('../models/userModel');
const Razorpay = require("razorpay");
let { KEY_ID, KEY_SECRET } =require("../secrets");
var razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

// create => Booking model me change as well as userModel => change user
const initiateBooking = async function (req, res) {
    try {
        let booking = await BookingModel.create(req.body);
        let bookingId = booking[_id];
        let userId = req.body.user;
        let user = await userModel.findById(userId);
        user.booking.push(bookingId);
        await user.save();
        const payment_capture = 1;
        const amount = 500;
        const currency = "INR";
        const options = {
            amount,
            currency,
            receipt: `rs_${bookingId}`,
            payment_capture,
        };
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            booking: booking,
            message: "booking created",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
// delete => Booking model me change as well as userModel => change user
const deleteBooking = async function (req, res) {
    try {
        let bookings = await BookingModel.findById(req.body.id);
        console.log("Bookings", bookings);
        let userId = bookings.plan;
        let user = await userModel.findByIdAndUpdate(userId);
        let idxOfBooking = user.bookings.indexOf(review["_id"]);
        user.bookings.splice(idxOfBooking, 1);
        // user.bookings.push(review["_id"]);
        await user.save();
        res.status(200).json({
            message: "Booking Deleted",
            booking: booking
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
async function verifyPayment(req, res) {
    // JWT 
    const secret = KEY_SECRET

    // console.log(req.body);
    // 
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
        console.log("request is legit");
        res.status(200).json({
            message: "OK",
        });
    } else {
        res.status(403).json({ message: "Invalid" });
    }
};
const getBookings = factory.getElements(BookingModel);
const updateBooking = factory.updateElements(BookingModel);
const getBookingById = factory.getElementById(BookingModel);

// BookingRouter.use(protectRoute);
BookingRouter.route("/verification")
    .post(verifyPayment)
BookingRouter
    .route("/:id")
    .get(getBookingById)
    .patch(updateBooking)
    .delete(deleteBooking);
BookingRouter
    .route("/")
    .post(initiateBooking)
    // protectRoute, authorizeBooking(["admin"])
    .get(getBookings);
// **************************

module.exports = BookingRouter;
