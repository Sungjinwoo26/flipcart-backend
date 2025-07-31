const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    status: { type: String, default: "active" },
    updatedAt: { type: Date, default: Date.now },
  })
);

// ✅ Add to cart route
router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;

    if (!productId || !user) {
      return res
        .status(400)
        .json({ message: "productId and user are required" });
    }

    let cart = await Cart.findOne({ userId: user, status: "active" });

    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ error: "Internal server error, item not added" });
  }
});

// ✅ Get all carts
router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (error) {
    console.log("Error fetching cart", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

module.exports = router;
