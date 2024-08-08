'use client'
import { useGetMe } from '@/api/auth/me'
import { useApproveQuotation } from '@/api/quotations/approve'
import { useGenerateQuotation } from '@/api/quotations/generate'
import { useGetQuotationById } from '@/api/quotations/get-by-id'
import QuotationStatusBadge from '@/components/QuotationStatusBadge'
import SlugLoading from '@/components/SlugLoading'
import { CONFIG_CONSTANT } from '@/config/constant'
import { formatDateTimeToMonthDateYear, formatDateTimeToMonthDateYearTime } from '@/utils/date'
import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconFileTypeDocx } from '@tabler/icons-react'
import { useRef } from 'react'
import DescriptionRender from '../../_components/DescriptionRender'
import Comments from './_components/Comments'

export default function QuotationPage({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useGetQuotationById(Number(params.id))
  const quotation = data?.data

  const { data: user, isLoading: userIsLoading } = useGetMe()
  const isAdmin = user?.data.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME
  const quotationStatusIsPending =
    quotation?.quotation_status === CONFIG_CONSTANT.DB_QUOTATION_STATUSES.PENDING

  const { mutateAsync: approveQuotation, isPending } = useApproveQuotation(Number(params.id))

  const { mutateAsync: generateAndDownload, isPending: generateAndDownloadIsPending } =
    useGenerateQuotation(Number(params.id))

  const hiddenAnchorRef = useRef<HTMLAnchorElement | null>(null)

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      centered: true,
      children: <Text size="sm">Are you sure you want to approve this quotation?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: handleApprove,
    })

  const handleApprove = async () => {
    try {
      await approveQuotation()
      notifications.show({
        title: 'Success',
        message: 'Quotation successfully approved',
        color: 'green',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleGenerate = async () => {
    if (!hiddenAnchorRef.current) return

    try {
      const data = await generateAndDownload()
      const url = window.URL.createObjectURL(data.data)
      hiddenAnchorRef.current.href = url
      hiddenAnchorRef.current.download = data.fileName
      hiddenAnchorRef.current.click()

      notifications.show({
        title: 'Success',
        message: 'Quotation successfully generated',
        color: 'green',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Title my={32}>Quotation Information</Title>

      <Container size="xs">
        <Paper withBorder p={30} mt={30} radius="md">
          {isError && <p>Quotation not found</p>}
          {isLoading ? (
            <SlugLoading />
          ) : (
            quotation && (
              <Stack>
                <Text size="lg" fw={700}>
                  Details
                </Text>

                <div>
                  <Text size="sm">Id</Text>
                  <Text>{quotation.id}</Text>
                </div>

                <div>
                  <Text size="sm">Reference Id</Text>
                  <Text>{quotation.reference_id}</Text>
                </div>

                <div>
                  <Text size="sm">Category</Text>
                  <Text>{quotation.category.name}</Text>
                </div>

                <div>
                  <Text size="sm">Subject</Text>
                  <Text>{quotation.subject}</Text>
                </div>

                <div>
                  <Text size="sm">Date</Text>
                  <Text>{formatDateTimeToMonthDateYear(quotation.date)}</Text>
                </div>

                <div>
                  <Text size="sm">Expiry Date</Text>
                  <Text>{formatDateTimeToMonthDateYear(quotation.expiry_date)}</Text>
                </div>

                <div>
                  <Text size="sm">Note</Text>
                  {quotation.note ? <Text>{quotation.note}</Text> : <Text c="dimmed">Empty</Text>}
                </div>

                <div>
                  <Text size="sm">Terms and Conditions</Text>
                  <Text>{quotation.terms_and_conditions}</Text>
                </div>

                <div>
                  <Text size="sm">Client</Text>
                  <Text>{quotation.client.name}</Text>
                </div>

                <div>
                  <Text size="sm">Grand Total</Text>
                  <NumberFormatter
                    prefix="₱"
                    value={quotation.grand_total}
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                  />
                </div>

                <div>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm">Status</Text>
                      <QuotationStatusBadge status={quotation.quotation_status} />
                    </div>
                  </Group>
                </div>

                {/* TODO: create created_by component */}
                <div>
                  <Text size="sm">Created By</Text>
                  <Text>
                    {quotation.created_by_user.first_name +
                      ' ' +
                      quotation.created_by_user.last_name}
                  </Text>
                </div>

                {/* TODO: create created_by component */}
                <div>
                  <Text size="sm">Approved By</Text>
                  {quotation.approved_by_user ? (
                    <Text>
                      {quotation.approved_by_user.first_name +
                        ' ' +
                        quotation.approved_by_user.last_name}
                    </Text>
                  ) : (
                    <Text c="dimmed">Not yet approved</Text>
                  )}
                </div>

                {/* TODO: create is_active component */}
                <div>
                  <Text size="sm">Is Active</Text>
                  <Text>{quotation.is_active.toString()}</Text>
                </div>

                <div>
                  <Text size="sm">Created At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(quotation.created_at)}</Text>
                </div>

                <div>
                  <Text size="sm">Updated At</Text>
                  <Text>{formatDateTimeToMonthDateYearTime(quotation.updated_at)}</Text>
                </div>

                <Divider />

                <div>
                  <Stack>
                    <Text size="lg" fw={700}>
                      Products
                    </Text>

                    {quotation.quotation_product.map((qp) => (
                      <Paper withBorder p={30} key={qp.id} radius="sm">
                        <Stack>
                          <div>
                            <Text size="xs">Name</Text>
                            <Text>{qp.entry_name}</Text>
                          </div>

                          <div className="text-sm">
                            <Text size="xs">Description</Text>
                            <DescriptionRender content={qp.entry_description} />
                          </div>

                          <div className="text-sm">
                            <Text size="xs">Price</Text>
                            <NumberFormatter
                              prefix="₱"
                              value={qp.entry_price}
                              thousandSeparator=","
                              decimalSeparator="."
                              decimalScale={2}
                            />
                          </div>

                          <div>
                            <Text size="xs">Markup</Text>
                            <NumberFormatter
                              suffix="%"
                              value={qp.markup}
                              thousandSeparator=","
                              decimalSeparator="."
                              decimalScale={2}
                            />
                          </div>

                          <div>
                            <Text size="xs">VAT Excluded Price</Text>
                            <NumberFormatter
                              prefix="₱"
                              value={qp.vat_ex}
                              thousandSeparator=","
                              decimalSeparator="."
                              decimalScale={2}
                            />
                          </div>

                          <div>
                            <Text size="xs">VAT Included Price</Text>
                            <NumberFormatter
                              prefix="₱"
                              value={qp.vat_inc}
                              thousandSeparator=","
                              decimalSeparator="."
                              decimalScale={2}
                            />
                          </div>

                          <div>
                            <Text size="xs">Selected VAT Type</Text>
                            <Text size="xs">{qp.vat_type}</Text>
                          </div>

                          <div>
                            <Text size="xs">Duration</Text>
                            <NumberFormatter value={qp.duration} thousandSeparator="," />
                          </div>

                          <div>
                            <Text size="xs">Quantity</Text>
                            <NumberFormatter value={qp.quantity} thousandSeparator="," />
                          </div>

                          <div>
                            <Text size="xs">Total Amount</Text>
                            <NumberFormatter
                              prefix="₱"
                              value={qp.total_amount}
                              thousandSeparator=","
                              decimalSeparator="."
                              decimalScale={2}
                            />
                          </div>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </div>
              </Stack>
            )
          )}
        </Paper>
      </Container>

      {!isLoading && !userIsLoading && !isError && (
        <Container size="xs">
          <Paper withBorder p={30} mt={30} radius="md">
            <Stack>
              <Text size="lg" fw={700}>
                Actions
              </Text>

              {isAdmin && (
                <Button
                  size="lg"
                  color="green"
                  onClick={openModal}
                  disabled={!quotationStatusIsPending}
                  leftSection={<IconCheck />}
                >
                  Approve Quotation
                </Button>
              )}

              <Button
                size="lg"
                onClick={handleGenerate}
                leftSection={<IconFileTypeDocx />}
                disabled={quotationStatusIsPending || generateAndDownloadIsPending}
              >
                Generate Document
              </Button>

              <a className="hidden" ref={hiddenAnchorRef}></a>
            </Stack>
          </Paper>
        </Container>
      )}

      {!isLoading && !isError && <Comments quotationId={params.id} />}
    </div>
  )
}
