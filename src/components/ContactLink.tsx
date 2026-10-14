import type { ReactNode } from "react"

type ContactLinkProps = {
  href?: string
  external?: boolean
  className?: string
  children: ReactNode
}

// Renders nothing when href is not configured — never a fake/dead link.
function ContactLink({ href, external, className, children }: ContactLinkProps) {
  if (!href) return null
  return (
    <a href={href} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  )
}

export default ContactLink
