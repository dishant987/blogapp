import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import router from "./router/route.js";
import connect from "./database/conn.js";
import helmet from "helmet"; // For security headers

config(); // Load environment variables

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.DOMAIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet()); // Add security headers

// Static files (if needed)
// app.use(express.static("public"));

// Database connection and server startup
connect()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server connected to http://localhost:${process.env.PORT || 3000}`
      );
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });

// Routes
app.use("/api", router);

app.get("/", (req, res) => {
  res.json("Get Request");
});

// Cron job (runs every minute)
cron.schedule("* * * * *", () => {
  console.log("Cron job running every minute");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});
