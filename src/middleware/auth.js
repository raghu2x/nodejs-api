const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  console.log("_________________________ authenticating user");
  const token = req.headers["x-token"];

  if (!token) {
    res.status(403).json({
      status: false,
      message: "authentication token required",
    });
  } else {
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return next();
  }
};

module.exports = verifyToken;
