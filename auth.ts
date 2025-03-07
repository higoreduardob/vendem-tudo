import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from '@/lib/db'

import authConfig from '@/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/entrar',
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await db.user.findUnique({ where: { id: user.id! } })

      if (!existingUser || !existingUser.emailVerified) return false

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique(
          {
            where: { userId: existingUser.id },
          }
        )
        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }

      if (session.user) {
        session.user.name = token.name
        session.user.whatsApp = token.whatsApp
        session.user.cpfCnpj = token.cpfCnpj
        session.user.rgIe = token.rgIe
        session.user.address = token.address
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
        session.user.selectedStore = token.selectedStore
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
        include: {
          address: true,
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      })

      if (!existingUser) return token

      token.name = existingUser.name
      token.whatsApp = existingUser.whatsApp
      token.cpfCnpj = existingUser.cpfCnpj
      token.rgIe = existingUser.rgIe
      token.address = existingUser.address
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.selectedStore = existingUser.store

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
