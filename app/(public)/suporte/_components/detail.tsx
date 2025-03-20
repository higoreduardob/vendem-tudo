import { CheckCircle2 } from 'lucide-react'

export const Detail = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-purple-600/20 p-2 rounded-full">
        <CheckCircle2 className="h-5 w-5 text-purple-500" />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
