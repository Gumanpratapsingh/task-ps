const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/tasks');

const app = express();  // Ensure this line comes before any app.use() calls

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/tasks', taskRoutes);  // Now app is already initialized

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});