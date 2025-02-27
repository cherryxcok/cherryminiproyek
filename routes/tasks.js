// filepath: /Users/cherrycok/Desktop/Kuliah/SEM 7/PPW II - Triandes/miniproyek/cherryminiproyek/routes/tasks.js
const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const validateTask = require("../middlewares/validateTask");

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateTask, createTask);
router.get("/", getTasks);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;