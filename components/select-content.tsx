import { CircleX, LucideProps } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  title: string
  description: string
  values: string[]
  options: FilterOptionsProps
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  emptyMessage: string
  onChange: (values: string[]) => void
}

export const SelectContent = ({
  title,
  description,
  values,
  options,
  icon: Icon,
  emptyMessage,
  onChange,
}: Props) => {
  const removeValue = (index: number) =>
    onChange(values.filter((_, i) => i !== index))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-[0.8rem] text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {values && values.length > 0 ? (
          <div className="flex items-center flex-wrap gap-2.5">
            {values.map((value, index) => (
              <div
                key={index}
                className="group flex items-center gap-1 relative rounded-md text-sm font-medium transition-colors focus-visible:outline-none border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                <div className="group-hover:flex hidden transition-all duration-500 items-center gap-1 absolute top-0 right-0 bg-white/50 p-1 rounded-md">
                  <span
                    title="Remover"
                    className="cursor-pointer text-black"
                    onClick={() => removeValue(index)}
                  >
                    <CircleX size={16} />
                  </span>
                </div>
                <Icon size={16} />
                <span className="text-xs text-muted-foreground">
                  {options.find((option) => option.value === value)?.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">{emptyMessage}</span>
        )}
      </CardContent>
    </Card>
  )
}
