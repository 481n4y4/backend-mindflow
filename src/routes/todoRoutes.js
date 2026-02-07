import express from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  addSubTask,
  toggleSubTask,
  deleteSubTask,
} from "../controllers/todoController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", protect, createTodo);
router.get("/", protect, getTodos);
router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);

// Subtasks
router.post("/:todoId/subtasks", protect, addSubTask);
router.put("/:todoId/subtasks/:subTaskId", protect, toggleSubTask);
router.delete("/:todoId/subtasks/:subTaskId", protect, deleteSubTask);


export default router;
