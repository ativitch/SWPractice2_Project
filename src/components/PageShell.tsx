type PageShellProps = {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export default function PageShell({
  children,
  className = '',
  containerClassName = 'max-w-[1440px]',
}: PageShellProps) {
  return (
    <main
      className={`min-h-[calc(100vh-80px)] px-4 py-10 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      <div className="flex w-full justify-center">
        <div className={`w-full ${containerClassName}`.trim()}>{children}</div>
      </div>
    </main>
  )
}