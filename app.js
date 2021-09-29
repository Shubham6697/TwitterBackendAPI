const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");
const helmet = require("helmet");

const morgan = require("morgan");
const session = require("express-session");
const userRoute = require("./routes/users");
const authRoute = require("./routes/authenticationUser");
const cookies = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

//Express App
const app = express();

//Session Time
const timeLimit = 1000 * 60 * 60 * 12; //12 hours

// DB URI
const dbURI =
  "mongodb+srv://dbUser:dbUser123@cluster0.cbr1j.mongodb.net/Twitter?retryWrites=true&w=majority";

//home
app.get("/", (req, res) => {
  res.send("Welcome to Twitter");
});

app.get("/users", (req, res) => {
  res.send("Welcome to User page");
});

//listening to server
app.listen(3000, () => {
  console.log("Sucessfully Running App.");
});

//DB Connection and listen for port:3000
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Now connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/authentication", authRoute);

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    cookie: { maxAge: timeLimit },
    saveUninitialized: true,
  })
);
app.use(cookies());
