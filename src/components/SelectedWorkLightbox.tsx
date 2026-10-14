import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef } from "react"
import type { SelectedWorkItem } from "../data/selectedWork"
import "./SelectedWorkLightbox.css"

type SelectedWorkLightboxProps = {
  items: SelectedWorkItem[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function SelectedWorkLightbox({ items, activeIndex, onClose, onPrev, onNext }: SelectedWorkLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const item = items[activeIndex]

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") onPrev()
      if (event.key === "ArrowRight") onNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, onPrev, onNext])

  if (!item) return null

  return (
    <AnimatePresence>
      <motion.div
        className="selectedWorkLightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} — full view`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <motion.div
          className="selectedWorkLightboxFrame"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={item.image} alt={item.title} style={{ objectPosition: item.objectPosition }} />
          <div className="selectedWorkLightboxCaption">
            <span>{item.category}</span>
            <strong>{item.title}</strong>
          </div>

          <button ref={closeButtonRef} type="button" className="selectedWorkLightboxClose" onClick={onClose} aria-label="Close">
            ×
          </button>
          <button type="button" className="selectedWorkLightboxNav selectedWorkLightboxPrev" onClick={onPrev} aria-label="Previous image">
            ←
          </button>
          <button type="button" className="selectedWorkLightboxNav selectedWorkLightboxNext" onClick={onNext} aria-label="Next image">
            →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SelectedWorkLightbox
