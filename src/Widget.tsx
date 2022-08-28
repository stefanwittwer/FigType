const { widget } = figma
const { useSyncedState, useSyncedMap, usePropertyMenu, AutoLayout, Frame, Input, SVG, Text, waitForTask } =
  widget

const Widget = () => {
  const [title, setTitle] = useSyncedState("title", "")
  const [description, setDescription] = useSyncedState("description", "")

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
  const moveProperty = (propertyId: string, offset: 1 | -1) => {
    const idx = propertyIds.indexOf(propertyId)
    if (idx == -1 || idx + offset >= propertyIds.length || idx + offset <= -1) {
      return;
    }
    const cpy = [...propertyIds];
    [cpy[idx], cpy[idx + offset]] = [cpy[idx + offset], cpy[idx]];
    setPropertyIds(cpy)
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
      <EnitityDetails
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
      />
      {propertyIds.length === 0 ? (
        <PropertiesEmptyState />
      ) : (
        <PropertyList
          properties={properties}
          propertyIds={propertyIds}
          deleteProperty={deleteProperty}
          moveDownProperty={(propertyId) => moveProperty(propertyId, 1)}
          moveUpProperty={(propertyId) => moveProperty(propertyId, -1)}
        />
      )}
    </WidgetContainer>
  )
}
