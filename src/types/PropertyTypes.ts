const PropertyTypes = [
  "string",
  "boolean",
  "number",
  "timestamp",
  "object",
  "array",
  "function",
  "enum",
  "id",
  "richtext",
  "media",
  "link",
  "relation"
] as const

type PropertyType = typeof PropertyTypes[number]
