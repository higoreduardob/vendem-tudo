export const HeaderMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      <div className="space-y-3">
        <div className="flex gap-1">
          <h3 className="text-base font-medium dark:text-white text-zinc-950">
            Olá, Name 👋
          </h3>
        </div>
        <p className="text-sm dark:text-gray-400 text-gray-700">{children}</p>
      </div>
    </div>
  )
}
