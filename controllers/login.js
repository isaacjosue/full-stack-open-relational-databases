const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../utils/config");
const { User, Access } = require("../models");

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = await bcrypt.compare(
    body.password,
    user.passwordHash
  );

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  if (user.disabled)
    return res.status(401).json({ error: "your account has been disabled" });

  const access = await Access.findOne({
    where: {
      userId: user.id,
    },
  });
  if (access) {
    access.canAccess = true;
    await access.save();
  } else {
    await Access.create({ userId: user.id, canAccess: true });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
