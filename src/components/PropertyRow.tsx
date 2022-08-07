interface PropertyRowProps {
  property: Property
  updateProperty: (changes: Partial<Property>) => void
  deleteProperty: () => void
}

const PropertyRow = (props: PropertyRowProps) => {
  const hasCustomTypeInfo =
    props.property.type === "array" ||
    props.property.type === "mixed" ||
    props.property.type === "enum"
  return (
    <AutoLayout verticalAlignItems="center" spacing={12}>
      <PropertyTypeIcon size={20} type={props.property.type} />
      <Input
        value={props.property.title}
        fontSize={13}
        width={164}
        fontWeight={400}
        onTextEditEnd={(e) => props.updateProperty({ title: e.characters })}
        placeholder="Property name"
      />
      <AutoLayout width={120}>
        {hasCustomTypeInfo ? (
          <AutoLayout spacing={8}>
            <Input
              fontSize={13}
              opacity={0.6}
              value={props.property.customTypeInfo ?? ""}
              onTextEditEnd={(e) => props.updateProperty({ customTypeInfo: e.characters })}
              placeholder={`Enter ${props.property.type.toLowerCase()} type`}
              placeholderProps={{ opacity: 0.3 }}
              width={props.property.type === "array" ? 100 : 120}
            />
            {props.property.type === "array" && (
              <Text fontSize={13} opacity={0.6} letterSpacing={3}>
                {"[]"}
              </Text>
            )}
          </AutoLayout>
        ) : (
          <Text fontSize={13} opacity={0.6}>
            {PROPERTY_TYPE_DISPLAY_NAMES[props.property.type] ?? props.property.type}
          </Text>
        )}
      </AutoLayout>
      <AutoLayout
        width={28}
        horizontalAlignItems="center"
        opacity={0.3}
        cornerRadius={4}
        padding={4}
        hoverStyle={{ opacity: 1, fill: "#eee" }}
        onClick={() => props.deleteProperty()}
      >
        <RemoveIcon />
      </AutoLayout>
    </AutoLayout>
  )
}
