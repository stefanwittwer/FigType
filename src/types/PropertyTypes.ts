const PropertyTypes = [
  "string",
  "boolean",
  "number",
  "timestamp",
  "mixed",
  "array",
  "function",
  "enum",
  "id",
] as const

type PropertyType = typeof PropertyTypes[number]
