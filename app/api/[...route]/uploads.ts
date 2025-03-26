import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'

import { UserRole } from '@prisma/client'

import { db } from '@/lib/db'
import { uploadImage } from '@/lib/cloudinary'

import { insertImageSchema } from '@/features/uploads/image/schema'

const app = new Hono().post(
  '/image',
  verifyAuth(),
  zValidator('query', z.object({ folder: z.string().optional() })),
  zValidator('form', insertImageSchema),
  async (c) => {
    const auth = c.get('authUser')
    const { folder } = c.req.valid('query')

    if (!folder) {
      return c.json({ error: 'Falha para salvar a imagem' }, 400)
    }

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const user = await db.user.findUnique({ where: { id: auth.token.sub } })
    if (!user) return c.json({ error: 'Usuário não autorizado' }, 401)

    if (
      ![
        UserRole.OWNER as string,
        UserRole.MANAGER as string,
        UserRole.EMPLOYEE as string,
      ].includes(user.role)
    ) {
      return c.json({ error: 'Usuário sem autorização' }, 400)
    }

    const formData = await c.req.formData()
    const image = formData.get('image') as File | null

    if (!image) {
      return c.json({ error: 'Nenhuma imagem enviada' }, 400)
    }

    // console.log('Arquivo recebido:', image.name, image.type, image.size)
    const result = await uploadImage(image, folder)
    return c.json({ url: result.url }, 200)
  }
)

export default app
