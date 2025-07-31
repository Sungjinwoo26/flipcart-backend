const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { router: authRouter, authenticateJWT } = require("./auth");
const cartRouter = require("./cart");
app.use(authRoutes);
app.use(cartRoutes);

mongoose.connect(
  "mongodb+srv://sungjinwoo26:<db_password>@cluster0.qm5hczw.mongodb.net/ecommerce",
  { useNewURLParser: true, useUnifiedTopology: true }
);

app.get("./produts", async (req, res) => {
  try {
    const produts = await Product.find();
    res.json(produts);
  } catch (error) {
    res.status(500).json({ error: "There is intrnal server error" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "The items that you weree searching for does not exists",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
