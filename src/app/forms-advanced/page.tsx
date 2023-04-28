'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useId, useState } from "react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'

/* 
* To-do
* - [ ] Validação / transformação
* - [ ] Field Arrays
* - [ ] Upload de arquivos
* - [ ] Composition Pattern
*/

const createUserFormSchema = z.object({
  user: z.object({
    name: z.string().nonempty('O nome é obrigatório'),
    email: z.string().nonempty('O e-mail é obrigatório').email('E-mail inválido').refine((email) => {
      return email.endsWith('@meta.com.br')
    }, 'O email precisa ser do domínio @meta.com.br'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
  })
}).transform((field) => ({
  user: {
    name: field.user.name.trim().split(' ').map((word) => {
      return `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`
    }).join(' '),
    email: field.user.email.trim().toLowerCase(),
    password: field.user.password.trim()
  }
}))

type UserFormData = z.infer<typeof createUserFormSchema>

export default function FormsAdvanced() {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [output, setOutput] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    criteriaMode: 'all',
    mode: 'onSubmit',
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      user: {
        name: '',
        email: '',
        password: ''
      }
    }
  })

  const createUser = (data: any) => {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-20 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={nameId}>Nome</label>
          <input
            type="text"
            id={nameId}
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            autoComplete="off"
            {...register('user.name')}
          />

          {errors.user?.name?.message && (
            <span>{errors.user?.name?.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={emailId}>E-mail</label>
          <input
            type="email"
            id={emailId}
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            autoComplete="off"
            {...register('user.email')}
          />

          {errors.user?.email?.message && (
            <span>{errors.user?.email?.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={passwordId}>Senha</label>
          <input
            type="password"
            id={passwordId}
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            autoComplete="off"
            {...register('user.password')}
          />

          {errors.user?.password?.message && (
            <span>{errors.user?.password?.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>

      <pre>
        <code >
          {output}
        </code>
      </pre>
    </main>
  )
}
