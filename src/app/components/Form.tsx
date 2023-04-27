'use client'

import { useCep } from '../cep/useCep';

export function Form() {
  const {errors, handleFormSubmit, handleSubmit, register} = useCep()

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-4'>
      <input
        type="text"
        placeholder="CEP"
        {...register('address.zipCode')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.zipCode?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.zipCode?.message}</span>
      )}

      <input
        type="text"
        placeholder="Rua"
        {...register('address.street')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.street?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.street?.message}</span>
      )}

      <input
        type="text"
        placeholder="Número"
        {...register('address.number')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.number?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.number?.message}</span>
      )}

      <input
        type="text"
        placeholder="Complemento"
        {...register('address.complement')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.complement?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.complement?.message}</span>
      )}

      <input
        type="text"
        placeholder="Bairro"
        {...register('address.district')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.district?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.district?.message}</span>
      )}

      <input
        type="text"
        placeholder="Cidade"
        {...register('address.city')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.city?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.city?.message}</span>
      )}

      <input
        type="text"
        placeholder="Estado"
        {...register('address.state')}
        className='py-2 px-4 border-2 border-gray-100'
      />
      {errors.address?.state?.message && (
        <span className='text-red-600 ml-4'>{errors.address?.state?.message}</span>
      )}

      <button
        type='submit'
        className='bg-blue-500 text-white py-2 px-4 rounded-md'
      >
        Enviar
      </button>
    </form>
  )
}
