const prisma = require('../config/prisma');

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, departmentId, assigneeId, deadline } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        departmentId,
        assigneeId,
        deadline: deadline ? new Date(deadline) : null,
        creatorId: req.user.id
      }
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(departmentId).emit('task_created', task);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, departmentId, assigneeId } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (departmentId) filters.departmentId = departmentId;
    if (assigneeId) filters.assigneeId = assigneeId;

    // If not CEO, restrict to their department or assigned tasks
    if (req.user.role !== 'CEO') {
      if (req.user.role === 'MANAGER') {
        filters.departmentId = req.user.departmentId;
      } else {
        filters.assigneeId = req.user.id;
      }
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      include: {
        assignee: { select: { name: true, email: true, profileImage: true } },
        department: true,
        creator: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: { department: true }
    });

    const io = req.app.get('io');
    io.to(task.departmentId).emit('task_updated', task);

    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTaskStatus };
