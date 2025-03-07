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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {products.map((product, index) => (
          <CardProduct key={index} {...product} />
        ))}
      </div>
    </div>
  )
}
