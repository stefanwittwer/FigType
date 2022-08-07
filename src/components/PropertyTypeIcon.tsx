const PropertyTypeIcon = (props: { type: PropertyType; size?: number }) => {
  const size = props.size ?? 24
  const sizeAttributes = `width="${size}" height="${size}"`
  switch (props.type) {
    case "string":
      return <TypeIconString sizeAttributes={sizeAttributes} />
    case "boolean":
      return <TypeIconBoolean sizeAttributes={sizeAttributes} />
    case "number":
      return <TypeIconNumber sizeAttributes={sizeAttributes} />
    case "timestamp":
      return <TypeIconTimestamp sizeAttributes={sizeAttributes} />
    case "array":
      return <TypeIconArray sizeAttributes={sizeAttributes} />
    case "function":
      return <TypeIconFunction sizeAttributes={sizeAttributes} />
    case "enum":
      return <TypeIconEnum sizeAttributes={sizeAttributes} />
    case "id":
      return <TypeIconID sizeAttributes={sizeAttributes} />
    case "mixed":
    default:
      return <TypeIconMixed sizeAttributes={sizeAttributes} />
  }
}
