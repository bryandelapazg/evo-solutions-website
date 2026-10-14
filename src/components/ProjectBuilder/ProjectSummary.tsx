import type { ProjectDraft } from "./types"

type ProjectSummaryProps = {
  project: ProjectDraft
  projectId: string
  completed?: boolean
}

const displayValue = (value: string) => value || "Awaiting selection"

function ProjectSummary({ project, projectId, completed = false }: ProjectSummaryProps) {
  const location = [project.city, project.state].filter(Boolean).join(", ")
  const contact = [project.name, project.company, project.email, project.phone].filter(Boolean).join("\n")
  const sizeLabels: Record<string, string> = {
    small: "Small — 1–10 connections",
    medium: "Medium — 11–30 connections",
    large: "Large — 31–75 connections",
    enterprise: "Enterprise / custom — 75+ connections",
  }

  return (
    <aside className={`projectSummary${completed ? " projectSummaryCompleted" : ""}`} aria-label="Project summary">
      <div className="summaryHeader">
        <span>{completed ? "EVO SOLUTIONS+ / PROJECT REQUEST" : "PROJECT OVERVIEW"}</span>
        <span className="summaryPulse" aria-hidden="true" />
      </div>
      {completed && <div className="summaryProjectId"><span>PROJECT ID</span><strong>{projectId}</strong></div>}
      <div className="summaryRows">
        <div className="summaryRow"><span>TYPE</span><strong>{project.projectTypes.length ? project.projectTypes.join(", ") : "Awaiting selection"}</strong></div>
        <div className="summaryRow"><span>SERVICES</span><strong>{project.services.length ? project.services.join(", ") : "Awaiting selection"}</strong></div>
        <div className="summaryRow"><span>PROJECT SIZE</span><strong>{sizeLabels[project.size] || "Awaiting selection"}</strong></div>
        <div className="summaryRow"><span>TIMELINE</span><strong>{displayValue(project.timeline)}</strong></div>
        <div className="summaryRow"><span>LOCATION</span><strong>{displayValue(location)}{project.zip ? ` ${project.zip}` : ""}</strong></div>
        <div className="summaryRow"><span>CLIENT</span><strong className="summaryMultiline">{displayValue(contact)}</strong></div>
        {completed && <div className="summaryRow"><span>NOTES</span><strong>{project.notes || "None provided"}</strong></div>}
        {completed && <div className="summaryStatus"><span>STATUS</span><strong>NEW REQUEST</strong></div>}
      </div>
    </aside>
  )
}

export default ProjectSummary
