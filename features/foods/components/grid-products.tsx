import {
  CardProduct,
  ResponseType,
} from '@/features/foods/components/card-product'
import { Title } from '@/app/loja/_components/title'

export function GridProducts({
  title,
  products,
  children,
}: {
  title: string
  products: ResponseType[]
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Title title={title} />
        {children}
      </div>
      {!!products.length ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {products.map((product, index) => (
            <CardProduct key={index} {...product} />
          ))}
        </div>
      ) : (
        <span className="h-full w-full flex items-center justify-center text-base text-muted-foreground">
          Nenhum produto encontrado
        </span>
      )}
    </div>
  )
}
