const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();

const redis = require('../redis')

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const count = (await redis.getAsync('todos')) || 0;
  await redis.setAsync('todos', parseInt(count) + 1);
  
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  try {
    req.todo = await Todo.findById(id);
    if (!req.todo) return res.sendStatus(404);
  } catch (e) {
    return res.sendStatus(400);
  }
  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  try {
    Object.assign(req.todo, req.body);
    await req.todo.save();

    res.status(200).send(req.todo);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
