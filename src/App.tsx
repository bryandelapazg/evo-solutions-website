import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import "./App.css"
import heroImage from "./assets/tipo.png"
import MagneticButton from "./components/MagneticButton"
import ScrollProgress from "./components/ScrollProgress"
import SystemStatus from "./components/SystemStatus"
import HeroServicePreview from "./components/HeroServicePreview"
import SelectedWork from "./components/SelectedWork"
import SitePage, { type PageKey } from "./pages/SitePages"
import { SERVICES, getService } from "./data/services"
import { company as COMPANY, contactHrefs } from "./config/company"
import ContactLink from "./components/ContactLink"
import ContactDock from "./components/ContactDock"

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const
const previewServices: string[] = SERVICES.map((service) => service.id)

// "infrastructure" is a bonus hero option outside the four primary services in services.ts
const DEFAULT_HERO_IMAGE = {
  src: heroImage,
  objectPosition: "58% 40%",
  filter: "brightness(0.86) saturate(1.02) contrast(1.02)",
}

function App() {
  const [activeService, setActiveService] = useState("network")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const [currentPage, setCurrentPage] = useState<PageKey>("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)").matches,
  )

  const visualRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const rawPointerX = useMotionValue(0)
  const rawPointerY = useMotionValue(0)
  const springConfig = { stiffness: 120, damping: 22, mass: 0.6 }
  const springX = useSpring(rawPointerX, springConfig)
  const springY = useSpring(rawPointerY, springConfig)

  const imageParallaxX = useTransform(springX, (v) => `${v * 4}px`)
  const imageParallaxY = useTransform(springY, (v) => `${v * 4}px`)

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroExitRange: [number, number] = [0, 0.35]
  const headlineScrollY = useTransform(heroScrollProgress, heroExitRange, [0, -20])
  const headlineScrollOpacity = useTransform(heroScrollProgress, heroExitRange, [1, 0.65])
  const imageScrollScale = useTransform(heroScrollProgress, heroExitRange, [1, 1.035])

  const activeServiceData = getService(activeService)
  const activeImage = activeServiceData?.image ?? DEFAULT_HERO_IMAGE

  const navigateTo = (page: PageKey) => {
    setCurrentPage(page)
    setIsMenuOpen(false)
  }

  const selectService = (service: string) => {
    setActiveService(service)
    setHasInteracted(true)
  }

  const moveService = (direction: 1 | -1) => {
    const currentIndex = previewServices.indexOf(activeService)
    const nextIndex = (currentIndex + direction + previewServices.length) % previewServices.length
    selectService(previewServices[nextIndex])
  }

  const visualService = hoveredService ?? activeService
  const pageToRender = currentPage as Exclude<PageKey, "home">

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)")
    const update = () => setIsDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const visual = visualRef.current
    if (!visual || !isDesktop || prefersReducedMotion) return

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = visual.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5

      rawPointerX.set(x)
      rawPointerY.set(y)
      visual.style.setProperty("--light-x", `${event.clientX - bounds.left}px`)
      visual.style.setProperty("--light-y", `${event.clientY - bounds.top}px`)
    }

    const resetPointer = () => {
      rawPointerX.set(0)
      rawPointerY.set(0)
      visual.style.setProperty("--light-x", "50%")
      visual.style.setProperty("--light-y", "50%")
    }

    visual.addEventListener("pointermove", handlePointerMove)
    visual.addEventListener("pointerleave", resetPointer)

    return () => {
      visual.removeEventListener("pointermove", handlePointerMove)
      visual.removeEventListener("pointerleave", resetPointer)
    }
  }, [isDesktop, prefersReducedMotion, rawPointerX, rawPointerY])

  useEffect(() => {
    if (
      currentPage !== "home" ||
      hasInteracted ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveService((current) => {
        const index = previewServices.indexOf(current)
        return previewServices[(index + 1) % previewServices.length]
      })
    }, 8000)

    return () => window.clearInterval(timer)
  }, [currentPage, hasInteracted])

  useEffect(() => {
    const closePanel = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpandedService(null)
    }

    window.addEventListener("keydown", closePanel)
    return () => window.removeEventListener("keydown", closePanel)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", closeMenu)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeMenu)
    }
  }, [isMenuOpen])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [currentPage])

  useEffect(() => {
    const pageTitles: Record<PageKey, string> = {
      home: "EVO Solutions+ | Technology, Network & Infrastructure",
      services: "Services | EVO Solutions+",
      process: "Process | EVO Solutions+",
      about: "About | EVO Solutions+",
      contact: "Contact | EVO Solutions+",
    }

    document.title = pageTitles[currentPage]

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement("meta")
      description.name = "description"
      document.head.appendChild(description)
    }

    description.content =
      "EVO Solutions+ delivers professional network, low-voltage and technology infrastructure solutions for modern businesses."
  }, [currentPage])

  useEffect(() => {
    const app = appRef.current
    if (!app) return

    const revealItems = app.querySelectorAll<HTMLElement>("[data-reveal]")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 },
    )

    revealItems.forEach((item) => {
      if (reduceMotion.matches) item.classList.add("is-visible")
      else observer.observe(item)
    })

    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = app.querySelector(".hero")?.getBoundingClientRect().height ?? window.innerHeight
      const heroProgress = Math.min(1, Math.max(0, scrollY / Math.max(1, heroHeight)))

      const nextScrolled = scrollY > 18
      const nextNavHidden = scrollY > lastScrollY.current && scrollY > 90

      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled))
      setIsNavHidden((current) => (current === nextNavHidden ? current : nextNavHidden))
      app.style.setProperty("--hero-progress", String(heroProgress))
      app.style.setProperty("--hero-dim", String(1 - heroProgress * 0.12))
      lastScrollY.current = scrollY
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const app = appRef.current
    if (!app || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const handlePointerMove = (event: PointerEvent) => {
      app.style.setProperty("--cursor-x", `${event.clientX}px`)
      app.style.setProperty("--cursor-y", `${event.clientY}px`)

      if (event.target instanceof HTMLElement) {
        const card = event.target.closest<HTMLElement>(".serviceCard")

        if (card) {
          const bounds = card.getBoundingClientRect()
          card.style.setProperty("--card-x", `${event.clientX - bounds.left}px`)
          card.style.setProperty("--card-y", `${event.clientY - bounds.top}px`)
        }
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  useEffect(() => {
    const visual = visualRef.current
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = new IntersectionObserver(
      ([entry]) => visual.classList.toggle("visualInView", entry.isIntersecting),
      { threshold: 0.05 },
    )

    observer.observe(visual)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.main
      ref={appRef}
      className={`app${isScrolled ? " is-scrolled" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <ScrollProgress />
      <div className="systemAtmosphere" aria-hidden="true" />

      <motion.nav
        className={`navbar${isNavHidden ? " navbarHidden" : ""}`}
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
      >
        <div className="logo">
          EVO<span>solutions+</span>
        </div>

        <div className="navLinks">
          <button className={currentPage === "home" ? "is-active" : ""} onClick={() => navigateTo("home")}>Home</button>
          <button className={currentPage === "services" ? "is-active" : ""} onClick={() => navigateTo("services")}>Services</button>
          <button className={currentPage === "process" ? "is-active" : ""} onClick={() => navigateTo("process")}>Process</button>
          <button className={currentPage === "about" ? "is-active" : ""} onClick={() => navigateTo("about")}>About</button>
        </div>

        <MagneticButton className="talkButton" onClick={() => navigateTo("contact")}>LET&apos;S TALK <span aria-hidden="true">→</span></MagneticButton>
        <button
          className={`menuToggle${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <i />
          <i />
        </button>
      </motion.nav>

      <div className={`mobileMenu${isMenuOpen ? " is-open" : ""}`} aria-hidden={!isMenuOpen}>
        {(["home", "services", "process", "about", "contact"] as PageKey[]).map((page) => (
          <button key={page} type="button" tabIndex={isMenuOpen ? 0 : -1} onClick={() => navigateTo(page)}>
            {page}
          </button>
        ))}
        <button className="mobileMenuCta" type="button" tabIndex={isMenuOpen ? 0 : -1} onClick={() => navigateTo("contact")}>
          LET&apos;S TALK <span aria-hidden="true">→</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {currentPage === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <section className="hero" ref={heroRef}>
              <div className="heroContent">
                <motion.div
                  className="eyebrow"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: CINEMATIC_EASE }}
                >
                  <span className="pulse" />
                  TECHNOLOGY • NETWORK • INFRASTRUCTURE
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ y: headlineScrollY, opacity: headlineScrollOpacity }}
                  transition={{ duration: 0.9, delay: 0.15, ease: CINEMATIC_EASE }}
                >
                  Technology that keeps
                  <br />
                  your business <span>moving.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.75, ease: CINEMATIC_EASE }}
                >
                  Professional network, low-voltage and IT infrastructure solutions built for modern businesses.
                </motion.p>

                <motion.div
                  className="serviceSelector"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9, ease: CINEMATIC_EASE }}
                >
                  <button className={activeService === "network" ? "active" : ""} onClick={() => selectService("network")}>NETWORK</button>
                  <button className={activeService === "fiber" ? "active" : ""} onClick={() => selectService("fiber")}>FIBER OPTICS</button>
                  <button className={activeService === "wifi" ? "active" : ""} onClick={() => selectService("wifi")}>WI-FI</button>
                  <button className={activeService === "security" ? "active" : ""} onClick={() => selectService("security")}>SECURITY</button>
                  <button className={activeService === "infrastructure" ? "active" : ""} onClick={() => selectService("infrastructure")}>INFRASTRUCTURE</button>
                </motion.div>

                <motion.div
                  className="heroServiceIndex"
                  aria-label="Hero service index"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.05, ease: CINEMATIC_EASE }}
                >
                  {[
                    ["network", "01"],
                    ["fiber", "02"],
                    ["wifi", "03"],
                    ["security", "04"],
                    ["infrastructure", "05"],
                  ].map(([service, number]) => (
                    <button
                      className={activeService === service ? "is-active" : ""}
                      key={service}
                      type="button"
                      onClick={() => selectService(service)}
                      aria-label={`Activate ${service} service`}
                      aria-pressed={activeService === service}
                    >
                      <span>{number}</span>
                      <i aria-hidden="true" />
                    </button>
                  ))}
                </motion.div>

                <motion.button
                  className="heroScrollCue"
                  type="button"
                  onClick={() => document.getElementById("hero-service-preview")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  initial={{ opacity: 0 }}
                  animate={
                    isScrolled
                      ? { opacity: 0 }
                      : prefersReducedMotion
                        ? { opacity: 0.8 }
                        : { opacity: [0.45, 0.8, 0.45] }
                  }
                  transition={
                    isScrolled
                      ? { duration: 0.3 }
                      : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.8 }
                  }
                >
                  <span>
                    SCROLL
                    <br />
                    TO EXPLORE
                  </span>
                  <i />
                </motion.button>
              </div>

              <div
                ref={visualRef}
                className={`visual ${visualService}${hoveredService ? " is-previewing" : ""}`}
                onClick={(event) => {
                  const target = event.target as HTMLElement
                  if (!target.closest(".heroHotspot, .hotspotPanel")) setExpandedService(null)
                }}
              >
                <div className="imageCursorLight" aria-hidden="true" />
                <div className="visualGlow" />

                <motion.div
                  className="heroImageScrollLayer"
                  style={{
                    scale: imageScrollScale,
                    x: isDesktop && !prefersReducedMotion ? imageParallaxX : 0,
                    y: isDesktop && !prefersReducedMotion ? imageParallaxY : 0,
                    opacity: 1,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeService}
                      style={{ position: "absolute", inset: 0 }}
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.75, ease: CINEMATIC_EASE }}
                    >
                      <motion.img
                        src={activeImage.src}
                        alt={activeServiceData ? `EVO+ ${activeServiceData.title} installation` : "EVO+ technology infrastructure"}
                        className="heroImage"
                        style={{ objectPosition: activeImage.objectPosition, filter: activeImage.filter, opacity: 1 }}
                        initial={{ scale: 1.04 }}
                        animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.012, 1] }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 1.5, ease: CINEMATIC_EASE }
                            : {
                                scale: {
                                  duration: 13,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  repeatType: "mirror",
                                },
                              }
                        }
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <div className="networkEffect" aria-hidden="true">
                  <span className="networkPath path1" />
                  <span className="networkPath path2" />
                  <span className="networkNode node1" />
                  <span className="networkNode node2" />
                  <span className="networkNode node3" />
                </div>

                <div className="fiberEffect" aria-hidden="true">
                  <span className="fiberLine line1" />
                  <span className="fiberLine line2" />
                  <span className="fiberLine line3" />
                  <span className="fiberPulse" />
                </div>

                <div className="wifiEffect" aria-hidden="true">
                  <span className="wifiRing ringA" />
                  <span className="wifiRing ringB" />
                  <span className="wifiRing ringC" />
                </div>

                <div className="securityEffect" aria-hidden="true">
                  <span className="scanLine" />
                  <span className="detectionPoint point1" />
                  <span className="detectionPoint point2" />
                  <span className="detectionPoint point3" />
                </div>

                <div className="infrastructureEffect" aria-hidden="true">
                  <span className="connection connection1" />
                  <span className="connection connection2" />
                  <span className="connection connection3" />
                </div>

                <svg className="hotspotConnections" viewBox="0 0 100 100" aria-hidden="true">
                  <path className={`hotspotPath pathNetwork${activeService === "network" ? " is-active" : ""}`} d="M 15 25 C 28 30, 29 42, 42 46" />
                  <path className={`hotspotPath pathFiber${activeService === "fiber" ? " is-active" : ""}`} d="M 14 72 C 29 69, 34 63, 45 59" />
                  <path className={`hotspotPath pathWifi${activeService === "wifi" ? " is-active" : ""}`} d="M 84 24 C 73 31, 67 37, 60 43" />
                  <path className={`hotspotPath pathSecurity${activeService === "security" ? " is-active" : ""}`} d="M 87 72 C 78 63, 76 53, 70 45" />
                  <circle className="hotspotPulse" r="1.1">
                    <animateMotion
                      dur="3.8s"
                      repeatCount="indefinite"
                      path={
                        activeService === "fiber"
                          ? "M 14 72 C 29 69, 34 63, 45 59"
                          : activeService === "wifi"
                            ? "M 84 24 C 73 31, 67 37, 60 43"
                            : activeService === "security"
                              ? "M 87 72 C 78 63, 76 53, 70 45"
                              : "M 15 25 C 28 30, 29 42, 42 46"
                      }
                    />
                  </circle>
                </svg>

                <div className="heroHotspots">
                  {SERVICES.map((service) => (
                    <div
                      className={`heroHotspot hotspot-${service.id}${activeService === service.id ? " is-active" : ""}`}
                      key={service.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectService(service.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          selectService(service.id)
                        }
                      }}
                      onMouseEnter={() => {
                        setHasInteracted(true)
                        setHoveredService(service.id)
                      }}
                      onMouseLeave={() => setHoveredService(null)}
                      aria-pressed={activeService === service.id}
                    >
                      <span
                        className="hotspotIcon"
                        role="button"
                        tabIndex={0}
                        aria-label={`Expand ${service.title}`}
                        aria-expanded={expandedService === service.id}
                        onClick={(event) => {
                          event.stopPropagation()
                          setExpandedService(expandedService === service.id ? null : service.id)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setExpandedService(expandedService === service.id ? null : service.id)
                          }
                        }}
                      >
                        {expandedService === service.id ? "×" : "+"}
                      </span>
                      <span>
                        <small>{service.number} / {service.hotspot.label}</small>
                        <strong>{service.title.toUpperCase()}</strong>
                        <em>● {activeService === service.id ? service.hotspot.status : "READY"}</em>
                      </span>
                    </div>
                  ))}
                </div>

                {expandedService && getService(expandedService) && (
                  <div className={`hotspotPanel hotspotPanel-${expandedService}`} role="dialog" aria-label={`${getService(expandedService)!.detail.title} details`}>
                    <strong>{getService(expandedService)!.detail.title}</strong>
                    <ul>
                      {getService(expandedService)!.detail.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <span className="hotspotPanelStatus">● {getService(expandedService)!.detail.status}</span>
                    <button type="button" onClick={() => {
                      selectService(expandedService)
                      setExpandedService(null)
                    }}>
                      VIEW SERVICE <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}

                <div className="microNodes" aria-hidden="true">
                  {[
                    ["PATCH PANEL", "Organized cable termination", "18%", "58%"],
                    ["SWITCH", "Network distribution", "31%", "43%"],
                    ["FIBER PATH", "High-speed backbone connectivity", "43%", "67%"],
                    ["CABLE MANAGEMENT", "Organized infrastructure routing", "62%", "69%"],
                  ].map(([label, description, left, top]) => (
                    <span className="microNode" key={label} style={{ left, top }}>
                      <i />
                      <b>
                        {label}
                        <small>{description}</small>
                      </b>
                    </span>
                  ))}
                </div>

                <div className="heroStory" aria-hidden="true">
                  <span>A MORE</span>
                  <strong>
                    CONNECTED
                    <br />
                    TOMORROW
                  </strong>
                  <div className="storySteps">
                    <i className={activeService === "fiber" ? "is-active" : ""}>PLAN</i>
                    <i className={activeService === "fiber" ? "is-active" : ""}>INSTALL</i>
                    <i className={activeService === "network" || activeService === "fiber" || activeService === "wifi" || activeService === "security" ? "is-active" : ""}>CONNECT</i>
                    <i className={activeService === "security" ? "is-active" : ""}>SUPPORT</i>
                    <i>GROW</i>
                  </div>
                </div>

                <div className="status">
                  <span>ACTIVE SYSTEM</span>
                  <strong key={activeService}>{activeService.toUpperCase()}</strong>
                  <small>● {activeServiceData ? activeServiceData.hotspot.status : "ACTIVE"}</small>
                  <em>{activeServiceData ? activeServiceData.metadata : "CONNECTED SYSTEM / ACTIVE"}</em>
                </div>

                <div className="heroArrowControls" aria-label="Service navigation">
                  <button type="button" onClick={() => moveService(-1)} aria-label="Previous service">←</button>
                  <button type="button" onClick={() => moveService(1)} aria-label="Next service">→</button>
                </div>

                <div className="orb">
                  <div className="orbRing ring1" />
                  <div className="orbRing ring2" />
                  <div className="orbCore" />
                </div>
              </div>
            </section>

            <div className="sectionDivider" aria-hidden="true" />
            <HeroServicePreview id="hero-service-preview" activeService={activeService} onSelect={selectService} onInteract={() => setHasInteracted(true)} />

            <section className="secondaryServices" aria-label="Additional EVO+ services">
              <span className="secondaryServicesLabel">ALSO:</span>
              <ul>
                <li>IDF / MDF</li>
                <li>AUDIO / VIDEO</li>
                <li>VOICE / PHONE</li>
                <li>IT INFRASTRUCTURE</li>
                <li>LOW VOLTAGE</li>
              </ul>
              <button type="button" className="textCta" onClick={() => navigateTo("services")}>
                VIEW ALL SERVICES <span aria-hidden="true">→</span>
              </button>
            </section>

            <div className="sectionDivider" aria-hidden="true" />
            <SelectedWork />
            <div className="sectionDivider" aria-hidden="true" />

            <section className="contactSection" aria-labelledby="contact-title">
              <div className="contactGlow" aria-hidden="true" />
              <div className="contactContent" data-reveal>
                <span className="sectionKicker">READY WHEN YOU ARE</span>
                <h2 id="contact-title">Built to connect.<br />Ready to grow.</h2>
                <p>Professional infrastructure for modern business environments.</p>
                <div className="contactCtaRow">
                  <MagneticButton className="contactButton" onClick={() => navigateTo("contact")}>LET&apos;S TALK <span aria-hidden="true">→</span></MagneticButton>
                  <button type="button" className="textCta" onClick={() => navigateTo("services")}>VIEW SERVICES</button>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <SitePage page={pageToRender} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer">
        <span className="logo">
          EVO<span>solutions+</span>
        </span>
        <SystemStatus>SYSTEM ONLINE</SystemStatus>
        <div className="footerNav">
          {(["home", "services", "process", "about", "contact"] as PageKey[]).map((page) => (
            <button key={page} type="button" onClick={() => navigateTo(page)}>
              {page}
            </button>
          ))}
        </div>
        <div className="footerMeta">
          <span>{COMPANY.location}</span>
          <ContactLink href={contactHrefs.phone}>{COMPANY.phoneDisplay}</ContactLink>
          <ContactLink href={contactHrefs.email}>{COMPANY.email}</ContactLink>
          <ContactLink href={contactHrefs.instagram} external>{COMPANY.instagramHandle}</ContactLink>
          <span>{COMPANY.domain}</span>
        </div>
        <span>TECHNOLOGY • NETWORK • INFRASTRUCTURE</span>
      </footer>

      <ContactDock />
    </motion.main>
  )
}

export default App

