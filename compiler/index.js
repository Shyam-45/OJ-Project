import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import cookieParser from "cookie-parser";
import compilerRoutes from "./routes/compiler.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const backend_url = process.env.BACKEND_URL;

app.use(
  cors({
    origin: `${backend_url}`, // backend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use("/compiler", compilerRoutes);

app.get("/", (req, res) => {
    res.status(200).json({message: "compiler is online"});
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
