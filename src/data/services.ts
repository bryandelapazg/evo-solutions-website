import { Cable, Cctv, Network, Wifi } from "lucide-react"
import { SERVICE_IMAGES } from "./serviceImages"

export type ServiceId = "network" | "fiber" | "wifi" | "security"

export type Service = {
  id: ServiceId
  number: string
  title: string
  category: string
  description: string
  metadata: string
  icon: typeof Network
  image: {
    src: string
    objectPosition: string
    filter: string
  }
  hotspot: {
    label: string
    status: string
  }
  detail: {
    title: string
    items: string[]
    status: string
  }
}

// Each primary service is wired to its matching local EVO+ photography (see serviceImages.ts).
export const SERVICES: Service[] = [
  {
    id: "network",
    number: "01",
    title: "Network Infrastructure",
    category: "NETWORK",
    description: "Structured cabling, rack systems and reliable network infrastructure built for modern businesses.",
    metadata: "RACK SYSTEM / CONNECTED",
    icon: Network,
    image: SERVICE_IMAGES.network,
    hotspot: { label: "RACK SYSTEM", status: "CONNECTED" },
    detail: { title: "NETWORK INFRASTRUCTURE", items: ["Structured cabling", "Network equipment", "Testing & certification"], status: "CONNECTED" },
  },
  {
    id: "fiber",
    number: "02",
    title: "Fiber Optics",
    category: "FIBER",
    description: "Fiber installation, termination and testing for high-performance connectivity.",
    metadata: "FIBER PATH / ACTIVE",
    icon: Cable,
    image: SERVICE_IMAGES.fiber,
    hotspot: { label: "FIBER PATH", status: "ACTIVE" },
    detail: { title: "FIBER OPTICS", items: ["Cabling", "Termination", "Testing"], status: "ACTIVE" },
  },
  {
    id: "wifi",
    number: "03",
    title: "Wi-Fi Solutions",
    category: "WI-FI",
    description: "Professional wireless infrastructure and access point deployment.",
    metadata: "ACCESS POINT / ONLINE",
    icon: Wifi,
    image: SERVICE_IMAGES.wifi,
    hotspot: { label: "ACCESS POINT", status: "ONLINE" },
    detail: { title: "WI-FI & WIRELESS", items: ["Access points", "Wireless deployment", "Point-to-point"], status: "ONLINE" },
  },
  {
    id: "security",
    number: "04",
    title: "Security Systems",
    category: "SECURITY",
    description: "CCTV and IP camera infrastructure designed for reliable coverage.",
    metadata: "CAMERA NODE / MONITORING",
    icon: Cctv,
    image: SERVICE_IMAGES.security,
    hotspot: { label: "CAMERA NODE", status: "MONITORING" },
    detail: { title: "CCTV / SECURITY", items: ["IP cameras", "CCTV cabling", "NVR / DVR infrastructure"], status: "MONITORING" },
  },
]

export const getService = (id: string): Service | undefined => SERVICES.find((service) => service.id === id)
