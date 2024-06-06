import { faker } from '@faker-js/faker'
import { PrismaClient, type product } from '@prisma/client'
import { generateQuotationId } from '../src/utils/generate.util'

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
  return await prisma.user.create({
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

async function createClient(createdById: number) {
  const name = faker.company.name()
  const tel_no = faker.phone.number()
  const contact_no = faker.phone.number()
  const email = faker.internet.email()
  const address =
    faker.location.streetAddress(true) +
    ' ' +
    faker.location.city() +
    ' ' +
    faker.location.country()

  return await prisma.client.create({
    data: {
      name,
      tel_no,
      contact_no,
      email,
      address,
      created_by_id: createdById,
    },
  })
}

async function createCategory() {
  await prisma.category.createMany({
    data: [
      {
        name: 'hardware',
      },
      {
        name: 'software',
      },
      {
        name: 'service',
      },
    ],
  })
}

async function createProduct() {
  return await prisma.product.create({
    data: {
      name: 'Test system',
      description: '<ul><li>Test</li><li>Another test</li></ul>',
      price: 999.0,
      category_id: 2,
    },
  })
}

async function createQuotationStatuses() {
  const [pendingStatus] = await prisma.$transaction([
    prisma.quotation_status.create({
      data: {
        name: 'PENDING',
      },
    }),
    prisma.quotation_status.create({
      data: {
        name: 'APPROVED',
      },
    }),
  ])

  return pendingStatus
}

async function createQuotation(
  userId: number,
  quotationStatusId: number,
  clientId: number,
  product: product,
) {
  const { id, monthYear } = await generateQuotationId()

  await prisma.quotation.create({
    data: {
      id,
      month_year: monthYear,
      created_by: userId,
      quotation_status_id: quotationStatusId,
      type: 'software',
      subject: 'Quotation for POS Hardware bundle',
      date: '2024-06-06T07:11:53.201Z',
      expiry_date: '2024-06-06T07:11:53.201Z',
      note: 'test note',
      terms_and_conditions:
        'PAYMENT/DELIVERY\nA. PAYMENT\n50% DOWNPAYMENT REQUIRED UPON RECEIPT OF P.O. FULL PAYMENT IS DUE UPON DELIVERY.',
      client_id: clientId,
      quotation_product: {
        createMany: {
          data: [
            {
              product_id: product.id,
              entry_name: product.name,
              entry_description: product.description,
              entry_price: product.price,
              entry_category_id: product.category_id,
              markup: 20,
              vat_ex: 1198.8,
              vat_inc: 1342.6560000000002,
              vat_type: 'vat_inc',
              duration: 24,
              quantity: 3,
              total_amount: 96671.23200000002,
            },
          ],
        },
      },
      grand_total: 96671.23200000002,
    },
  })
}

async function main() {
  const adminRole = await createRole()
  const user = await createUser(adminRole.id)
  await createTermsAndConditionPreset()
  const client = await createClient(user.id)
  await createCategory()
  const product = await createProduct()
  const pendingStatus = await createQuotationStatuses()
  await createQuotation(user.id, pendingStatus.id, client.id, product)
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
