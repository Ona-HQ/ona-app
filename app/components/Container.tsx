import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx('mx-auto max-w-full px-4 sm:px-12 lg:px-12', className)}
      {...props}
    />
  )
}
