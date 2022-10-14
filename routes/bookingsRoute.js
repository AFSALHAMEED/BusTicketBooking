const router = require("express").Router();

const Booking = require("../models/bookingsModel");

const Bus = require("../models/busModel");

const authMiddleware = require("../middlewares/authMiddleware");

const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");

// book seat

router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,

      user: req.body.userId,
    });
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();
    res.status(200).send({
      message: "Booking Successfull",
      success: true,
      data: newBooking,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking Failed",
      success: false,
      data: error,
    });
  }
});

// make payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.paymentIntents.create(
      {
        amount: amount,
        currency: "inr",
        customer: customer.id,
        payment_method: "pm_card_in",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      res.status(200).send({
        message: "payment Successfull",
        data: {
          transactionId: payment.id,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        message: "payment failed1",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "payment failed",
      data: error,
      success: false,
    });
  }
});

// get-booking-by-user-id

router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");

    res.status(200).send({
      message: "Buses Fetching Successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    console.log(req.body.userId);
    res.status(500).send({
      message: "Buses Fetching failed ",
      data: error,
      success: false,
    });
  }
});

module.exports = router;
