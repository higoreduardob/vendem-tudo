import { allowedMimeTypes, maxImageSize } from '@/constants'
import { z } from 'zod'

export const insertImageSchema = z.object({
  image: z
    .instanceof(File, { message: 'Arquivo inválido' })
    .refine(
      (file) => file.size <= maxImageSize,
      'Imagem muito pesada (máx 512kB)'
    )
    .refine(
      (file) => allowedMimeTypes.includes(file.type),
      'Tipo de arquivo não suportado'
    ),
})
