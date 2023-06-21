const { QueryTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const authors = await sequelize.query(`
    SELECT "author", SUM("likes") as "likes", COUNT("author") as "articles" FROM blogs
    GROUP BY "author"
    ORDER BY "likes" DESC
    `, { type: QueryTypes.SELECT });
    res.json(authors);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
