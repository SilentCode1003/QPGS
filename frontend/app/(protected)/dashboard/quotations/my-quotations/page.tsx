'use client'
import { useUser } from '@/hooks/useUser'
import { useGetMyQuotations } from './api/get-my-quotations'

export default function MyQuotationsPage() {
  const { user } = useUser()
  const { data } = useGetMyQuotations(user!.id)

  return <div>{JSON.stringify(data?.data.data, null, 2)}</div>
}
