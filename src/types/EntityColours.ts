const EntityColours = {
  None: "#FFF",
  Red: "#FA2626",
  Yellow: "#FFC000",
  Green: "#04A740",
  Blue: "#0463A7",
  Purple: "#620CE2",
  Magenta: "#E20CAA",
  Concrete: "#91A0AC",
} as const

type EntityColourName = keyof typeof EntityColours
