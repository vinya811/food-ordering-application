const express = require("express");

const Order = require("../models/Order");

const router = express.Router();

// =========================
// CREATE ORDER
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      items,
      deliveryDetails,
      total
    } = req.body;

    if (
      !userEmail ||
      !items ||
      !deliveryDetails ||
      total === undefined
    ) {
      return res.status(400).json({
        message: "Missing order information."
      });
    }

    const order = await Order.create({
      userEmail: userEmail.trim().toLowerCase(),
      items,
      deliveryDetails,
      total,
      status: "Order Placed"
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order: {
        id: order._id.toString(),
        items: order.items,
        deliveryDetails: order.deliveryDetails,
        total: order.total,
        status: order.status,
        date: order.orderDate.toLocaleDateString()
      }
    });

  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Could not create order."
    });
  }
});


// =========================
// GET USER ORDERS
// =========================

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email
      .trim()
      .toLowerCase();

    const orders = await Order.find({
      userEmail: email
    }).sort({
      orderDate: -1
    });

    const formattedOrders = orders.map((order) => ({
      id: order._id.toString(),
      items: order.items,
      deliveryDetails: order.deliveryDetails,
      total: order.total,
      status: order.status,
      date: order.orderDate.toLocaleDateString()
    }));

    res.json(formattedOrders);

  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Could not load orders."
    });
  }
});


module.exports = router;