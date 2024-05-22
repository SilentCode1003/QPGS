import ChartCard from '@/app/components/dashboard/ChartCard'
import OverviewCard from '@/app/components/dashboard/OverviewCard'
import RecentQuotationsCard from '@/app/components/dashboard/RecentQuotationsCard'
import { Grid, GridCol, Stack, Title } from '@mantine/core'

export default function Dashboard() {
  return (
    <Stack>
      <Title>Dashboard</Title>

      <Grid>
        {/* Left card */}
        <GridCol span={{ base: 12, lg: 9 }}>
          <Stack>
            <OverviewCard />
            <ChartCard />
          </Stack>
        </GridCol>

        {/* Right card */}
        <GridCol span={{ base: 12, lg: 3 }}>
          <Stack>
            <RecentQuotationsCard />
          </Stack>
        </GridCol>
      </Grid>
    </Stack>
  )
}
