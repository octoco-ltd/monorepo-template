import {z} from 'zod'

// When writing to the DB we define an Insert Model (IM) to ensure that the correct data is written to the DB
export const UserIM = z.object({
    id: z.string(),
    name: z.string(),
    surname: z.string()
})

export type UserIM = z.infer<typeof UserIM>