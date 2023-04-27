import { z } from "zod"
import { schemaForm } from "./schema"

export type FormProps = z.infer<typeof schemaForm>
export type AddressProps = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}