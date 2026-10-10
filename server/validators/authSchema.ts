import { z }from 'zod'

export const registerSchema = z.object({
    name: z.string().trim().min(1, "name required").max(60),
    email: z.string().trim().email("email required").transform((val) => val.toLowerCase()),
    password: z.string().trim().min(8, "password must be at least 8 characters").max(72)
})

export const loginSchema = z.object({
    email: z.string().trim().email("email required").transform((val) => val.toLowerCase()),
    password: z.string().min(8, "password required").max(72)
})
