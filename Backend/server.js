import express from "express";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import createApp from "./config/appFactory.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import hospitalRoutes from "./routes/hospitalRoute.js";

// app config using Factory Pattern
const app = createApp();
const port = process.env.PORT || 4000;

// Singleton Pattern for DB and Cloudinary
connectDB();
connectCloudinary();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/hospital", hospitalRoutes);
app.get("/", (req, res) => {
  res.send("API Working");
});

// server start
app.listen(port, () => console.log(`Server started on PORT:${port}`));
