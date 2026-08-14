interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  id?: string
}

export default function Button({ children, onClick, type, id }: ButtonProps) {
  return (
    <button type={type} id={id} onClick={onClick}>
      {children}
    </button>
  )
}
