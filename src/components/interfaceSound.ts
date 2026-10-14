export type InterfaceSoundEvent = "hover" | "select" | "connect"

export type InterfaceSoundBus = {
  emit: (event: InterfaceSoundEvent) => void
}

export const interfaceSound: InterfaceSoundBus = {
  emit: () => undefined,
}
