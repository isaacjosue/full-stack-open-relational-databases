const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Blog,
          attributes: { exclude: ["userId"] },
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, name, password } = req.body;
    if (!(username && name && password)) throw new Error("Missing data");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, name, passwordHash });
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:username", async (req, res) => {
  const listWhere = req.query.read ? { read: req.query.read === "true" } : {};

  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
    include: {
      model: Blog,
      as: "readings",
      attributes: { exclude: ["userId"] },
      through: {
        attributes: [],
      },
      include: {
        model: ReadingList,
        as: "readingLists",
        attributes: ["id", "read"],
        where: listWhere,
      },
    },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
