import { writeFileSync } from 'fs'
import { join } from 'path'

import { db } from '@/lib/db'

async function run() {
  const users = await db.user.findMany({})
  const stores = await db.store.findMany({})
  const addresses = await db.address.findMany({})
  const foods = await db.food.findMany({})
  const foodCategories = await db.foodCategory.findMany({})
  const foodAdditionals = await db.foodAdditional.findMany({})
  const foodAndAdditional = await db.foodAndAdditional.findMany({})
  const foodOptions = await db.foodOption.findMany({})
  const foodAdditionalAndOption = await db.foodAdditionalAndOption.findMany({})

  const seed = {
    users,
    stores,
    addresses,
    foods,
    foodCategories,
    foodAdditionals,
    foodAndAdditional,
    foodOptions,
    foodAdditionalAndOption,
  }

  writeFileSync(
    join(__dirname, '../prisma/seed.json'),
    JSON.stringify(seed, null, 2)
  )
}

run()
  .then(async () => {
    await prisma?.$disconnect()
    console.log('Export completed')
  })
  .catch(async (err) => {
    console.log('Error during export', err)
    await prisma?.$disconnect()
    process.exit(1)
  })
