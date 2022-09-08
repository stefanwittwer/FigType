const EntityRow = (props: EntityRowProps) => {
    const title = props.entity["title"]

    return (
        <AutoLayout direction={"horizontal"} verticalAlignItems="center" spacing={4}>
            <IconButton icon={AddIcon} onClick={() => {
                props.onSelect(props.entity)
            }}
            />
            <Text fontSize={13}>{title}</Text>
        </AutoLayout>
    )
}

interface EntityRowProps {
    entity: any
    onSelect: (entity: any) => void
}
