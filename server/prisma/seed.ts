import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import fs from 'node:fs'

const SEED_USER_USERNAME = process.env.SEED_USER_USERNAME
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD

if (!SEED_USER_USERNAME || !SEED_USER_PASSWORD) {
  throw new Error('Seed user is not set. Please check .env')
}

const prisma = new PrismaClient()

const seedRoles = async () => {
  const [admin] = await prisma.$transaction([
    prisma.role.create({
      data: {
        name: 'admin',
      },
    }),
    prisma.role.create({
      data: {
        name: 'user',
      },
    }),
  ])

  return admin
}

const seedUser = async (adminRoleId: number) => {
  const imageAsBase64 = fs.readFileSync('./prisma/seed-signature.png', 'base64')
  const dataUri = `data:image/png;base64,${imageAsBase64}`

  return await prisma.user.create({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      username: process.env.SEED_USER_USERNAME!,
      password: await bcrypt.hash(process.env.SEED_USER_PASSWORD!, 10),
      job_title: 'Software developer',
      role_id: adminRoleId,
      signature: dataUri,
    },
  })
}

const seedTermsAndConditions = async () => {
  await prisma.terms_and_conditions_preset.create({
    data: {
      summary: '50% Down payment required upon receipt of P.O.',
      body: '50% Down payment required upon receipt of P.O. Full payment is due upon delivery.',
    },
  })
}

const seedClient = async (createdById: number) => {
  await prisma.client.create({
    data: {
      name: faker.company.name(),
      tel_no: faker.phone.number(),
      contact_no: faker.phone.number(),
      email: faker.internet.email(),
      address:
        faker.location.streetAddress() +
        ' ' +
        faker.location.city() +
        ' ' +
        faker.location.country(),
      created_by_id: createdById,
    },
  })
}

const seedCategories = async () => {
  const [hardware] = await prisma.$transaction([
    prisma.category.create({
      data: {
        name: 'hardware',
      },
    }),
    prisma.category.create({
      data: {
        name: 'software',
      },
    }),
    prisma.category.create({
      data: {
        name: 'service',
      },
    }),
  ])

  return hardware
}

const seedProduct = async (categoryId: number) => {
  await prisma.product.create({
    data: {
      name: faker.commerce.product(),
      description: `<ul><li><p>${faker.commerce.productDescription()}</p></li></ul>`,
      price: faker.commerce.price({ max: 99_999 }),
      category_id: categoryId,
    },
  })
}

const main = async () => {
  const admin = await seedRoles()
  const user = await seedUser(admin.id)
  await seedClient(user.id)
  await seedTermsAndConditions()
  const hardware = await seedCategories()
  await seedProduct(hardware.id)
}

main()
  .then(async () => {
    console.log('Finished seeding')
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Error seeding: ', error)
    await prisma.$disconnect()
  })
