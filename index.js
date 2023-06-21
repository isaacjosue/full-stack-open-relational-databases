const express = require("express");
require("express-async-errors");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorsRouter = require("./controllers/authors");
const listsRouter = require("./controllers/lists");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/lists", listsRouter);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  switch (err.name) {
    case "SequelizeDatabaseError":
      return res.status(400).send({ error: "Invalid data" });
    case "SequelizeValidationError":
      return res.status(400).send({ error: "Missing or erroneous data found" });
    default:
      break;
  }

  next(err);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
