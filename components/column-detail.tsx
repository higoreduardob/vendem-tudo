export const ColumnDetail = ({
  title,
  value,
}: {
  title: string
  value: string
}) => {
  return (
    <p className="text-sm leading-tight dark:text-white">
      <span className="font-semibold">{title}:</span> {value}
    </p>
  )
}
