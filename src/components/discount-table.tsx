'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DiscountTableProps = {
  quantity: number
}

export function DiscountTable({ quantity }: DiscountTableProps) {
  const discountOptions = [
    {
      quantity: 2,
      name: 'Jornada de Abertura',
      price: 'R$ 112,71',
      discount: '6%',
    },
    {
      quantity: 3,
      name: 'Tríade Vital',
      price: 'R$ 106,71',
      discount: '11%',
    },
    {
      quantity: 4,
      name: 'Consciência Plena',
      price: 'R$ 103,11',
      discount: '14%',
    },
    {
      quantity: 6,
      name: 'Jornada de Cura Integral',
      price: 'R$ 98,32',
      discount: '18%',
    },
  ]

  return (
    <div className="my-4">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center lg:text-base text-stone-400">
              Quantidade
            </TableHead>
            <TableHead className="text-center lg:text-base text-stone-400">
              Nome do Desconto
            </TableHead>
            <TableHead className="text-center lg:text-base text-stone-400">
              Preço Unitário
            </TableHead>
            <TableHead className="text-center lg:text-base text-stone-400">
              Desconto
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-brain lg:text-xl ">
          {discountOptions.map(option => {
            const isActive = quantity === option.quantity
            return (
              <TableRow
                key={option.quantity}
                className={
                  isActive
                    ? 'bg-brain-span/20 text-brain-span border-brain-span'
                    : ''
                }
              >
                <TableCell>
                  {option.quantity}{' '}
                  <span className="hidden md:inline-block">unid.</span>
                </TableCell>
                <TableCell>{option.name}</TableCell>
                <TableCell>{option.price}</TableCell>
                <TableCell>{option.discount}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
