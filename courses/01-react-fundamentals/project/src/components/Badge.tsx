export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  variant?: string
}

export default function Badge({ children, variant, ...props }: BadgeProps) {
  return (
    <span data-variant={variant} {...props}>
      {children}
    </span>
  )
}
