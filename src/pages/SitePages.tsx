import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import ProjectBuilder from "../components/ProjectBuilder/ProjectBuilder"
import ContactLink from "../components/ContactLink"
import { company as COMPANY, contactHrefs } from "../config/company"
import "./SitePages.css"

export type PageKey = "home" | "services" | "process" | "about" | "contact"

type SitePageProps = { page: Exclude<PageKey, "home"> }

const serviceGroups: { number: string; title: string; summary: string; items: string[] }[] = [
  {
    number: "01",
    title: "NETWORK INFRASTRUCTURE",
    summary: "Structured cabling, network installations and upgrades built for reliable daily performance.",
    items: ["Cat5e / Cat6 / Cat6A structured cabling", "Network installations and upgrades", "Switches, routers and firewalls", "Network migrations", "Testing and certification", "Troubleshooting"],
  },
  {
    number: "02",
    title: "IDF & MDF",
    summary: "Organized rack and cabinet buildouts designed for clean, serviceable infrastructure.",
    items: ["Buildouts", "Racks and cabinets", "Patch panels", "Equipment installation", "Cable management", "Relocation and decommissioning", "Labeling and documentation"],
  },
  {
    number: "03",
    title: "FIBER OPTICS",
    summary: "Fiber cabling and backbone connectivity for high-performance, building-to-building infrastructure.",
    items: ["Fiber cabling", "Termination", "Testing", "Troubleshooting", "Backbone connectivity", "Building-to-building", "Fiber upgrades"],
  },
  {
    number: "04",
    title: "WI-FI & WIRELESS",
    summary: "Access point deployment and wireless infrastructure for consistent coverage.",
    items: ["Access point installation", "Wireless infrastructure", "AP deployment", "AP relocation", "AP replacement", "Point-to-point connectivity", "Wireless cabling"],
  },
  {
    number: "05",
    title: "CCTV / SECURITY INFRASTRUCTURE",
    summary: "IP camera and CCTV infrastructure designed for reliable, organized coverage.",
    items: ["IP cameras", "CCTV cabling", "Camera mounting", "Camera deployment", "NVR / DVR infrastructure", "Camera relocation", "System upgrades"],
  },
  {
    number: "06",
    title: "AUDIO / VIDEO",
    summary: "Conference room and A/V infrastructure built on clean low-voltage connectivity.",
    items: ["Conference room A/V", "Displays / TVs", "Speakers / audio", "A/V cabling", "HDMI", "XLR", "Low-voltage connectivity", "Installation and relocation"],
  },
  {
    number: "07",
    title: "VOICE / PHONE",
    summary: "Analog, digital and VoIP infrastructure for evolving communication needs.",
    items: ["Analog", "Digital", "VoIP infrastructure", "Voice cabling", "Phone / data drops", "Moves, adds and changes"],
  },
  {
    number: "08",
    title: "IT INFRASTRUCTURE SUPPORT",
    summary: "On-site support and hardware deployment for technology refreshes and office moves.",
    items: ["On-site support", "Network hardware installation", "Equipment deployment", "Troubleshooting", "Connectivity", "Technology refreshes", "Office moves", "New site buildouts", "Decommissioning"],
  },
  {
    number: "09",
    title: "LOW-VOLTAGE INFRASTRUCTURE",
    summary: "Pathways, conduit and equipment mounting for construction and remodel projects.",
    items: ["Construction / remodel infrastructure", "Pathways", "Conduit", "Equipment mounting", "Cable removal", "Demolition", "Site surveys", "Maintenance", "Repairs"],
  },
]

const processSteps = [
  ["01", "PLAN", "Understand the environment, requirements and future needs."],
  ["02", "INSTALL", "Professional deployment with clean organization and attention to detail."],
  ["03", "CONNECT", "Configure and verify the infrastructure required to keep the environment connected."],
  ["04", "SUPPORT", "Troubleshoot, maintain and adapt infrastructure as business needs evolve."],
  ["05", "GROW", "Build infrastructure that can support future expansion."],
]

function PageFrame({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  return <div className="sitePage"><header className="sitePageHeader" data-reveal><span className="sectionKicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>{children}</div>
}

function ServicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  return (
    <PageFrame eyebrow="SERVICES" title={<>Infrastructure built<br />for real business environments.</>} description="EVO Solutions+ delivers network, low-voltage and technology infrastructure for offices, commercial environments and growing businesses.">
      <div className="serviceDisciplineList">
        {serviceGroups.map(({ number, title, summary, items }) => {
          const isOpen = expanded === number
          return (
            <article className={`serviceDiscipline${isOpen ? " is-open" : ""}`} data-reveal key={number}>
              <button
                type="button"
                className="serviceDisciplineTrigger"
                aria-expanded={isOpen}
                aria-controls={`service-detail-${number}`}
                onClick={() => setExpanded(isOpen ? null : number)}
              >
                <span>{number}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{summary}</p>
                </div>
                <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
              </button>
              <motion.div
                id={`service-detail-${number}`}
                className="serviceDisciplineDetail"
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            </article>
          )
        })}
      </div>
    </PageFrame>
  )
}

function ProcessPage() {
  const prefersReducedMotion = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 0.8", "end 0.4"] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <PageFrame eyebrow="PROCESS" title={<>From planning<br />to a working system.</>} description="A disciplined path from site understanding to organized, tested infrastructure.">
      <div className="processTimeline" ref={timelineRef}>
        <motion.div
          className="processTimelineFill"
          aria-hidden="true"
          style={{ scaleY: prefersReducedMotion ? 1 : lineScale }}
        />
        {processSteps.map(([number, title, description]) => (
          <article className="processStep" data-reveal key={number}>
            <span className="processNumber">{number}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  )
}

function AboutPage() {
  return <PageFrame eyebrow="ABOUT EVO+" title={<>Built around<br /><em>real infrastructure.</em></>} description="EVO Solutions+ designs and installs technology infrastructure for modern business environments."><div className="aboutStatement" data-reveal><p>Our focus is practical: clean installations, reliable connectivity, organized infrastructure and systems designed with future growth in mind.</p><strong>PLAN.<br />INSTALL.<br />CONNECT.<br />SUPPORT.<br />GROW.</strong></div><div className="aboutPrinciples">{[["01", "CLEAN WORK", "Organized pathways, clear labeling and infrastructure that remains serviceable."], ["02", "RELIABLE INFRASTRUCTURE", "Network, fiber, wireless, security and low-voltage infrastructure considered together."], ["03", "SMART PLANNING", "Hands-on deployment and troubleshooting in real business environments."], ["04", "SCALABLE SOLUTIONS", "Infrastructure planned for upgrades, growth and future business needs."],].map(([number, title, description]) => <article data-reveal key={number}><span>{number}</span><h2>{title}</h2><p>{description}</p></article>)}</div></PageFrame>
}

function ContactPage() {
  return (
    <PageFrame eyebrow="CONTACT" title={<>Let&apos;s build<br /><em>what&apos;s next.</em></>} description="Tell us about your infrastructure needs and we'll help determine the right approach for your environment.">
      <div className="contactOptions" data-reveal>
        <ContactLink href={contactHrefs.phone}>CALL EVO+ · {COMPANY.phoneDisplay}</ContactLink>
        <ContactLink href={contactHrefs.email}>EMAIL · {COMPANY.email}</ContactLink>
        <ContactLink href={contactHrefs.instagram} external>INSTAGRAM · {COMPANY.instagramHandle}</ContactLink>
        <ContactLink href={contactHrefs.whatsapp} external>WHATSAPP</ContactLink>
        <span className="contactMeta">{COMPANY.location} · {COMPANY.domain}</span>
      </div>
      <ProjectBuilder />
    </PageFrame>
  )
}

export function HomeSupport({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  const principles = [["01", "BUILT CLEAN", "Organized infrastructure, proper labeling, cable management and deployment discipline."], ["02", "DESIGNED TO SCALE", "Infrastructure planned for upgrades, growth and future business needs."], ["03", "FIELD-FOCUSED", "Real installation, troubleshooting and deployment experience."], ["04", "CONNECTED AS A SYSTEM", "Network, fiber, wireless, security and low-voltage infrastructure designed to work together."]]
  return <><section className="whyEvo" aria-labelledby="why-title"><div className="homeSectionHeading" data-reveal><span className="sectionKicker">WHY EVO+</span><h2 id="why-title">The details behind<br /><em>reliable infrastructure.</em></h2></div><div className="principleGrid">{principles.map(([number, title, description]) => <article data-reveal key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section><section className="processPreview" aria-labelledby="process-preview-title"><div className="homeSectionHeading" data-reveal><span className="sectionKicker">HOW WE WORK</span><h2 id="process-preview-title">A clear path from<br /><em>plan to progress.</em></h2></div><div className="processPreviewLine">{processSteps.slice(0, 5).map(([number, title, description]) => <article data-reveal key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div><button className="textCta" type="button" onClick={() => onNavigate("process")}>VIEW OUR PROCESS <span aria-hidden="true">→</span></button></section></>
}

function SitePage({ page }: SitePageProps) {
  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".sitePage [data-reveal]")
    requestAnimationFrame(() => revealItems.forEach((item) => item.classList.add("is-visible")))
  }, [page])
  if (page === "services") return <ServicesPage />
  if (page === "process") return <ProcessPage />
  if (page === "about") return <AboutPage />
  return <ContactPage />
}

export default SitePage
