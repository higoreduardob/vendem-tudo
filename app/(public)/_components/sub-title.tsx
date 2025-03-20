export const SubTitle = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
