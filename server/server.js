import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import DBConnection from "./database/db.js";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.use("/", routes);

app.use(errorHandler);

app.get("/server", (req, res) => {
  res.json({ online: "Server" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
