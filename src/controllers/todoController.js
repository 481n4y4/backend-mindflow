import Todo from "../models/Todo.js";

// Add Subtask
export const addSubTask = async (req, res) => {
  const { title } = req.body;
  const { todoId } = req.params;

  if (!title) {
    return res.status(400).json({ message: "Judul subtask wajib diisi" });
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.user._id },
      { $push: { subTasks: { title } } },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan" });
    }

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Subtask
export const toggleSubTask = async (req, res) => {
  const { todoId, subTaskId } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        user: req.user._id,
        "subTasks._id": subTaskId,
      },
      {
        $set: {
          "subTasks.$.completed": true,
        },
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Subtask tidak ditemukan" });
    }

    // Update completed Todo
    todo.completed =
      todo.subTasks.length > 0 &&
      todo.subTasks.every(st => st.completed);

    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Subtask
export const deleteSubTask = async (req, res) => {
  const { todoId, subTaskId } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.user._id },
      { $pull: { subTasks: { _id: subTaskId } } },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE
export const createTodo = async (req, res) => {
  const { title, deadline, desc } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title wajib diisi" });
  }

  if (deadline && isNaN(new Date(deadline))) {
    return res.status(400).json({ message: "Format deadline tidak valid" });
  }

  try {
    const todo = await Todo.create({
      user: req.user._id,
      title,
      desc,
      deadline: deadline ? new Date(deadline) : undefined,
      subTasks: [],
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ deadline: 1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateTodo = async (req, res) => {
  const { title, desc, completed, deadline } = req.body;

  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan" });
    }

    if (title !== undefined) todo.title = title;
    if (desc !== undefined) todo.desc = desc;
    if (completed !== undefined) todo.completed = completed;
    if (deadline !== undefined)
      todo.deadline = deadline ? new Date(deadline) : null;

    const updated = await todo.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan" });
    }

    await todo.deleteOne();
    res.json({ message: "Todo berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
