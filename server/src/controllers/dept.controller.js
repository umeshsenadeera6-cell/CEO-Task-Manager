const prisma = require('../config/prisma');

const createDepartment = async (req, res, next) => {
  try {
    const { name, managerId } = req.body;
    
    const dept = await prisma.department.create({
      data: { name, managerId }
    });

    res.status(201).json(dept);
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const depts = await prisma.department.findMany({
      include: {
        manager: { select: { name: true, email: true } },
        _count: { select: { members: true, tasks: true } }
      }
    });
    res.json(depts);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDepartment, getDepartments };
