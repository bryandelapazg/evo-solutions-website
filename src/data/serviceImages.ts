import networkImage from "../assets/evo imags/infraestructuraa.png"
import fiberImage from "../assets/evo imags/fiber evo.png"
import wifiImage from "../assets/evo imags/wifi.png"
import securityImage from "../assets/evo imags/security camras.png"
import type { ServiceId } from "./services"

export type ServiceImage = {
  src: string
  objectPosition: string
  filter: string
}

// Typed map of the current EVO+ photography to each primary service.
export const SERVICE_IMAGES: Record<ServiceId, ServiceImage> = {
  network: { src: networkImage, objectPosition: "64% 42%", filter: "brightness(0.92) saturate(0.96) contrast(1.03)" },
  fiber: { src: fiberImage, objectPosition: "68% 44%", filter: "brightness(0.94) saturate(1.05) contrast(1.02)" },
  wifi: { src: wifiImage, objectPosition: "72% 30%", filter: "brightness(0.92) saturate(0.98)" },
  security: { src: securityImage, objectPosition: "58% 36%", filter: "brightness(0.86) contrast(1.05)" },
}
