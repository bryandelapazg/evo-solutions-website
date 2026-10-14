import { useEffect, useState } from "react"
import MagneticButton from "../MagneticButton"
import SystemStatus from "../SystemStatus"
import ProjectOption from "./ProjectOption"
import ProjectProgress from "./ProjectProgress"
import ProjectSummary from "./ProjectSummary"
import { buildEmailBody, buildEmailSubject, buildWhatsAppMessage, generateProjectId, PROJECT_DESTINATIONS, formatProjectSummary } from "./submission"
import type { Option, ProjectDraft, ProjectStep, ProjectSubmissionHandler } from "./types"
import "./ProjectBuilder.css"

const projectTypes: Option[] = [
  { value: "New Office", label: "NEW OFFICE" },
  { value: "Office Expansion", label: "OFFICE EXPANSION" },
  { value: "Office Relocation", label: "OFFICE RELOCATION" },
  { value: "Network Upgrade", label: "NETWORK UPGRADE" },
  { value: "Structured Cabling", label: "STRUCTURED CABLING" },
  { value: "Fiber Optics", label: "FIBER OPTICS" },
  { value: "Wi-Fi Deployment", label: "WI-FI DEPLOYMENT" },
  { value: "Security Cameras", label: "SECURITY CAMERAS" },
  { value: "Audio / Video", label: "AUDIO / VIDEO" },
  { value: "Other", label: "OTHER" },
]

const services: Option[] = [
  { value: "Network Cabling", label: "NETWORK CABLING" },
  { value: "IDF / MDF", label: "IDF / MDF" },
  { value: "Fiber", label: "FIBER" },
  { value: "Wi-Fi", label: "WI-FI" },
  { value: "CCTV / Security", label: "CCTV / SECURITY" },
  { value: "Audio / Video", label: "AUDIO / VIDEO" },
  { value: "Voice / Phone", label: "VOICE / PHONE" },
  { value: "IT Infrastructure", label: "IT INFRASTRUCTURE" },
  { value: "Low Voltage", label: "LOW VOLTAGE" },
]

const sizes: Option[] = [
  { value: "small", label: "SMALL", detail: "1–10 connections" },
  { value: "medium", label: "MEDIUM", detail: "11–30 connections" },
  { value: "large", label: "LARGE", detail: "31–75 connections" },
  { value: "enterprise", label: "ENTERPRISE / CUSTOM", detail: "75+ connections" },
]

const timelines: Option[] = [
  { value: "As soon as possible", label: "AS SOON AS POSSIBLE" },
  { value: "1–2 Weeks", label: "1–2 WEEKS" },
  { value: "This month", label: "THIS MONTH" },
  { value: "1–3 Months", label: "1–3 MONTHS" },
  { value: "Planning / Future Project", label: "PLANNING / FUTURE PROJECT" },
]

const initialProject: ProjectDraft = {
  projectTypes: [],
  services: [],
  size: "",
  timeline: "",
  city: "",
  state: "",
  zip: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  notes: "",
}

const DRAFT_STORAGE_KEY = "evo-solutions-project-draft"
const DRAFT_MAX_AGE = 1000 * 60 * 60 * 24

type StoredDraft = { savedAt: number; step: ProjectStep; project: ProjectDraft; projectId: string }

const readStoredDraft = (): StoredDraft | null => {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!stored) return null
    const draft = JSON.parse(stored) as StoredDraft
    if (Date.now() - draft.savedAt > DRAFT_MAX_AGE) {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      return null
    }
    return draft
  } catch {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    return null
  }
}

type ProjectBuilderProps = {
  onSubmit?: ProjectSubmissionHandler
}

function ProjectBuilder({ onSubmit }: ProjectBuilderProps) {
  const [step, setStep] = useState<ProjectStep>(() => readStoredDraft()?.step ?? 1)
  const [project, setProject] = useState<ProjectDraft>(() => ({ ...initialProject, ...readStoredDraft()?.project }))
  const [projectId, setProjectId] = useState(() => readStoredDraft()?.projectId ?? "")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (submitted) return
    const hasDraft = Object.values(project).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value))
    if (!hasDraft) return
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), step, project, projectId }))
  }, [project, projectId, step, submitted])

  const updateProject = <Key extends keyof ProjectDraft>(key: Key, value: ProjectDraft[Key]) => {
    setProject((current) => ({ ...current, [key]: value }))
    setError("")
    setCopied(false)
  }

  const toggleOption = (key: "projectTypes" | "services", value: string) => {
    const current = project[key]
    updateProject(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  const validateStep = () => {
    if (step === 1 && !project.projectTypes.length) return "Select at least one project type to continue."
    if (step === 2 && !project.services.length) return "Select at least one infrastructure service to continue."
    if (step === 3 && !project.size) return "Select an approximate project size to continue."
    if (step === 4 && !project.timeline) return "Select a timeline to continue."
    if (step === 5 && (!project.city.trim() || !project.state.trim())) return "City and state are required to continue."
    if (step === 6 && (!project.name.trim() || (!project.email.trim() && !project.phone.trim()))) {
      return "Name and either email or phone are required to submit."
    }
    return ""
  }

  const goNext = () => {
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }
    setError("")
    if (step < 6) setStep((current) => (current + 1) as ProjectStep)
  }

  const handleAssessment = () => {
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }
    const nextProjectId = projectId || generateProjectId()
    setProjectId(nextProjectId)
    // Integration point for email, CRM, Google Sheets, or a future API.
    onSubmit?.(project, nextProjectId)
    setSubmitted(true)
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  }

  const openWhatsApp = () => {
    if (!PROJECT_DESTINATIONS.whatsapp || !projectId) return
    window.open(`${PROJECT_DESTINATIONS.whatsapp}?text=${encodeURIComponent(buildWhatsAppMessage(project, projectId))}`, "_blank", "noopener,noreferrer")
  }

  const copySummary = async () => {
    if (!projectId) return
    try {
      await navigator.clipboard.writeText(formatProjectSummary(project, projectId))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const startNewProject = () => {
    setStep(1)
    setProject(initialProject)
    setProjectId("")
    setError("")
    setSubmitted(false)
    setCopied(false)
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  }

  return (
    <section className="projectBuilder" aria-labelledby="project-builder-title">
      <div className="projectBuilderIntro" data-reveal>
        <SystemStatus>WHAT DO YOU NEED?</SystemStatus>
        <h2 id="project-builder-title">What does your business need?</h2>
        <p>Build a quick project overview and send it directly to EVO+.</p>
      </div>

      {submitted && projectId ? (
        <div className="projectSuccess" aria-live="polite">
          <div className="projectSuccessIntro">
            <SystemStatus>PROJECT REQUEST READY</SystemStatus>
            <h3>Your project overview is ready.</h3>
            <p>Contact EVO Solutions+ using one of the options below and reference your Project ID.</p>
            <div className="successReference"><span>PROJECT REFERENCE</span><strong>{projectId}</strong></div>
          </div>
          <ProjectSummary project={project} projectId={projectId} completed />
          <div className="successActions">
            <button className="successAction successPrimary" type="button" onClick={openWhatsApp} disabled={!PROJECT_DESTINATIONS.whatsapp}>WHATSAPP <span aria-hidden="true">↗</span></button>
            <a className="successAction" href={PROJECT_DESTINATIONS.email ? `mailto:${PROJECT_DESTINATIONS.email}?subject=${encodeURIComponent(buildEmailSubject(projectId))}&body=${encodeURIComponent(buildEmailBody(project, projectId))}` : undefined} aria-disabled={!PROJECT_DESTINATIONS.email} onClick={(event) => { if (!PROJECT_DESTINATIONS.email) event.preventDefault() }}>EMAIL <span aria-hidden="true">↗</span></a>
            <a className="successAction" href={PROJECT_DESTINATIONS.phone ? `tel:${PROJECT_DESTINATIONS.phone}` : undefined} aria-disabled={!PROJECT_DESTINATIONS.phone} onClick={(event) => { if (!PROJECT_DESTINATIONS.phone) event.preventDefault() }}>CALL EVO+ <span aria-hidden="true">↗</span></a>
            <button className="successAction" type="button" onClick={copySummary}>{copied ? "COPIED ✓" : "COPY PROJECT SUMMARY"}</button>
          </div>
          <button className="startNewProject" type="button" onClick={startNewProject}>START NEW PROJECT</button>
        </div>
      ) : <>
        <div className="projectBuilderShell">
        <div className="projectBuilderMain">
          <ProjectProgress step={step} onStepSelect={(nextStep) => { setStep(nextStep); setError("") }} />
          <div className="projectStepHeader">
            <span>STEP {String(step).padStart(2, "0")} / 06</span>
            <h3>{step === 1 && "What are you working on?"}{step === 2 && "What infrastructure do you need?"}{step === 3 && "Approximate project size?"}{step === 4 && "When do you need it?"}{step === 5 && "Where is the project located?"}{step === 6 && "How should EVO+ contact you?"}</h3>
            {step < 3 && <small>Select all that apply.</small>}
          </div>

          {step === 1 && <div className="projectOptions">{projectTypes.map((option) => <ProjectOption key={option.value} option={option} selected={project.projectTypes.includes(option.value)} onSelect={() => toggleOption("projectTypes", option.value)} />)}</div>}
          {step === 2 && <div className="projectOptions">{services.map((option) => <ProjectOption key={option.value} option={option} selected={project.services.includes(option.value)} onSelect={() => toggleOption("services", option.value)} />)}</div>}
          {step === 3 && <div className="projectOptions projectOptionsSingle">{sizes.map((option) => <ProjectOption key={option.value} option={option} selected={project.size === option.value} onSelect={() => updateProject("size", option.value as ProjectDraft["size"])} />)}</div>}
          {step === 4 && <div className="projectOptions projectOptionsSingle">{timelines.map((option) => <ProjectOption key={option.value} option={option} selected={project.timeline === option.value} onSelect={() => updateProject("timeline", option.value)} />)}</div>}
          {step === 5 && <div className="projectFields"><label>City<input value={project.city} onChange={(event) => updateProject("city", event.target.value)} placeholder="Austin" /></label><label>State<input value={project.state} onChange={(event) => updateProject("state", event.target.value)} placeholder="TX" maxLength={2} /></label><label>ZIP Code<input value={project.zip} onChange={(event) => updateProject("zip", event.target.value)} placeholder="78701" inputMode="numeric" /></label></div>}
          {step === 6 && <div className="projectFields projectContactFields"><label>Name<input value={project.name} onChange={(event) => updateProject("name", event.target.value)} placeholder="Your name" autoComplete="name" /></label><label>Company<input value={project.company} onChange={(event) => updateProject("company", event.target.value)} placeholder="Company name" autoComplete="organization" /></label><label>Email<input value={project.email} onChange={(event) => updateProject("email", event.target.value)} placeholder="you@company.com" type="email" autoComplete="email" /></label><label>Phone<input value={project.phone} onChange={(event) => updateProject("phone", event.target.value)} placeholder="(555) 555-5555" type="tel" autoComplete="tel" /></label><label className="projectNotes">Project notes <span>OPTIONAL</span><textarea value={project.notes} onChange={(event) => updateProject("notes", event.target.value)} placeholder="Tell us anything useful about the project." rows={3} /></label></div>}

          {error && <p className="projectValidation" role="alert">{error}</p>}
          <div className="projectNavigation">
            <button className="projectBack" type="button" onClick={() => { setStep((current) => Math.max(1, current - 1) as ProjectStep); setError("") }} disabled={step === 1}>BACK</button>
            {step < 6 ? <button className="projectNext" type="button" onClick={goNext}>CONTINUE <span aria-hidden="true">→</span></button> : <MagneticButton className="projectNext" type="button" onClick={handleAssessment}>REQUEST PROJECT ASSESSMENT <span aria-hidden="true">→</span></MagneticButton>}
          </div>
          {submitted && <p className="projectSubmitted" role="status">PROJECT ASSESSMENT READY FOR REVIEW.</p>}
        </div>

        <ProjectSummary project={project} projectId={projectId} />
        </div>

        <div className="projectBuilderFooter">
        <p>By submitting this request, you agree that EVO Solutions+ may contact you regarding your project. <a href="#privacy-policy">Privacy Policy</a></p>
        <p className="projectDraftNote">Your project draft is temporarily saved on this device while you complete the request.</p>
        <button className="whatsappButton" type="button" onClick={openWhatsApp} disabled={!PROJECT_DESTINATIONS.whatsapp} title={PROJECT_DESTINATIONS.whatsapp ? "Send project summary via WhatsApp" : "WhatsApp destination is not configured yet"}>SEND VIA WHATSAPP <span aria-hidden="true">↗</span></button>
        </div>
      </>}
    </section>
  )
}

export default ProjectBuilder
