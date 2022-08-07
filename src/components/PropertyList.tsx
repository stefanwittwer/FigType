interface PropertyListProps {
  propertyIds: string[]
  properties: SyncedMap<Property>
  deleteProperty: (propertyId: string) => void
}

const PropertyList = (props: PropertyListProps) => (
  <AutoLayout spacing={6} direction="vertical">
    {props.propertyIds.map((propertyId) => {
      const property = props.properties.get(propertyId)
      return (
        <PropertyRow
          key={propertyId}
          property={property}
          updateProperty={(changes) =>
            props.properties.set(propertyId, { ...property, ...changes })
          }
          deleteProperty={() => props.deleteProperty(propertyId)}
        />
      )
    })}
  </AutoLayout>
)
