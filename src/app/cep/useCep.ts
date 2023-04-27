import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { schemaForm } from "./schema"
import { AddressProps, FormProps } from "./types"

export function useCep() {
  const { handleSubmit, register, formState: { errors }, watch, setValue } = useForm<FormProps>({
    criteriaMode: 'all',
    mode: 'all',
    resolver: zodResolver(schemaForm),
    defaultValues: {
      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
      }
    }
  })

  function handleFormSubmit(data: any) {
    console.log(data)
  }

  const handleSetDataForm = useCallback((data: AddressProps) => {
    setValue('address.street', data.logradouro)
    setValue('address.complement', data.complemento)
    setValue('address.district', data.bairro)
    setValue('address.city', data.localidade)
    setValue('address.state', data.uf)
  }, [setValue])

  const handleFetchAddress = useCallback(async (zipCode: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
    const data = await response.json()
    handleSetDataForm(data)
  }, [handleSetDataForm])

  const zipCode = watch('address.zipCode')

  const zipCodeMask = useCallback((zipCode: string) => {
    if (zipCode.length !== 8) return zipCode

    return `${zipCode.slice(0, 5)}-${zipCode.slice(5)}`
  }, [])

  useEffect(() => {
    setValue('address.zipCode', zipCodeMask(zipCode.trim().replaceAll('-', '')))

    if (zipCode.length !== 9) return
    handleFetchAddress(zipCode)

  }, [zipCode, handleFetchAddress, setValue, zipCodeMask])

  return { handleFormSubmit, handleSubmit, register, errors }
}