import type { ProjectStep } from "./types"

type ProjectProgressProps = {
  step: ProjectStep
  onStepSelect: (step: ProjectStep) => void
}

function ProjectProgress({ step, onStepSelect }: ProjectProgressProps) {
  return (
    <div className="projectProgress" aria-label={`Project configuration step ${step} of 6`}>
      <div className="projectProgressHeader">
        <span>PROJECT CONFIGURATION</span>
        <strong>STEP {String(step).padStart(2, "0")} / 06</strong>
        <span className="readyStatus"><i aria-hidden="true" /> SYSTEM READY</span>
      </div>
      <div className="projectProgressTrack">
        {([1, 2, 3, 4, 5, 6] as ProjectStep[]).map((segment) => (
          <button
            className={segment <= step ? "is-complete" : ""}
            key={segment}
            type="button"
            onClick={() => segment < step && onStepSelect(segment)}
            aria-label={`Go to project step ${segment}`}
            aria-current={segment === step ? "step" : undefined}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectProgress
