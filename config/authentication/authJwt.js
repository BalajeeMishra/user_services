const jwt = require("jsonwebtoken");
const JWT_ACC_ACTIVATE = "usingtokenforauthentication";
module.exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(404).json({ message: "No token provided" });
  }
  jwt.verify(token, JWT_ACC_ACTIVATE, (err, decoded) => {
    if (err) {
      return res.status(202).json({ message: "Unauthorized user!" });
    }
    req.userId = decoded.id;
    next();
  });
};
