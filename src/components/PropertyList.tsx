interface PropertyListProps {
  propertyIds: string[]
  properties: SyncedMap<Property>
  updateProperty: (propertyId: string, property: Property) => void
  deleteProperty: (propertyId: string) => void
  moveUpProperty: (propertyId: string) => void
  moveDownProperty: (propertyId: string) => void
}

const PropertyList = (props: PropertyListProps) => (
  <AutoLayout spacing={6} direction="vertical">
    {props.propertyIds.map((propertyId, index) => {
      const property = props.properties.get(propertyId)
      return (
        <PropertyRow
          key={propertyId}
          property={property}
          propertyId={propertyId}
          updateProperty={(changes) => {
            props.updateProperty(propertyId, {...property, ...changes})
          }}
          canMoveUp={index > 0}
          canMoveDown={index < props.propertyIds.length - 1}
          moveUpProperty={() => props.moveUpProperty(propertyId)}
          moveDownProperty={() => props.moveDownProperty(propertyId)}
          deleteProperty={() => props.deleteProperty(propertyId)}
        />
      )
    })}
  </AutoLayout>
)
