import { useEffect, useState } from "react"
import "./InfrastructureFlow.css"
import MagneticButton from "./MagneticButton"
import SystemStatus from "./SystemStatus"

type FlowNode = {
  id: string
  label: string
  description: string
  role: string
  connection: string
}

const flowNodes: FlowNode[] = [
  {
    id: "internet",
    label: "INTERNET",
    description: "Incoming business connectivity.",
    role: "INCOMING BUSINESS CONNECTIVITY",
    connection: "FIREWALL",
  },
  {
    id: "firewall",
    label: "FIREWALL",
    description: "Network edge and secure infrastructure deployment.",
    role: "NETWORK EDGE SECURITY",
    connection: "CORE SWITCH",
  },
  {
    id: "core-switch",
    label: "CORE SWITCH",
    description: "Central network distribution.",
    role: "CENTRAL NETWORK DISTRIBUTION",
    connection: "IDF / MDF",
  },
  {
    id: "idf-mdf",
    label: "IDF / MDF",
    description: "Organized racks, patch panels, cabling and equipment.",
    role: "STRUCTURED EQUIPMENT DISTRIBUTION",
    connection: "ACCESS POINTS",
  },
  {
    id: "access-points",
    label: "ACCESS POINTS",
    description: "Professional wireless infrastructure deployment.",
    role: "WIRELESS COVERAGE",
    connection: "BUSINESS DEVICES",
  },
  {
    id: "business-devices",
    label: "BUSINESS DEVICES",
    description: "Workstations, phones, displays, cameras and connected systems.",
    role: "CONNECTED WORKPLACE SYSTEMS",
    connection: "ENDPOINTS",
  },
]

const rackParts = [
  ["PATCH PANEL", "Organizes incoming copper and fiber terminations."],
  ["CORE SWITCH", "Directs traffic between network zones."],
  ["FIBER", "Carries high-capacity connections between spaces."],
  ["CABLE MANAGEMENT", "Keeps pathways labeled, serviceable and clear."],
  ["UPS", "Supports continuity for critical equipment."],
]

const connectionPaths = [
  "M 116 140 C 158 140, 198 140, 244 140",
  "M 326 140 C 368 140, 408 140, 454 140",
  "M 536 140 C 578 140, 618 140, 664 140",
  "M 746 140 C 788 140, 828 140, 874 140",
  "M 956 140 C 996 140, 1038 140, 1084 140",
]

function InfrastructureFlow() {
  const [isActive, setIsActive] = useState(false)
  const [selectedNode, setSelectedNode] = useState(flowNodes[0])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [activeRackPart, setActiveRackPart] = useState(rackParts[0][0])

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".infrastructureFlow")

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.28 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const handleNodeSelect = (node: FlowNode) => setSelectedNode(node)
  const focusedNodeId = hoveredNode ?? selectedNode.id
  const focusedNodeIndex = flowNodes.findIndex((node) => node.id === focusedNodeId)

  return (
    <section className="infrastructureFlow" aria-labelledby="flow-title">
      <div className="flowIntro" data-reveal>
        <span className="sectionKicker">HOW IT CONNECTS</span>
        <h2 id="flow-title">Infrastructure designed<br />as one connected system.</h2>
        <p>
          From the incoming connection to the devices your team uses every day,
          EVO+ builds organized infrastructure designed to work together.
        </p>
        <MagneticButton className="flowCta">
          EXPLORE OUR SERVICES <span aria-hidden="true">→</span>
        </MagneticButton>

        <SystemStatus>NETWORK ACTIVE</SystemStatus>
      </div>

      <div className={`flowDiagram${isActive ? " flowIsActive" : ""}`}>
        <svg className="flowSvg" viewBox="0 0 1200 280" role="img" aria-label="Business infrastructure flow from internet to connected devices">
          <g className="flowConnections">
            {connectionPaths.map((path, index) => (
              <g
                key={path}
                className={`flowConnection connection-${index}${index === focusedNodeIndex || index === focusedNodeIndex - 1 ? " pathActive" : ""}${focusedNodeId ? " pathDimmed" : ""}`}
              >
                <path className="flowTrack" d={path} />
                <path className="flowPulsePath" d={path} pathLength="1" />
              </g>
            ))}
          </g>

          {flowNodes.map((node, index) => (
            <g
              className={`flowSvgNode node-${index}${selectedNode.id === node.id ? " nodeSelected" : ""}${focusedNodeId !== node.id ? " nodeDimmed" : ""}`}
              key={node.id}
              onClick={() => handleNodeSelect(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${node.label}`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") handleNodeSelect(node)
              }}
            >
              <rect className="nodePlate" x={index * 210 + 28} y="98" width="88" height="84" rx="2" />
              <circle className="nodePort" cx={index * 210 + 72} cy="140" r="9" />
              <text x={index * 210 + 72} y="215" textAnchor="middle">{node.label}</text>
            </g>
          ))}
        </svg>

        <div className="flowMobileNodes">
          {flowNodes.map((node, index) => (
            <div className="mobileFlowStep" key={node.id}>
              <button
                className={`mobileFlowNode${selectedNode.id === node.id ? " nodeSelected" : ""}${focusedNodeId !== node.id ? " nodeDimmed" : ""}`}
                onClick={() => handleNodeSelect(node)}
                aria-pressed={selectedNode.id === node.id}
              >
                <span className="mobileNodeIndex">0{index + 1}</span>
                <span>{node.label}</span>
                <span className="mobileNodeDot" aria-hidden="true" />
              </button>
              {index < flowNodes.length - 1 && (
                <span
                  className={`mobileFlowConnector${index === focusedNodeIndex || index === focusedNodeIndex - 1 ? " connectorActive" : " connectorDimmed"}`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flowInfo" key={selectedNode.id} aria-live="polite">
        <span className="flowInfoIndex">{String(flowNodes.indexOf(selectedNode) + 1).padStart(2, "0")}</span>
        <div>
          <strong>{selectedNode.label}</strong>
          <p>{selectedNode.description}</p>
          <dl className="flowMeta">
            <div><dt>STATUS</dt><dd>ACTIVE</dd></div>
            <div><dt>ROLE</dt><dd>{selectedNode.role}</dd></div>
            <div><dt>CONNECTION</dt><dd>{selectedNode.connection}</dd></div>
          </dl>
        </div>
      </div>

      {selectedNode.id === "idf-mdf" && (
        <div className="rackDetail">
          <div className="rackHeader">
            <SystemStatus>INFRASTRUCTURE OPTIMAL</SystemStatus>
            <span>RACK DETAIL / IDF-MDF</span>
          </div>
          <div className="rackBody">
            <div className="rackVisual" aria-label="Conceptual infrastructure rack">
              {rackParts.map(([label], index) => (
                <button
                  className={`rackPart${activeRackPart === label ? " rackPartActive" : ""}`}
                  key={label}
                  onMouseEnter={() => setActiveRackPart(label)}
                  onFocus={() => setActiveRackPart(label)}
                  onClick={() => setActiveRackPart(label)}
                  aria-label={label}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true" />
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
            <p className="rackDescription">{rackParts.find(([label]) => label === activeRackPart)?.[1]}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default InfrastructureFlow
