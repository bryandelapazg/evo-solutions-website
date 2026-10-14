// Centralized EVO+ contact configuration.
// Re-exports raw values from company.ts to keep a single source of truth.
// Leave values empty until verified — never place placeholder/fake links.
import { company } from "./company"

export const CONTACT = {
  company: company.name,
  phone: company.phoneHref.replace("tel:", ""),
  email: company.email,
  whatsapp: company.whatsappUrl,
  instagram: company.instagramUrl,
  domain: company.domain,
} as const

export type ContactConfig = typeof CONTACT
