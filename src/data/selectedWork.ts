import tipoImage from "../assets/tipo.png"
import networkImage from "../assets/evo imags/infraestructuraa.png"
import fiberImage from "../assets/evo imags/fiber evo.png"
import wifiImage from "../assets/evo imags/wifi.png"
import securityImage from "../assets/evo imags/security camras.png"

export type SelectedWorkCategory = "NETWORK" | "FIBER" | "WI-FI" | "SECURITY" | "INFRASTRUCTURE"

export interface SelectedWorkItem {
  id: string
  title: string
  category: SelectedWorkCategory
  image: string
  objectPosition?: string
}

// Real local EVO+ photography only — no stock/fake project data.
export const SELECTED_WORK: SelectedWorkItem[] = [
  { id: "network-rack", title: "Network Rack System", category: "NETWORK", image: tipoImage, objectPosition: "54% 42%" },
  { id: "structured-infrastructure", title: "Structured Infrastructure Build", category: "INFRASTRUCTURE", image: networkImage, objectPosition: "60% 40%" },
  { id: "fiber-termination", title: "Fiber Termination", category: "FIBER", image: fiberImage, objectPosition: "65% 45%" },
  { id: "wireless-deployment", title: "Wireless Access Deployment", category: "WI-FI", image: wifiImage, objectPosition: "70% 30%" },
  { id: "camera-installation", title: "Security Camera Installation", category: "SECURITY", image: securityImage, objectPosition: "55% 35%" },
]
