import { SERVICES } from "../data/services"
import { ExpandingCards, type CardItem } from "./ui/expanding-cards"
import "./HeroServicePreview.css"

type HeroServicePreviewProps = {
  id?: string
  activeService: string
  onSelect: (service: string) => void
  onInteract?: () => void
}

const previewServices: CardItem[] = SERVICES.map((service) => {
  const Icon = service.icon
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    imgSrc: service.image.src,
    imgPosition: service.image.objectPosition,
    imgFilter: service.image.filter,
    icon: <Icon size={16} strokeWidth={2} aria-hidden="true" />,
    linkHref: "#",
  }
})


function HeroServicePreview({ id, activeService, onSelect, onInteract }: HeroServicePreviewProps) {
  return (
    <section id={id} className="heroPreview" aria-label="EVO+ service preview">
      <div className="heroPreviewHeader">
        <span>REAL SOLUTIONS. REAL PROGRESS.</span>
        <span><i aria-hidden="true" /> SERVICE SYSTEM / 04</span>
      </div>
      <ExpandingCards
        items={previewServices}
        activeId={activeService}
        onActiveChange={(next) => {
          onInteract?.()
          onSelect(String(next))
        }}
      />
    </section>
  )
}

export default HeroServicePreview
