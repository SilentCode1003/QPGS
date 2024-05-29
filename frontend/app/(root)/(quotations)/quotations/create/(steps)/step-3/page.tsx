'use client'
import { LOCAL_STORAGE_KEY, useStepper } from '@/app/contexts/stepper'
import { api } from '@/app/lib/api'
import {
  Box,
  Button,
  Center,
  Container,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
  VisuallyHidden,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { readLocalStorageValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useState } from 'react'
import { z } from 'zod'

const step3Schema = z.object({
  client: z.object({
    id: z.number(),
    name: z.string().min(2),
    tel_no: z.string().optional(),
    contact_no: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(5),
  }),
})

export type Step3Values = z.infer<typeof step3Schema>

export default function Step3() {
  const { data: clients, isLoading, isError, error } = useGetClients()
  const clientSearchData = clients?.map((client) => client.name).concat('Create new')

  const mutation = useCreateClient()

  const [isNew, setIsNew] = useState(false)

  const { updateData, incrementActive } = useStepper()

  const storageValues = readLocalStorageValue<Step3Values | undefined>({ key: LOCAL_STORAGE_KEY })

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...storageValues,
    },
    validate: zodResolver(step3Schema),
  })

  // @ts-ignore
  const onSubmit = (values) => {
    updateData(values)
    incrementActive()
  }

  const onCompanyNameSelect = (value: string | null) => {
    if (value === 'Create new') {
      setIsNew(true)
      form.setFieldValue('client.id', -1)
      form.setFieldValue('client.name', '')
      form.setFieldValue('client.tel_no', '')
      form.setFieldValue('client.contact_no', '')
      form.setFieldValue('client.email', '')
      form.setFieldValue('client.address', '')
    } else {
      setIsNew(false)
      const client = clients?.find((client) => client.name === value)
      form.setFieldValue('client.id', client?.id)
      form.setFieldValue('client.name', client?.name)
      form.setFieldValue('client.tel_no', client?.tel_no)
      form.setFieldValue('client.contact_no', client?.contact_no)
      form.setFieldValue('client.email', client?.email)
      form.setFieldValue('client.address', client?.address)
    }
  }

  const onCreate = async () => {
    form.validate()

    if (!form.isValid()) {
      return
    }

    const { id, ...rest } = form.getValues().client!

    const res: AxiosResponse<CreateClientResponse> = await mutation.mutateAsync(rest)
    const { created_at, updated_at, ...others } = res.data.data

    updateData({ client: others })
    incrementActive()
  }

  return (
    <Container size="sm">
      <Center>
        <Title>Enter client information</Title>
      </Center>

      <Select
        label="Search client name"
        data={clientSearchData}
        searchable
        allowDeselect={false}
        onChange={onCompanyNameSelect}
      />

      <Box mt={50}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <VisuallyHidden>
              <NumberInput
                key={form.key('client.id')}
                {...form.getInputProps('client.id')}
                readOnly
              />
            </VisuallyHidden>

            <TextInput
              readOnly={!isNew}
              withAsterisk
              label="Client name"
              key={form.key('client.name')}
              {...form.getInputProps('client.name')}
            />

            <TextInput
              readOnly={!isNew}
              label="Telephone no."
              key={form.key('client.tel_no')}
              {...form.getInputProps('client.tel_no')}
            />

            <TextInput
              readOnly={!isNew}
              withAsterisk
              label="Contact no."
              key={form.key('client.contact_no')}
              {...form.getInputProps('client.contact_no')}
            />

            <TextInput
              readOnly={!isNew}
              withAsterisk
              label="Email"
              key={form.key('client.email')}
              {...form.getInputProps('client.email')}
            />

            <Textarea
              readOnly={!isNew}
              withAsterisk
              label="Address"
              key={form.key('client.address')}
              {...form.getInputProps('client.address')}
            />

            {!isNew && <Button type="submit">Next</Button>}
            {isNew && (
              <Button type="button" onClick={onCreate}>
                Create
              </Button>
            )}
          </Stack>
        </form>
      </Box>
    </Container>
  )
}

type Client = {
  id: number
  name: string
  tel_no: string | undefined
  contact_no: string
  email: string
  address: string
  created_at: string
  updated_at: string
}

type CreateClientResponse = {
  data: Client
}

type ClientsResponse = {
  data: Client[]
}

function useGetClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await api.get<ClientsResponse>('/clients')
      return res.data.data
    },
    staleTime: 0,
  })
}

function useCreateClient() {
  return useMutation({
    mutationFn: (newClient: {
      name: string
      contact_no: string
      email: string
      address: string
      tel_no?: string | undefined
    }) => {
      return api.post('/clients', newClient)
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Client successfully created',
        color: 'green',
      })
    },
    onError: (err) => {
      console.error(err)
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      })
    },
  })
}
