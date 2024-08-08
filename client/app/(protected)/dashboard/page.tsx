'use client'

import { useGetMe } from '@/api/auth/me'
import { CONFIG_CONSTANT } from '@/config/constant'
import { Grid, GridCol, Text, Title } from '@mantine/core'
import MostQuotedProducts from './_components/MostQuotedProducts'
import QuotationsPerMonth from './_components/QuotationsPerMonth'
import RecentQuotations from './_components/RecentQuotations'
import TopCards from './_components/TopCards/TopCards'

export default function DashboardPage() {
  const { data, isLoading } = useGetMe()
  const isAdmin = data?.data.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME

  return (
    <div>
      <Title mt={32}>Dashboard</Title>
      <Text size="lg" my={15}>
        Welcome back, {data?.data.first_name}!
      </Text>

      <Grid grow gutter="xl">
        {!isLoading && isAdmin && (
          <>
            <GridCol>
              <TopCards />
            </GridCol>

            <GridCol span={{ base: 12, md: 6 }}>
              <QuotationsPerMonth />
            </GridCol>

            <GridCol span={{ base: 12, md: 6 }}>
              <MostQuotedProducts />
            </GridCol>
          </>
        )}

        <GridCol span={{ base: 12, md: 6 }}>
          <RecentQuotations />
        </GridCol>
      </Grid>
    </div>
  )
}
