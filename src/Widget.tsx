const { widget } = figma
const {
  useSyncedState,
  useSyncedMap,
  usePropertyMenu,
  AutoLayout,
  Frame,
  Input,
  SVG,
  Text,
  waitForTask,
  Line,
} = widget

const Widget = () => {
  const [title, setTitle] = useSyncedState("title", "")
  const [entityId, setEntityId] = useSyncedState("entityId", "")
  const [description, setDescription] = useSyncedState("description", "")
  const [colour, setColour] = useSyncedState<string>("colour", EntityColours.None)

  const [propertyIds, setPropertyIds] = useSyncedState<string[]>("propertyKeys", [])
  const properties = useSyncedMap<Property>("properties")

  const [relationIds, setRelationIds] = useSyncedState<string[]>("relationKeys", [])
  const relations = useSyncedMap<Relation>("relations")
  const [availableEntities, setAvailableEntities] = useSyncedState("availableEntities", [])

  const [typeToAdd, setTypeToAdd] = useSyncedState<PropertyType>("typeToAdd", "string")

  const assignEntityId = () => {
    setEntityId(randomId())
  }

  const addProperty = () => {
    const propertyId = randomId()
    if (typeToAdd === "relation") {
      let collectedEntities = []
      figma.root.children.forEach(page => {
        collectedEntities = [...collectedEntities, ...page.findWidgetNodesByWidgetId(figma.widgetId).map(widget => widget.widgetSyncedState)]
      })

      setAvailableEntities(collectedEntities)
    } else {
      properties.set(propertyId, {title: "", type: typeToAdd})
      setPropertyIds([...propertyIds, propertyId])
    }
  }
  const deleteProperty = (propertyToDelete: string) => {
    properties.delete(propertyToDelete)
    setPropertyIds([...propertyIds].filter((propertyId) => propertyId !== propertyToDelete))
  }
  const moveProperty = (propertyId: string, offset: 1 | -1) => {
    const idx = propertyIds.indexOf(propertyId)
    if (idx == -1 || idx + offset >= propertyIds.length || idx + offset <= -1) {
      return
    }
    const cpy = [...propertyIds]
    ;[cpy[idx], cpy[idx + offset]] = [cpy[idx + offset], cpy[idx]]
    setPropertyIds(cpy)
  }

  const addRelation = (entityToAdd: any) => {
    const relationId = randomId()
    const properties:any = []
    const relatedPropertyIds = entityToAdd["propertyKeys"]
    const relatedProperties = entityToAdd["properties"]

    relatedPropertyIds.forEach(propertyId => {
      properties.push({...relatedProperties[propertyId], propertyId: propertyId})
    })

    const relation: Relation = {
      title: "",
      relatedEntity: entityToAdd["entityId"],
      relatedTitle: entityToAdd["title"],
      relatedProperties: properties,
      relatedPropertiesSelected: relatedPropertyIds,
      type: typeToAdd
    }

    relations.set(relationId, relation)
    setRelationIds([...relationIds, relationId])
    setAvailableEntities([])
  }

  const toggleRelatedProperty = (relationId: string, propertyId: string) => {
    const relation = relations.get(relationId)
    const index = relation.relatedPropertiesSelected.findIndex(id => id === propertyId)

    if (index === -1) {
      relation.relatedPropertiesSelected = [...relation.relatedPropertiesSelected, propertyId]
    } else {
      relation.relatedPropertiesSelected.splice(index, 1)
    }

    relations.set(relationId, relation)
  }

  const deleteRelation = (relationToDelete: string) => {
    relations.delete(relationToDelete)
    setRelationIds([...relationIds].filter((relationId) => relationId !== relationToDelete))
  }

  const moveRelation = (relationId: string, offset: 1 | -1) => {
    const idx = relationIds.indexOf(relationId)
    if (idx == -1 || idx + offset >= relationIds.length || idx + offset <= -1) {
      return
    }
    const cpy = [...relationIds]
    ;[cpy[idx], cpy[idx + offset]] = [cpy[idx + offset], cpy[idx]]
    setRelationIds(cpy)
  }

  usePropertyMenu(
    [
      {
        itemType: "color-selector",
        tooltip: "Entity colour",
        options: Object.keys(EntityColours).map((colourOption) => ({
          option: EntityColours[colourOption],
          tooltip: colourOption,
        })),
        propertyName: "entity-colour",
        selectedOption: colour,
      },
      {
        itemType: "separator",
      },
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
      } else if (event.propertyName === "entity-colour" && event.propertyValue) {
        setColour(event.propertyValue)
      }
    },
  )

  return (
    <WidgetContainer keyColour={colour}>
      <EnitityDetails
        title={title}
        description={description}
        setTitle={(title) => {
          setTitle(title)
          assignEntityId()
        }}
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

      <Line strokeWidth={2} length={370} opacity={0.1} />

      {availableEntities.length !== 0 &&
          <SelectEntity onSelect={addRelation} availableEntities={availableEntities} />
      }

      {
          availableEntities.length === 0 &&
          relationIds.length === 0 &&
          propertyIds.length === 0 &&
          <RelationsEmptyState />
      }

      {relationIds.length !== 0 &&
          <RelationList
              relations={relations}
              relationIds={relationIds}
              deleteRelation={deleteRelation}
              moveDownRelation={(relationId) => moveRelation(relationId, 1)}
              moveUpRelation={(relationId) => moveRelation(relationId, -1)}
              toggleRelatedProperty={toggleRelatedProperty}
          />
      }
    </WidgetContainer>
  )
}
