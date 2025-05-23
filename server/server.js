import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "./routes/user.js";
import problem from "./routes/problem.js";
import { authentincateUser } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import DBConnection from "./database/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.use("/user", user);

app.use("/problem", problem);

app.get("/authlogin", authentincateUser, (req, res) => {
  res.status(200).json({ success: true, error: "User Authentication successful" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
