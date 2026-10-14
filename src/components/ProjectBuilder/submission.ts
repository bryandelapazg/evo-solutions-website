import type { ProjectDraft } from "./types"
import { CONTACT } from "../../config/contact"

export const PROJECT_DESTINATIONS = {
  whatsapp: CONTACT.whatsapp,
  email: CONTACT.email,
  phone: CONTACT.phone,
} as const

const sizeLabels: Record<string, string> = {
  small: "Small — 1–10 connections",
  medium: "Medium — 11–30 connections",
  large: "Large — 31–75 connections",
  enterprise: "Enterprise / custom — 75+ connections",
}

const locationFor = (project: ProjectDraft) => [project.city, project.state].filter(Boolean).join(", ")

export const generateProjectId = (date = new Date()) => {
  const datePart = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
  const randomPart = Array.from({ length: 4 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("")
  return `EVO-${datePart}-${randomPart}`
}

export const formatProjectSummary = (project: ProjectDraft, projectId: string) => [
  "EVO SOLUTIONS+",
  "PROJECT REQUEST",
  "",
  `PROJECT ID: ${projectId}`,
  `PROJECT TYPE: ${project.projectTypes.join(", ")}`,
  `SERVICES: ${project.services.join(", ")}`,
  `PROJECT SIZE: ${sizeLabels[project.size] || "Not selected"}`,
  `TIMELINE: ${project.timeline || "Not selected"}`,
  `LOCATION: ${locationFor(project)}${project.zip ? ` ${project.zip}` : ""}`,
  "",
  "CLIENT",
  `Name: ${project.name}`,
  `Company: ${project.company}`,
  `Email: ${project.email}`,
  `Phone: ${project.phone}`,
  "",
  "NOTES",
  project.notes || "None provided",
  "",
  "STATUS: NEW REQUEST",
].join("\n")

export const buildWhatsAppMessage = (project: ProjectDraft, projectId: string) => {
  return [
    "Hello EVO Solutions+,",
    "",
    "I would like to discuss a new project.",
    "",
    `Project ID: ${projectId}`,
    `Project Type: ${project.projectTypes.join(", ")}`,
    `Services: ${project.services.join(", ")}`,
    `Project Size: ${sizeLabels[project.size] || "Not selected"}`,
    `Timeline: ${project.timeline}`,
    `Location: ${locationFor(project)}${project.zip ? ` ${project.zip}` : ""}`,
    "",
    `Name: ${project.name}`,
    `Company: ${project.company}`,
    project.email ? `Email: ${project.email}` : "",
    project.phone ? `Phone: ${project.phone}` : "",
    "",
    "Additional Notes:",
    project.notes || "None provided",
    "",
    "Please contact me to discuss the project.",
  ].join("\n")
}

export const buildEmailSubject = (projectId: string) => `EVO+ Project Request — ${projectId}`

export const buildEmailBody = (project: ProjectDraft, projectId: string) => formatProjectSummary(project, projectId)
