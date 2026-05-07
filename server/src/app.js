const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const deptRoutes = require('./routes/dept.routes');
const userRoutes = require('./routes/user.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CEO Manager API is running...');
});

// Error handling
app.use(errorHandler);

module.exports = app;
