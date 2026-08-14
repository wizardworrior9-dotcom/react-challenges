interface BadgeProps {
  children?: React.ReactNode
}

export default function Badge({ children }: BadgeProps) {
  return <span>{children}</span>
}
