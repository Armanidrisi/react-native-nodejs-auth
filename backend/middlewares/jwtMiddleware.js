const jwt = require("jsonwebtoken");

// JWT middleware function
const jwtMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization");
  // console.log(token);
  // Check if token is provided
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Access denied. No token provided.",
    });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, " process.env.JWT_SECRET");

    //console.log(decoded);
    // Attach the decoded user information to the request object
    req.user = decoded;
    console.log(decoded);
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token.",
    });
    console.log(error);
  }
};

module.exports = jwtMiddleware;
