const express = require("express");
var bodyParser = require('body-parser')
var cors = require('cors')
require("./services/cron/roiCron");
const cookieParser = require("cookie-parser"); 
const dotenv = require("dotenv");
dotenv.config();

const { testDbConnection } = require("./services/connection/database");

const app = express();


// 🔥 middleware section
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://admin.globel.co.in",
    "https://globel.co.in"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(cookieParser()); 
app.use(express.json());

// Parse JSON-encoded bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static("uploads"));

// IMPORTANT: Allow preflight requests
// app.options("*", cors());


const userRoutes = require("./services/routes/User");
const transactionRoutes = require("./services/routes/transaction");
const scannerRoutes = require("./services/routes/Scanner")

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/scanner", scannerRoutes);

app.get("/", (req, res) => {
  res.send("Networking Backend Running 🚀");
});

const PORT = process.env.PORT || 8000;
testDbConnection()
app.listen(PORT, () => {
  console.log(`Server started at https://localhost:${PORT}`);
});