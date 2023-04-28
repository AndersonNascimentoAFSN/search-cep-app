'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { z } from "zod";

function convertToNumber(price: string) {
  return Number(price.replace(',', '.').trim())
}

const schemaForm = z.object({
  product: z.object({
    price: z.string().min(1, 'Por favor, informe um número válido'),
  })
}).transform((field) => ({
  product: {
    price: convertToNumber(field.product.price),
  }
}))

export default function ZodTransform() {
  const { handleSubmit, register, formState: { errors }, watch, setValue, control } = useForm<{ product: { price: string } }>({
    criteriaMode: 'all',
    mode: 'all',
    resolver: zodResolver(schemaForm),
    // values: { product: { price: 'R$ ' } },
    defaultValues: {
      product: {
        price: '',
      }
    }
  })

  function handleFormSubmit(data: any) {
    console.log(data)
  }

  const simbolType = (value: string, simbol: 'dollar' | 'percentagem') => {
    const simbolTypes = {
      dollar: `R$ ${value}`,
      percentagem: `${value}%`,
    }

    return simbolTypes[simbol]
  }

  const removeSimbolType = (value: string, simbol: 'dollar' | 'percentagem') => {
    const simbolTypes = {
      dollar: value.replace('R$', '').trim(),
      percentagem: value.replace('%', '').trim(),
    }

    return simbolTypes[simbol]
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-4'>

        <Controller
          name='product.price'
          control={control}
          render={({ field: { onChange, value } }) => (
            <input
              type="text"
              placeholder="Digite um número"
              // value={`R$ ${value}`}
              value={simbolType(value, 'percentagem')}
              // onChange={(event) => onChange(event.target.value.replaceAll('R$', '').trim())}
              onChange={(event) => onChange(removeSimbolType(event.target.value, 'percentagem'))}
              className='py-2 px-4 border-2 border-gray-100'
            />
          )}
        />
        {/* <input
          type="text"
          placeholder="Digite um número"
          {...register('product.price')}
          className='py-2 px-4 border-2 border-gray-100'
        />
        {errors.product?.price?.message && (
          <span className='text-red-600 ml-4'>{errors.product?.price?.message}</span>
        )} */}

        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-md'
        >
          Enviar
        </button>
      </form>
    </>
  )
}
