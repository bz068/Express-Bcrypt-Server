const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var colors = require("colors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(bodyParser.json());

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running on PORT: https://localhost:${PORT}`.underline.red
  )
);

// MONGOOSE CONNECTION
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MONGODB ATLAS".bold.white);
  }
);

// ROUTES
app.use("/auth", require("./Routes/userRoutes"));
