import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Wrapper = ({
  children,
  title,
  description,
  footerTitle,
  isFooter = true,
  footerDescription,
  footerLink,
}: {
  children: React.ReactNode
  title: string
  description: string
  isFooter?: boolean
  footerTitle?: string
  footerDescription?: string
  footerLink?: string
}) => {
  return (
    <Card className="drop-shadow-none">
      <CardHeader>
        <CardTitle className="text-center">
          <h2 className="text-2xl dark:text-white text-zinc-950 font-semibold">
            {title}
          </h2>
        </CardTitle>
        <CardDescription className="text-center">
          <p className="text-sm dark:text-gray-400 text-zinc-500">
            {description}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
      {isFooter && (
        <CardFooter className="pt-2">
          <div className="text-center text-sm w-full">
            {footerDescription}{' '}
            <Link
              href={footerLink || ''}
              className="underline underline-offset-4"
            >
              {footerTitle}
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
