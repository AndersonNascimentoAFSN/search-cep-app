'use client'

import { useId, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from "@/lib/supabase"

/* 
* To-do
* - [ ] Validação / transformação
* - [ ] Field Arrays
* - [ ] Upload de arquivos
* - [ ] Composition Pattern
*/

const createUserFormSchema = z.object({
  user: z.object({
    // avatar: z.instanceof(FileList).refine(file =>
    //   file.item(0)!.size <= 5 * 1024 * 1024, 'O arquivo deve ter no máximo 5MB'),
    avatar: z.any(),
    name: z.string().nonempty('O nome é obrigatório'),
    email: z.string().nonempty('O e-mail é obrigatório').email('E-mail inválido').refine((email) => {
      return email.endsWith('@meta.com.br')
    }, 'O email precisa ser do domínio @meta.com.br'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  }),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100)
  }))
    .min(2, 'Insira pelo menos 2 tecnologias')
    .refine(techs => {
      const techsRepeated = new Set();
      const techsDuplicates = techs.filter((tech) => {
        if (techsRepeated.has(tech.title)) return true
        techsRepeated.add(tech.title)
        return false
      })
      return techsDuplicates.length > 0 ? false : true
    }, 'Não é permitido tecnologias duplicadas')
}).transform((field) => ({
  user: {
    avatar: field.user.avatar.item(0)!,
    name: field.user.name.trim().split(' ').map((word) => {
      return `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`
    }).join(' '),
    email: field.user.email.trim().toLowerCase(),
    password: field.user.password.trim()
  },
  techs: field.techs
}))

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export default function FormsAdvanced() {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [output, setOutput] = useState('')

  const { register, handleSubmit, formState: { errors }, control } = useForm<CreateUserFormData>({
    criteriaMode: 'all',
    mode: 'onSubmit',
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      user: {
        name: '',
        email: '',
        password: ''
      },
      techs: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  const createUser = async (data: CreateUserFormData) => {
    await supabase.storage.from('forms-react')
      .upload(data.user.avatar.name, data.user.avatar)

    setOutput(JSON.stringify(data, null, 2))
  }

  const addNewTech = () => {
    append({ title: '', knowledge: 0 })
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-20 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            accept="image/*"
            id="avatar"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            autoComplete="off"
            {...register('user.avatar')}
          />

          {/* {errors.user?.name?.message && (
            <span className="text-red-500 text-sm">{errors.user?.avatar?.message}</span>
          )} */}
        </div>

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
            <span className="text-red-500 text-sm">{errors.user?.name?.message}</span>
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
            <span className="text-red-500 text-sm">{errors.user?.email?.message}</span>
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
            <span className="text-red-500 text-sm">{errors.user?.password?.message}</span>
          )}
        </div>


        <div className="flex flex-col gap-1">
          <label
            htmlFor=""
            className="flex items-center justify-between"
          >
            Tecnologias

            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-2"
            >
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  className="border border-zinc-200 shadow-sm rounded h-10 px-3 w-full"
                  autoComplete="off"
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title?.message && (
                  <span className="text-red-500 text-sm">{errors.techs?.[index]?.title?.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  className="border border-zinc-200 shadow-sm rounded h-10 px-3 w-16"
                  autoComplete="off"
                  {...register(`techs.${index}.knowledge`)}
                />
                {errors.techs?.[index]?.knowledge?.message && (
                  <span className="text-red-500 text-sm">{errors.techs?.[index]?.knowledge?.message}</span>
                )}
              </div>
            </div>
          ))}

          {errors.techs?.message && (
            <span className="text-red-500 text-sm">{errors.techs?.message}</span>
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
