const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Task } = require('../models/Task'); // Corrected import statement
const jwt = require('jsonwebtoken');

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
        if (decoded.id !== req.params.userId) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        const tasks = await Task.find({ userId: req.params.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    // Validate the input
    if (!req.body.title || !req.body.description || !req.body.dueDate || !req.body.userId) {
        return res.status(400).json({ message: "All fields are required: title, description, dueDate, userId" });
    }

    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        userId: req.body.userId
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        // Log the error for debugging purposes
        console.error("Failed to save task:", err);
        res.status(500).json({ message: "Failed to create task due to server error" });
    }
});

// Get a single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.dueDate = req.body.dueDate || task.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await Task.findByIdAndDelete(req.params.id); // Updated method to delete a task
        res.json({ message: 'Deleted Task' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.json({ token: token, userId: user._id, email: user.email, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;