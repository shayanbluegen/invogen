import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create users with hashed passwords
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
    },
  })

  console.log('✅ Users created')

  // // Create companies
  // const company1 = await prisma.company.upsert({
  //   where: { userId: user1.id },
  //   update: {},
  //   create: {
  //     name: 'Your Company Inc.',
  //     email: 'your.email@company.com',
  //     phone: '+1 (555) 123-4567',
  //     address: '123 Your Street, Your City, YC 12345',
  //     website: 'https://yourcompany.com',
  //     userId: user1.id,
  //   },
  // })

  // const company2 = await prisma.company.upsert({
  //   where: { userId: user2.id },
  //   update: {},
  //   create: {
  //     name: 'Smith Enterprises',
  //     email: 'contact@smithenterprises.com',
  //     phone: '+1 (555) 987-6543',
  //     address: '456 Business Ave, Enterprise City, EC 67890',
  //     website: 'https://smithenterprises.com',
  //     userId: user2.id,
  //   },
  // })

  // console.log('✅ Companies created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
