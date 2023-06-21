const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");
const { User, Access } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const verifyAccess = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user) return res.status(404).json({ error: "user does not exist" });
  if (user.disabled)
    return res.status(401).json({ error: "your account has been disabled" });

  const access = await Access.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!access.canAccess)
    return res.status(401).json({ error: "token invalid" });

  req.user = user;
  next();
};

module.exports = { tokenExtractor, verifyAccess };
