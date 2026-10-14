import type { Option } from "./types"

type ProjectOptionProps = {
  option: Option
  selected: boolean
  onSelect: () => void
}

function ProjectOption({ option, selected, onSelect }: ProjectOptionProps) {
  return (
    <button
      className={`projectOption${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="optionIndicator" aria-hidden="true" />
      <span className="optionCopy">
        <strong>{option.label}</strong>
        {option.detail && <small>{option.detail}</small>}
      </span>
      <span className="optionState" aria-hidden="true">{selected ? "ACTIVE" : ""}</span>
    </button>
  )
}

export default ProjectOption
