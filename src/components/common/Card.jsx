export default function Card({ hover = true, padding, className = '', children, ...props }) {
  const classes = ['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ')

  return (
    <div className={classes} style={padding ? { padding } : undefined} {...props}>
      {children}
    </div>
  )
}
