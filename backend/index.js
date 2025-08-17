const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const database = require('./config/database');
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 4545;

database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://ai-notes-summarizer-chi.vercel.app"],  
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use("/api/v1", routes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running....."
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
