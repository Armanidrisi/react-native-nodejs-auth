const router = require("express").Router();
const User = require("../models/User");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", (req, res) => {
  res.json({ running: true });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide both email and password.",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ username });

    console.log(user);
    // If user doesn't exist, return error
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid username or password.",
      });
    }

    // Check if password is valid
    const isPasswordValid = await user.checkPassword(password);

    // If password is invalid, return error
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid username or password.",
      });
    }

    // Generate JWT token
    const token = user.getJwtToken();

    // Login successful, send token in response
    res.status(200).json({
      status: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    // Error occurred during login process
    res.status(500).json({
      status: false,
      message: "Internal Server Error.",
    });
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all required details are provided
  if (!username || !email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide all details.",
    });
  }

  try {
    // Check if user already exists with the provided email or username
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists with this email or username.",
      });
    }

    // Create a new user instance
    const user = new User({ username, email, password });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = user.getJwtToken();

    // Registration successful, send token in response
    return res.status(200).json({
      status: true,
      message: "Successfully registered.",
      token,
    });
  } catch (error) {
    // Error occurred during registration process
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
    console.log(error);
  }
});

router.get("/profile", jwtMiddleware, async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
