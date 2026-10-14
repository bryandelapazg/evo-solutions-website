import { useEffect, useRef } from "react"

function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const progress = progressRef.current
    let frame = 0

    if (!progress) return

    const updateProgress = () => {
      frame = 0
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const value = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`
    }

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return <div className="scrollProgress" ref={progressRef} aria-hidden="true" />
}

export default ScrollProgress
