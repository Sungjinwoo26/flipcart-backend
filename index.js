const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Correctly imported routes
const { router: authRoutes, authenticateJWT } = require("./auth");
const cartRoutes = require("./cart");

// ✅ Use routers with correct variable names
app.use(authRoutes);
app.use(cartRoutes);

// ✅ Connect to MongoDB (correct spelling)
mongoose.connect(
  "mongodb+srv://sungjinwoo26:<db_password>@cluster0.qm5hczw.mongodb.net/ecommerce",
  {
    useNewUrlParser: true, // ✅ Fixed: useNewURLParser → useNewUrlParser
    useUnifiedTopology: true,
  }
).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Define Product model (was missing)
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
  })
);

// ✅ GET all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // ✅ Fixed: produts → products
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "There is an internal server error" }); // ✅ Typo fixed
  }
});

// ✅ GET product by ID
app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "The item you were searching for does not exist", // ✅ Fixed grammar
      });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
