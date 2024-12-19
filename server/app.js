const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");
require("dotenv").config();
const userRoutes = require("./router/user");
const taskRoutes = require("./router/taskRoutes");
const friendRoutes = require("./router/friendRoutes");

const app = express();
const PORT = process.env.PORT;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});


// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-friend-request", ({ toUserId }) => {
    io.to(toUserId).emit("friend-request-received");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Routes
app.use("/api", userRoutes);
app.use("/", taskRoutes);
app.use("/user", friendRoutes);


server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
