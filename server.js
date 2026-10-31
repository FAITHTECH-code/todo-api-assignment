const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to allow our API to read JSON data sent in request bodies
app.use(express.json());

// In-memory array acting as our "database" for testing
let todos = [
    { id: 1, task: "Buy groceries", completed: false },
    { id: 2, task: "Clean the room", completed: true },
    { id: 3, task: "Study JavaScript", completed: false }
];

// ==========================================
// 1. READ ALL (GET /todos)
// ==========================================
app.get('/todos', (req, res) => {
    res.json(todos);
});

// ==========================================
// BONUS: GET ACTIVE TODOS (GET /todos/active)
// MUST BE PLACED BEFORE /todos/:id so Express doesn't mistake "active" for an ID
// ==========================================
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(todo => !todo.completed);
    res.json(activeTodos);
});

// ==========================================
// TASK REQUIREMENT: SINGLE READ (GET /todos/:id)
// ==========================================
app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
        return res.status(404).json({ error: "Todo item not found" });
    }
    res.json(todo);
});

// ==========================================
// TASK REQUIREMENT: VALIDATED CREATE (POST /todos)
// ==========================================
app.post('/todos', (req, res) => {
    const { task } = req.body;

    // Validation: Ensure the "task" field is provided and not empty
    if (!task || task.trim() === "") {
        return res.status(400).json({ error: "Validation failed: 'task' field is required." });
    }

    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        task: task,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// ==========================================
// 4. UPDATE (PUT /todos/:id)
// ==========================================
app.put('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
        return res.status(404).json({ error: "Todo item not found" });
    }

    const { task, completed } = req.body;
    if (task !== undefined) todo.task = task;
    if (completed !== undefined) todo.completed = completed;

    res.json({ message: "Todo updated successfully", todo });
});

// ==========================================
// 5. DELETE (DELETE /todos/:id)
// ==========================================
app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === todoId);

    if (index === -1) {
        return res.status(404).json({ error: "Todo item not found" });
    }

    todos.splice(index, 1);
    res.json({ message: "Todo item deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
