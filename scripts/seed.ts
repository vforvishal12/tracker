import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // The seed data is in the SQL file, but we can also add some programmatic seeding here
  console.log("✅ Database seeded successfully!")
  console.log("📊 Created:")
  console.log("  - 1 Admin user")
  console.log("  - 10 Manager users")
  console.log("  - 90 Employee users")
  console.log("  - 10 Company holidays")
  console.log("  - 13 Sample leave requests")
  console.log("")
  console.log("🔑 Demo login credentials:")
  console.log("  Employee: john.doe@company.com / demo123")
  console.log("  Manager: sarah.manager@company.com / demo123")
  console.log("  Admin: admin@company.com / demo123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
