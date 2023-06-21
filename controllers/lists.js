const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models");
const { tokenExtractor, verifyAccess } = require("../utils/middleware");

router.post("/", async (req, res) => {
  try {
    const { userId, blogId } = req.body;
    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);
    if (!(user && blog)) throw new Error("User or blog does not exist");

    const list = await ReadingList.create({ userId, blogId, read: false });
    res.json(list);
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.put("/:id", tokenExtractor, verifyAccess, async (req, res) => {
  const { user } = req;
  const list = await ReadingList.findByPk(req.params.id);
  try {
    if (!list) res.status(404).send({ error: "List does not exist" });
    if (!(user && user.id === list.userId)) throw new Error("Unauthorized");

    list.read = req.body.read;
    await list.save();

    res.json(list);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
