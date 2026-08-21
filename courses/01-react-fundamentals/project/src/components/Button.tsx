export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  id?: string
  variant?: string
}

export default function Button({ children, onClick, type, id, variant, ...props }: ButtonProps) {
  return (
    <button type={type} id={id} onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  )
}
