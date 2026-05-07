const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const ceo = await prisma.user.upsert({
    where: { email: 'ceo@company.com' },
    update: {},
    create: {
      name: 'CEO Admin',
      email: 'ceo@company.com',
      password: hashedPassword,
      role: 'CEO',
    },
  });

  console.log('Seed completed: Created CEO user (ceo@company.com / admin123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
