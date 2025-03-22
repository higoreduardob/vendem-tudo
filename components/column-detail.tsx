export const ColumnDetail = ({
  title,
  value,
}: {
  title: string
  value: string
}) => {
  return (
    <p className="text-sm leading-tight">
      <span className="font-semibold">{title}:</span> {value}
    </p>
  )
}
