type SystemStatusProps = {
  children: string
  className?: string
}

function SystemStatus({ children, className = "" }: SystemStatusProps) {
  return <span className={`systemStatus ${className}`.trim()}><span aria-hidden="true" />{children}</span>
}

export default SystemStatus
