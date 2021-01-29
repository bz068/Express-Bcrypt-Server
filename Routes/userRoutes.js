const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    // VALIDATION
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ errorMessage: "Please Enter All Fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ errorMessage: "Password Should Be 6 Characters or More." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ errorMessage: "Password Does Not Match. Please Try Again." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "Email Address is Taken, Please Try Again." });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // SAVE USER
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // ASIGN TOKEN
    const token = jwt.sign(
      {
        userID: savedUser._id,
        userFirstName: savedUser.firstName,
        userLastName: savedUser.lastName,
      },
      process.env.JWT_SECRET
    );

    // SEND TOKEN IN COOKIE HTTP_ONLY
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// lOGIN ROUTE

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // VLAIDATION
    if (!email || !password) {
      return res.status(400).json({ errorMessage: "Please Enter All Fields." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ errorMessage: "Wrong Email or Password" });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!correctPassword)
      return res.status(401).json({ errorMessage: "Wrong Email or Password" });

    // ASIGN TOKEN
    const token = jwt.sign(
      {
        userID: existingUser._id,
        userFirstName: existingUser.firstName,
        userLastName: existingUser.lastName,
      },
      process.env.JWT_SECRET
    );

    // SEND TOKEN IN COOKIE HTTP_ONLY
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});
module.exports = router;
