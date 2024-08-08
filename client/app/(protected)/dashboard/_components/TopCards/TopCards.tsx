'use client'

import { Grid } from '@mantine/core'
import CurrentApprovedCount from './CurrentApprovedCount'
import CurrentApprovedTotal from './CurrentApprovedTotal'
import PendingQuotations from './PendingQuotations'

export default function TopCards() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <PendingQuotations />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <CurrentApprovedCount />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <CurrentApprovedTotal />
      </Grid.Col>
    </Grid>
  )
}
