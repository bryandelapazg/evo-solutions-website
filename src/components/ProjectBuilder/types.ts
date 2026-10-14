export type ProjectStep = 1 | 2 | 3 | 4 | 5 | 6

export type ProjectSize = "small" | "medium" | "large" | "enterprise"

export type ProjectDraft = {
  projectTypes: string[]
  services: string[]
  size: ProjectSize | ""
  timeline: string
  city: string
  state: string
  zip: string
  name: string
  company: string
  email: string
  phone: string
  notes: string
}

export type ProjectDestinations = {
  whatsapp: string
  email: string
  phone: string
}

export type Option = {
  value: string
  label: string
  detail?: string
}

export type ProjectSubmissionHandler = (project: ProjectDraft, projectId: string) => void
