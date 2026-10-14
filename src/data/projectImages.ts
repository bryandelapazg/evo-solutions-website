import heroImage from "../assets/tipo.png"

export type ProjectImageCategory = "network" | "fiber" | "wifi" | "security" | "infrastructure"

export type ProjectImage = {
  id: string
  src: string
  category: ProjectImageCategory
  title?: string
}

// Reserved for future Our Work / Recent Installations / Project Detail pages.
// Only one authentic EVO+ project photograph exists today; more should be added
// here as real jobsite photography becomes available.
export const PROJECT_IMAGES: ProjectImage[] = [
  {
    id: "rack-system-01",
    src: heroImage,
    category: "network",
    title: "EVO+ technician terminating a rack system",
  },
]
