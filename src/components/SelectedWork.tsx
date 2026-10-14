import { useState } from "react"
import { SELECTED_WORK } from "../data/selectedWork"
import SelectedWorkLightbox from "./SelectedWorkLightbox"
import "./SelectedWork.css"

function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = () => setActiveIndex(null)
  const showPrev = () => setActiveIndex((current) => (current === null ? null : (current - 1 + SELECTED_WORK.length) % SELECTED_WORK.length))
  const showNext = () => setActiveIndex((current) => (current === null ? null : (current + 1) % SELECTED_WORK.length))

  return (
    <section className="selectedWork" aria-labelledby="selected-work-title">
      <div className="selectedWorkHeader">
        <span className="sectionKicker">SELECTED WORK</span>
        <h2 id="selected-work-title">Real installations.</h2>
        <p>Infrastructure built for real business environments.</p>
      </div>

      <div className="selectedWorkGrid">
        {SELECTED_WORK.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={`selectedWorkCard${index === 0 ? " is-featured" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${item.title} — ${item.category}`}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ objectPosition: item.objectPosition }}
              loading="lazy"
              decoding="async"
            />
            <span className="selectedWorkOverlay" aria-hidden="true" />
            <span className="selectedWorkCorner" aria-hidden="true" />
            <span className="selectedWorkIndex" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="selectedWorkInfo">
              <small>{item.category}</small>
              <strong>{item.title}</strong>
              <em>VIEW <span aria-hidden="true">→</span></em>
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <SelectedWorkLightbox items={SELECTED_WORK} activeIndex={activeIndex} onClose={close} onPrev={showPrev} onNext={showNext} />
      )}
    </section>
  )
}

export default SelectedWork
