const express = require("express");
const path = require("path");
const connectDB = require("./config/database/db");
const { expressMiddleware } = require("./config/middleware/express_middleware");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
connectDB();
expressMiddleware(app);
app.use("/api/user", require("./router/user"));

// router middleware

app.use((err, req, res, next) => {
  return res.status(err.status).json({ message: err.message });
});

app.get("/", (_, res) => {
  return res.send("API running");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
