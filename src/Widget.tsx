const { widget } = figma
const { useSyncedState, useSyncedMap, usePropertyMenu, AutoLayout, Input, SVG, Text, waitForTask } =
  widget

const Widget = () => {
  const [title, setTitle] = useSyncedState("title", "")

  const [propertyIds, setPropertyIds] = useSyncedState<string[]>("propertyKeys", [])
  const properties = useSyncedMap<Property>("properties")

  const [typeToAdd, setTypeToAdd] = useSyncedState<PropertyType>("typeToAdd", "string")

  const addProperty = () => {
    const propertyId = randomId()
    properties.set(propertyId, { title: "", type: typeToAdd })
    setPropertyIds([...propertyIds, propertyId])
  }
  const deleteProperty = (propertyToDelete: string) => {
    properties.delete(propertyToDelete)
    setPropertyIds([...propertyIds].filter((propertyId) => propertyId !== propertyToDelete))
  }

  usePropertyMenu(
    [
      {
        itemType: "dropdown",
        propertyName: "property-type",
        options: PropertyTypes.map((type) => ({
          label: PROPERTY_TYPE_DISPLAY_NAMES[type],
          option: type,
        })),
        selectedOption: typeToAdd,
        tooltip: "Property type to add",
      },
      {
        itemType: "action",
        propertyName: "add",
        tooltip: "Add",
        icon: AddIconLightSvg,
      },
    ],
    (event) => {
      if (event.propertyName === "add") {
        addProperty()
      } else if (event.propertyName === "property-type" && event.propertyValue) {
        setTypeToAdd(event.propertyValue as PropertyType)
      }
    },
  )

  return (
    <WidgetContainer>
      <Input
        value={title}
        onTextEditEnd={(e) => setTitle(e.characters)}
        placeholder="Entity name"
        width={370}
      />
      {propertyIds.length === 0 ? (
        <PropertiesEmptyState />
      ) : (
        <PropertyList
          properties={properties}
          propertyIds={propertyIds}
          deleteProperty={deleteProperty}
        />
      )}
    </WidgetContainer>
  )
}
