const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
// eslint-disable-next-line no-unused-vars
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");


const app = express();

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/ReactUser", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));  


app.use(cookieSession({
  name: "session",
  keys: ["lama"],
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  // eslint-disable-next-line no-undef
  cors({
  origin:"http://localhost:3000",
  methods:"GET,POST,PUT,DELETE",
  Credentials: true,
})
);

app.use("/auth", authRoute);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
