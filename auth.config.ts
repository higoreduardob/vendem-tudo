import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { db } from '@/lib/db'

import { signInSchema } from '@/features/auth/schema'

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials)

        if (!validatedFields.success) return null

        const { email, password } = validatedFields.data
        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (passwordsMatch) return user

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
