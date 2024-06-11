'use client'
import { useGetAllQuotations } from './api/get-all-quotations'

export default function AllQuotationsPage() {
  const { data } = useGetAllQuotations()

  return <div>{JSON.stringify(data?.data.data, null, 2)}</div>
}
