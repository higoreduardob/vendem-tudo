// import Image from 'next/image'

// import { useOpenStore } from '@/hooks/use-store'
// import { useSearchFood } from '@/features/foods/hooks/use-filter-food'
// import { useGetStoreCategories } from '@/features/foods/categories/api/use-get-categories'

// import {
//   Carousel as CarouselComponent,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel'

// export function Carousel() {
//   const { store } = useOpenStore()
//   const { onChange, search } = useSearchFood()
//   const categoriesQuery = useGetStoreCategories(store?.id)
//   const categories = categoriesQuery.data || []

//   return (
//     <CarouselComponent className="w-full">
//       <CarouselContent>
//         {!!categories.length ? (
//           categories.map((category) => (
//             <CarouselItem
//               key={category.id}
//               className="basis-1/2 md:basis-1/3 lg:basis-1/4 cursor-pointer"
//               onClick={() => onChange(category.id, search)}
//             >
//               <div className="overflow-hidden rounded-lg">
//                 <div className="relative aspect-square overflow-hidden rounded-t-lg">
//                   <Image
//                     src={category.image || '/placeholder.svg'}
//                     alt={category.name}
//                     fill
//                     className="object-cover transition-transform hover:scale-105"
//                   />
//                 </div>
//                 <div className="bg-primary p-2 text-center font-medium text-primary-foreground">
//                   {category.name}
//                 </div>
//               </div>
//             </CarouselItem>
//           ))
//         ) : (
//           <span className="h-full w-full flex items-center justify-center text-base text-muted-foreground">
//             Nenhuma categoria encontrada
//           </span>
//         )}
//       </CarouselContent>
//       <CarouselPrevious className="left-2" />
//       <CarouselNext className="right-2" />
//     </CarouselComponent>
//   )
// }

export const Carousel = () => {
  return <div>Carousel</div>
}
