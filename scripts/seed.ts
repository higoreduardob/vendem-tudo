import { readFileSync } from 'fs'
import { join } from 'path'

import { db } from '@/lib/db'

async function run() {
  const seed = JSON.parse(
    readFileSync(join(__dirname, '../prisma/seed.json'), 'utf-8')
  )

  await Promise.all(
    seed.users.map((user: any) =>
      db.user.create({
        data: { ...user, selectedStore: undefined },
      })
    )
  )
  await db.store.createMany({ data: seed.stores, skipDuplicates: true })
  await Promise.all(
    seed.users.map(async (user: any) => {
      if (user.selectedStore) {
        await db.user.update({
          where: { id: user.id },
          data: { selectedStore: user.selectedStore },
        })
      }
    })
  )

  await db.address.createMany({ data: seed.addresses, skipDuplicates: true })
  await db.foodCategory.createMany({
    data: seed.foodCategories,
    skipDuplicates: true,
  })
  await db.food.createMany({ data: seed.foods, skipDuplicates: true })
  await db.foodAdditional.createMany({
    data: seed.foodAdditionals,
    skipDuplicates: true,
  })
  await db.foodAndAdditional.createMany({
    data: seed.foodAndAdditional,
    skipDuplicates: true,
  })
  await db.foodOption.createMany({
    data: seed.foodOptions,
    skipDuplicates: true,
  })
  await db.foodAdditionalAndOption.createMany({
    data: seed.foodAdditionalAndOption,
    skipDuplicates: true,
  })
}

run()
  .then(async () => {
    await prisma?.$disconnect()
    console.log('Seed completed')
  })
  .catch(async (err) => {
    console.log('Error during seed', err)
    await prisma?.$disconnect()
    process.exit(1)
  })
