import * as React from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { Eye, EyeOff, Upload, X, ImageIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { maxImageSize } from '@/constants'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const InputPassword = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={className}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-9 w-9"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  )
})
InputPassword.displayName = 'InputPassword'

interface InputImageProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  value?: File | string | null
  onChange?: (value: File | string | null) => void
  maxSize?: number
  className?: string
  dropzoneClassName?: string
  previewClassName?: string
  disabled?: boolean
}

export const InputImage = React.forwardRef<HTMLDivElement, InputImageProps>(
  (
    {
      value,
      onChange,
      maxSize = maxImageSize,
      className,
      dropzoneClassName,
      previewClassName,
      accept = 'image/*',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const acceptProp = React.useMemo(() => {
      if (!accept) return undefined

      if (accept === 'image/*') {
        return {
          'image/jpeg': [],
          'image/png': [],
          'image/gif': [],
          'image/webp': [],
          'image/svg+xml': [],
          'image/bmp': [],
        }
      }

      if (accept.includes(',')) {
        return accept.split(',').reduce((acc, type) => {
          const trimmedType = type.trim()
          acc[trimmedType] = []
          return acc
        }, {} as Record<string, string[]>)
      }

      return { [accept]: [] }
    }, [accept])

    React.useEffect(() => {
      if (!value) {
        setPreview(null)
        return
      }

      if (typeof value === 'string') {
        setPreview(value)
      } else if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
      }
    }, [value])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0]
          onChange?.(file)
        }
      },
      [onChange, maxSize]
    )

    const { getRootProps, isDragActive } = useDropzone({
      onDrop,
      accept: acceptProp,
      maxSize,
      disabled,
      maxFiles: 1,
      noClick: true,
    })

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(null)
      setPreview(null)
    }

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        onChange?.(file)
      }
    }

    return (
      <div className={cn('space-y-2', className)} ref={ref}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        <div
          {...getRootProps()}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input p-[21px] transition-colors hover:bg-muted/50',
            isDragActive && 'border-primary bg-muted/50',
            disabled && 'cursor-not-allowed opacity-60',
            dropzoneClassName
          )}
        >
          {preview ? (
            <div className="relative w-full">
              <div
                className={cn(
                  'relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-md',
                  previewClassName
                )}
              >
                <Image
                  src={preview || '/placeholder.svg'}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  fill
                />
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-0 top-0 h-6 w-6 rounded-full"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover imagem</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {isDragActive ? (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Arraste aqui sua imagem
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Arraste e solte a imagem aqui, ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {accept === 'image/*'
                        ? 'JPG, PNG, GIF de até '
                        : 'Arquivo de até '}
                      {(maxSize / (1024 * 1024)).toFixed(1)}MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={disabled}
                    onClick={handleClick}
                    className="mt-2"
                  >
                    Selecionar imagem
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)

InputImage.displayName = 'InputImage'
