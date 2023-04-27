import { z } from "zod";

export const schemaForm = z.object({
  address: z.object({
    zipCode: z.string().min(9, 'Por favor, informe um CEP válido'),
    street: z.string().min(1, 'Por favor, informe uma rua válida'),
    number: z.string().min(1, 'Por favor, informe um número válido'),
    complement: z.string(),
    district: z.string().min(1, 'Por favor, informe um bairro válido'),
    city: z.string().min(1, 'Por favor, informe uma cidade válida'),
    state: z.string().min(1, 'Por favor, informe um estado válido'),
  })
}).transform((field) => ({
  address: {
    zipCode: field.address.zipCode,
    street: field.address.street,
    number: field.address.number,
    complement: field.address.complement,
    district: field.address.district,
    city: field.address.city,
    state: field.address.state,
  }
}))