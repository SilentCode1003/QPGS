'use client'
import { useUser } from '@/hooks/useUser'
import { useGetMyApprovedQuotations } from './api/get-my-approved-quotations'

export default function MyApprovedQuotationsPage() {
  const { user } = useUser()
  const { data } = useGetMyApprovedQuotations(user!.id)

  return <div>{JSON.stringify(data?.data.data, null, 2)}</div>
}
