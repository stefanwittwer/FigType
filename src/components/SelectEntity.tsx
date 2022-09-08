interface SelectEntityProps {
    availableEntities: any
    onSelect: (widget: WidgetNode) => void
}

const SelectEntity = (props: SelectEntityProps) => {
    return (
        <AutoLayout spacing={6} direction="vertical">
            {props.availableEntities.map(entity => {
                return <EntityRow entity={entity} onSelect={props.onSelect}/>
            })}
        </AutoLayout>
    )
}