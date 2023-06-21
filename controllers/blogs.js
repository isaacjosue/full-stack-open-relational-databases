const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const router = require("express").Router();
const { Blog, User } = require("../models");
const { tokenExtractor, verifyAccess } = require("../utils/middleware");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: {
        title: { [Op.iLike]: `%${req.query.search}%` },
        author: { [Op.iLike]: `%${req.query.search}%` },
      },
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["title", "DESC"]],
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", tokenExtractor, verifyAccess, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.user.id });
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", blogFinder, async (req, res) => {
  const { blog } = req;
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.delete(
  "/:id",
  blogFinder,
  tokenExtractor,
  verifyAccess,
  async (req, res) => {
    const { blog, user } = req;
    try {
      if (user.id !== blog.userId) throw new Error("Unauthorized");
      if (!blog) res.status(404).end();
      await blog.destroy();

      res.status(204).json(blog);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
);

router.put(
  "/:id",
  blogFinder,
  tokenExtractor,
  verifyAccess,
  async (req, res) => {
    const { blog, user } = req;
    try {
      if (user.id !== blog.userId) throw new Error("Unauthorized");
      if (!blog) res.status(404).end();

      blog.likes = req.body.likes;
      await blog.save();

      res.json(blog);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
);

module.exports = router;
