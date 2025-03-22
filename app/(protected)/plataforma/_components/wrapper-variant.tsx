import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  options?: React.JSX.Element
  children: React.ReactNode
}

export const WrapperVariant = ({ title, options, children }: Props) => {
  return (
    <Card className="space-y-2">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row items-start justify-between">
        <CardTitle className="font-normal text-base line-clamp-1">
          {title}
        </CardTitle>
        {options && options}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
