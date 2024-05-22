import { Grid, GridCol } from '@mantine/core'
import DashboardCard from './DashboardCard'
import OverviewDataCard from './OverviewDataCard'

const mockData = {
  pendingQuotation: 1,
  expiredQuotations: 13,
}

export default function OverviewCard() {
  return (
    <DashboardCard title="Overview">
      <Grid grow>
        <GridCol span={3}>
          <OverviewDataCard
            title="Pending quotations"
            data={mockData.pendingQuotation}
            link="/quotations/all?filter=pending"
          />
        </GridCol>

        <GridCol span={3}>
          <OverviewDataCard
            title="Expired quotations"
            data={mockData.expiredQuotations}
            link="/quotations/all?filter=expired"
          />
        </GridCol>
      </Grid>
    </DashboardCard>
  )
}