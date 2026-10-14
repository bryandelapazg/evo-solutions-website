import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react"

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (!button || !canHover.matches || reduceMotion.matches) return

    const moveButton = (event: PointerEvent) => {
      const bounds = button.getBoundingClientRect()
      const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width
      const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height
      button.style.setProperty("--magnetic-x", `${x * 5}px`)
      button.style.setProperty("--magnetic-y", `${y * 4}px`)
    }

    const resetButton = () => {
      button.style.setProperty("--magnetic-x", "0px")
      button.style.setProperty("--magnetic-y", "0px")
    }

    button.addEventListener("pointermove", moveButton)
    button.addEventListener("pointerleave", resetButton)

    return () => {
      button.removeEventListener("pointermove", moveButton)
      button.removeEventListener("pointerleave", resetButton)
    }
  }, [])

  return <button ref={buttonRef} className={`magneticButton ${className}`.trim()} {...props}>{children}</button>
}

export default MagneticButton
