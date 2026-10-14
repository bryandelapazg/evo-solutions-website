// Centralized EVO+ company/contact configuration.
// Single source of truth — do not repeat these values elsewhere.
// Leave a field empty if it is not yet verified; never invent contact details.
export const company = {
  name: "EVO Solutions+",
  shortName: "EVO+",
  tagline: "Technology • Network • Infrastructure",

  phoneDisplay: "(512) 966-7004",
  phoneHref: "tel:+15129667004",

  email: "info@evosolutionsjv.com",
  emailHref: "mailto:info@evosolutionsjv.com",

  instagramHandle: "@evosolutionsjv",
  instagramUrl: "https://www.instagram.com/evosolutionsjv/",

  // Not yet configured — do not invent a WhatsApp number/URL.
  whatsappUrl: "",

  domain: "evosolutionsjv.com",
  location: "Austin, TX",
} as const

export type Company = typeof company

export const contactHrefs = {
  phone: company.phoneHref,
  email: company.emailHref,
  whatsapp: company.whatsappUrl,
  instagram: company.instagramUrl,
} as const
