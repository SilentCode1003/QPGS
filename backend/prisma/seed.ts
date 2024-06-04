import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createRole() {
  const [adminRole] = await prisma.$transaction([
    prisma.role.create({
      data: {
        name: 'ADMIN',
      },
    }),
    prisma.role.createMany({
      data: [
        {
          name: 'DEVELOPER',
        },
        {
          name: 'USER',
        },
      ],
    }),
  ])

  return adminRole
}

async function createUser(adminRoleId: number) {
  await prisma.user.create({
    data: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      username: 'admin',
      password: 'password',
      job_title: 'Software Developer',
      role_id: adminRoleId,
    },
  })
}

async function createTermsAndConditionPreset() {
  await prisma.terms_and_conditions_preset.create({
    data: {
      summary: '50% Down payment required',
      body: 'PAYMENT/DELIVERY\nA. PAYMENT\n50% DOWNPAYMENT REQUIRED UPON RECEIPT OF P.O. FULL PAYMENT IS DUE UPON DELIVERY.',
    },
  })
}

// async function createClient() {
//   await prisma.client.create({
//     data: {
//       name:
//     }
//   })
// }

async function main() {
  const adminRole = await createRole()
  await createUser(adminRole.id)
  await createTermsAndConditionPreset()
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
