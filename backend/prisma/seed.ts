import { PrismaClient, type user } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createRoles() {
  await prisma.role.createMany({
    data: [
      {
        id: 1, // Admin needs to have an id of 1 (used in backend middlewares)
        name: 'ADMIN',
      },
      {
        id: 2,
        name: 'DEVELOPER',
      },
      {
        id: 3,
        name: 'USER',
      },
    ],
  })
}

async function createUsers() {
  const password = await bcrypt.hash('password', 10)

  const seededUsers = Array(45)
    .fill(0)
    .map((val, index) => {
      faker.seed(index)

      const first_name = faker.person.firstName()
      const last_name = faker.person.lastName()
      const email = faker.internet.email({ firstName: first_name, lastName: last_name })
      const username = faker.internet.userName({ firstName: first_name, lastName: last_name })

      return {
        first_name,
        last_name,
        email,
        username,
        password,
        job_title: faker.person.jobTitle(),
        role_id: faker.helpers.weightedArrayElement([
          { weight: 94, value: 3 }, // users
          { weight: 5, value: 2 }, // developers
          { weight: 1, value: 3 }, // admins
        ]),
        created_at: faker.date.past({ years: 3 }),
      } as user
    })

  await prisma.user.createMany({
    data: [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        username: 'admin',
        password: await bcrypt.hash('password', 10),
        job_title: 'Software Developer',
        role_id: 1, // ADMIN
      },
      ...seededUsers,
    ],
  })
}

async function createTermsAndConditions() {
  await prisma.terms_and_conditions.create({
    data: {
      summary: '50% Down payment required',
      body: `PAYMENT/DELIVERY
      A. PAYMENT
      50% DOWN PAYMENT REQUIRED UPON RECEIPT OF P.O. FULL PAYMENT IS DUE UPON DELIVERY
      `,
    },
  })
}

async function createClient() {
  await prisma.client.create({
    data: {
      name: faker.company.name(),
      tel_no: faker.phone.number(),
      contact_no: faker.phone.number(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }) + ' ' + faker.location.city(),
    },
  })
}

async function createPaymentTypes() {
  await prisma.payment_type.createMany({
    data: [
      {
        name: 'One-time', // Needs to be 'One-time' literal (used in ProductItem component frontend)
      },
      {
        name: 'Subscription',
      },
    ],
  })
}

const main = async () => {
  await createRoles()
  await createUsers()
  await createTermsAndConditions()
  await createClient()
  await createPaymentTypes()
}

main()
  .then(async () => {
    console.log('Finished seeding')
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
  })
