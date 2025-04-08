import prisma from "../lib/db"

/**
 * This script updates the "score" column of your "Content" table
 * with a random integer between 0 and 100.
 */
async function main() {
  // Using raw SQL to update every row's score in one go:
  //   random() returns a float [0,1)
  //   floor(...*100) converts to [0..99]
  //   cast to int as needed
  await prisma.$executeRawUnsafe(`
    UPDATE "Content"
    SET score = floor(random() * 100)::int
  `)

  console.log("Scores updated successfully!")
}

// Execute
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
