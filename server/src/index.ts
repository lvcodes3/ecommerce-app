import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "./routes/user";
import productRouter from "./routes/product";

// express web server //
const app: Express = express();
const PORT: number = parseInt(process.env.PORT) || 5001;

// mongodb connection //
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
}

// middlewares //
app.use(express.json());
app.use(cors());

// routes //
app.use("/user", userRouter);
app.use("/products", productRouter);

// main //
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
