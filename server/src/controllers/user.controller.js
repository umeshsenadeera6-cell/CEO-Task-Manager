const prisma = require('../config/prisma');

const getUsers = async (req, res, next) => {
  try {
    const { departmentId, role } = req.query;
    
    const filters = {};
    if (departmentId) filters.departmentId = departmentId;
    if (role) filters.role = role;

    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        department: true,
        createdAt: true
      }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getMe };
