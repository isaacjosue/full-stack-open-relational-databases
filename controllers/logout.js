const router = require("express").Router();

const { User, Access } = require("../models");
const { tokenExtractor } = require("../utils/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user) return res.status(404).json({ error: "user does not exist" });

  const access = await Access.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!access) return res.status(401).json({ error: "token invalid" });
  access.canAccess = false
  await access.save()

  res.status(204).end()
});

module.exports = router;
