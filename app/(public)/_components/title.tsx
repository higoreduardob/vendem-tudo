export const Title = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  )
}
