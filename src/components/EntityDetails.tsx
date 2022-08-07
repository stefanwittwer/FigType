interface EntityDetailsProps {
  title: string
  description: string
  setTitle: (title: string) => void
  setDescription: (description: string) => void
}

const EnitityDetails = (props: EntityDetailsProps) => (
  <AutoLayout direction="vertical" spacing={10} padding={{ bottom: 2 }}>
    <Input
      value={props.title}
      onTextEditEnd={(e) => props.setTitle(e.characters)}
      placeholder="Entity name"
      width={370}
      fontSize={18}
    />
    <Input
      value={props.description}
      onTextEditEnd={(e) => props.setDescription(e.characters)}
      placeholder="Describe your entity here (e.g. what it represents)"
      width={370}
      fontSize={12.5}
      fontWeight={400}
      lineHeight={20}
    />
  </AutoLayout>
)
