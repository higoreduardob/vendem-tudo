import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

interface UploadResult {
  url: string
  public_id: string
  width: number
  height: number
  format: string
}

export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: generateRandomFileName(),
        overwrite: false,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }
        if (!result) {
          return reject(new Error('Upload da imagem sem resultado'))
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        })
      }
    )

    uploadStream.end(buffer)
  })
}

interface DestroyResult {
  result: string
}

export async function destroyImage(publicId: string): Promise<DestroyResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error)
      }
      if (!result) {
        return reject(new Error('Remoção da imagem sem resultado'))
      }
      resolve({
        result: result.result,
      })
    })
  })
}

function generateRandomFileName(): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `img_${timestamp}_${randomString}`
}
