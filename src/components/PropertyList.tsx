interface PropertyListProps {
  propertyIds: string[]
  properties: SyncedMap<Property>
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
          canMoveDown={index < props.propertyIds.length - 1}
          canMoveUp={index > 0}
          updateProperty={(changes) =>
            props.properties.set(propertyId, { ...property, ...changes })
          }
          moveDownProperty={() => props.moveDownProperty(propertyId)}
          moveUpProperty={() => props.moveUpProperty(propertyId)}
          deleteProperty={() => props.deleteProperty(propertyId)}
        />
      )
    })}
  </AutoLayout>
)
