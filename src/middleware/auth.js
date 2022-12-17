const jwt = require("jsonwebtoken");

const { JWT_TOKEN, HEADER_TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  console.log("_________________________ authenticating user");
  const token = req.headers[HEADER_TOKEN_KEY];

  if (!token) {
    res.status(403).json({
      status: false,
      message: "authentication token required",
    });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_TOKEN);
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
