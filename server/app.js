const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./router/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbURI =
  "mongodb+srv://ankitsaini:Ankit12345@cluster0.p55jz.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// Routes
app.use("/api", userRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
