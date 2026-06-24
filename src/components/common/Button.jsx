import { forwardRef } from 'react'

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  danger: '',
}

const sizeStyles = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

const dangerStyle = {
  background: 'var(--danger)',
  color: 'var(--text-light)',
  borderColor: 'var(--danger)',
}

const Button = forwardRef(({ variant = 'primary', size = 'md', loading, icon, children, block, className = '', ...props }, ref) => {
  const classes = ['btn', variantStyles[variant], sizeStyles[size], block ? 'btn-block' : '', className].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      className={classes}
      style={variant === 'danger' ? dangerStyle : undefined}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="spinner spinner-sm" />}
      {!loading && icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
