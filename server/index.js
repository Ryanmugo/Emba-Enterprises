import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authentication.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB 😎");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//Api route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
