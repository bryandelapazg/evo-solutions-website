import { useId, useState } from "react"
import { cn } from "@/lib/utils"

export interface CardItem {
  id: string | number
  title: string
  description: string
  imgSrc: string
  icon: React.ReactNode
  linkHref: string
  imgPosition?: string
  imgFilter?: string
}

export interface ExpandingCardsProps {
  items: CardItem[]
  defaultActiveIndex?: number
  className?: string
  activeId?: string | number
  onActiveChange?: (id: string | number) => void
}

export function ExpandingCards({
  items,
  defaultActiveIndex = 0,
  className,
  activeId,
  onActiveChange,
}: ExpandingCardsProps) {
  const groupId = useId()
  const [internalActiveId, setInternalActiveId] = useState<string | number>(
    () => items[defaultActiveIndex]?.id ?? items[0]?.id,
  )
  // ephemeral hover/focus preview, kept separate from the committed selection
  const [previewId, setPreviewId] = useState<string | number | null>(null)

  const isControlled = activeId !== undefined
  const committedId = isControlled ? activeId : internalActiveId
  const expandedId = previewId ?? committedId

  const commit = (id: string | number) => {
    if (!isControlled) setInternalActiveId(id)
    onActiveChange?.(id)
  }

  return (
    <div
      role="tablist"
      aria-label="EVO+ services"
      className={cn("flex w-full flex-col gap-3 md:h-[24rem] md:flex-row", className)}
    >
      {items.map((item, index) => {
        const isActive = item.id === committedId
        const isExpanded = item.id === expandedId

        return (
          <button
            key={item.id}
            id={`${groupId}-${item.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-expanded={isExpanded}
            tabIndex={0}
            onMouseEnter={() => setPreviewId(item.id)}
            onMouseLeave={() => setPreviewId(null)}
            onFocus={() => setPreviewId(item.id)}
            onBlur={() => setPreviewId(null)}
            onClick={() => commit(item.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                commit(item.id)
              }
            }}
            style={{ flexGrow: isExpanded ? 4.5 : 1 }}
            className={cn(
              "group relative isolate flex min-w-0 overflow-hidden rounded-xl border text-left outline-none",
              "flex-row items-stretch transition-[flex-grow,height,border-color,transform] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isExpanded ? "h-56" : "h-20",
              "md:h-full md:flex-col",
              "focus-visible:ring-2 focus-visible:ring-[#a8e63e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]",
              isActive ? "border-[#a8e63e]/50" : "border-white/10 hover:-translate-y-0.5 hover:border-white/25",
            )}
          >
            <img
              src={item.imgSrc}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              style={{
                objectPosition: item.imgPosition,
                filter: isExpanded ? item.imgFilter : [item.imgFilter, "grayscale(0.35)"].filter(Boolean).join(" "),
              }}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-[550ms] ease-out",
                isExpanded ? "scale-100" : "scale-[1.04]",
              )}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/92 via-[#0d0d0d]/45 to-[#0d0d0d]/10"
            />
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] bg-[#a8e63e] md:inset-x-auto md:inset-y-0 md:left-0 md:h-auto md:w-[2px]"
              />
            )}

            <span className="relative z-10 flex min-w-0 flex-1 items-center gap-3 p-4 md:h-full md:flex-col md:items-start md:justify-end md:gap-0 md:p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#a8e63e] backdrop-blur-sm md:h-9 md:w-9">
                {item.icon}
              </span>

              <span className="hidden text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40 md:mt-3 md:block">
                {String(item.id)} · {String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 flex-1 md:mt-1 md:w-full">
                <span className="block truncate text-sm font-extrabold uppercase tracking-wide text-white md:text-lg md:whitespace-normal">
                  {item.title}
                </span>

                <span
                  className={cn(
                    "mt-1 hidden max-w-md text-xs leading-relaxed text-white/65 transition-opacity duration-300 md:block md:text-sm",
                    isExpanded ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.description}
                </span>

                <span className="mt-1 block text-xs leading-snug text-white/65 md:hidden">
                  {isExpanded ? item.description : null}
                </span>

                {isActive && (
                  <span className="mt-2 hidden items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#a8e63e] md:flex">
                    <i aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#a8e63e]" />
                    ACTIVE · SYSTEM CONNECTED
                  </span>
                )}
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "ml-auto shrink-0 text-white/50 transition-transform duration-300 md:ml-0 md:mt-3",
                  isExpanded && "translate-x-1 text-[#a8e63e]",
                )}
              >
                →
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ExpandingCards

