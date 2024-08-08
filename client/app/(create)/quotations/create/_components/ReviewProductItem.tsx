import { Flex, Input, NumberInput, Radio, TextInput } from '@mantine/core'
import { QpProduct } from './Review'
import Description from './Description'

export default function ReviewProductItem({ qp }: { qp: QpProduct }) {
  return (
    <Flex gap="sm" mb={24}>
      <TextInput w={200} label="Name" value={qp.entry_name} readOnly />

      <Input.Wrapper w={300} label="Description" className="text-sm">
        <Description content={qp.entry_description} />
      </Input.Wrapper>

      <NumberInput
        label="Price"
        prefix="₱"
        value={qp.entry_price}
        readOnly
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale={true}
        decimalSeparator="."
        thousandSeparator=","
      />

      <NumberInput
        label="Markup"
        suffix="%"
        value={qp.markup}
        readOnly
        allowNegative={false}
        decimalScale={2}
        decimalSeparator="."
        thousandSeparator=","
      />

      <NumberInput
        w={200}
        label="VAT Excluded Price"
        prefix="₱"
        readOnly
        value={qp.vat_ex}
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale={true}
        decimalSeparator="."
        thousandSeparator=","
      />

      <NumberInput
        w={200}
        label="VAT Included Price"
        prefix="₱"
        readOnly
        value={qp.vat_inc}
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale={true}
        decimalSeparator="."
        thousandSeparator=","
      />

      <Radio.Group label="VAT Type" value={qp.vat_type} readOnly>
        <Radio value="vat_ex" label="Excluded" />
        <Radio value="vat_inc" label="Included" />
      </Radio.Group>

      <NumberInput
        label="Duration (Months)"
        allowNegative={false}
        allowDecimal={false}
        value={qp.duration}
        readOnly
      />

      <NumberInput
        label="Quantity"
        allowNegative={false}
        allowDecimal={false}
        value={qp.quantity}
        readOnly
      />

      <NumberInput
        w={200}
        label="Total Amount"
        prefix="₱"
        readOnly
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale={true}
        decimalSeparator="."
        thousandSeparator=","
        value={qp.total_amount}
      />
    </Flex>
  )
}
