import express from "express";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";
import { DbConnect } from "./config/dbConfig.js";
import cors from "cors";

dotenv.config();
await DbConnect();

const app = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/users", userRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
