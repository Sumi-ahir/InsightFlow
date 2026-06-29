import express from "express";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import passport from "passport"
const app = express();

app.use(
  cors({
   origin: [
        "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.json("server is running");
});
app.use(passport.initialize());
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);


export default app;
