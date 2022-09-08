interface RelationRowProps {
    relationId: string
    canMoveDown: boolean
    canMoveUp: boolean
    relation: Relation
    updateRelation: (changes: Partial<Relation>) => void
    deleteProperty: () => void
    moveUpProperty: () => void
    moveDownProperty: () => void
    toggleRelatedProperty: (relationId: string, propertyId: string) => void
    showProperties: boolean
}

const RelationRow = (props: RelationRowProps) => {
    const relatedPropertyActive = (propertyId: string) => {
        return props.relation.relatedPropertiesSelected.findIndex(id => id === propertyId) !== -1
    }

    const focusRelation = (entityId: string) => {
        let allWidgets = []
        figma.root.children.forEach(page => {
            allWidgets = [...allWidgets, ...page.findWidgetNodesByWidgetId(figma.widgetId).map(widget => {return {widget: widget, widgetState: widget.widgetSyncedState}})]
        })

        const results = allWidgets.filter(widget => {
            return widget.widgetState["entityId"] === entityId
        })

        if (results.length === 1) {
            const widgetToFocus = results[0]

            figma.viewport.scrollAndZoomIntoView([widgetToFocus.widget])
        }
    }

    const hasCustomTypeInfo =
        props.relation.type === "array" ||
        props.relation.type === "object" ||
        props.relation.type === "enum"
    return (
        <AutoLayout padding={{bottom: 2}}>
            <AutoLayout direction="vertical" fill={"#f5f5f5"} padding={6}>
                <AutoLayout verticalAlignItems="center" spacing={12}>
                    <PropertyTypeIcon size={20} type={props.relation.type}/>
                    <Input
                        value={props.relation.title}
                        fontSize={13}
                        width={164}
                        fontWeight={400}
                        onTextEditEnd={(e) => props.updateRelation({title: e.characters})}
                        placeholder="Relation name"
                    />
                    <AutoLayout width={120}>
                        {hasCustomTypeInfo ? (
                            <AutoLayout spacing={8}>
                                <Input
                                    fontSize={13}
                                    opacity={0.6}
                                    value={props.relation.customTypeInfo ?? ""}
                                    onTextEditEnd={(e) => props.updateRelation({customTypeInfo: e.characters})}
                                    placeholder={`Enter ${props.relation.type.toLowerCase()} type`}
                                    placeholderProps={{opacity: 0.3}}
                                    width={props.relation.type === "array" ? 100 : 120}
                                />
                                {props.relation.type === "array" && (
                                    <Text fontSize={13} opacity={0.6} letterSpacing={3}>
                                        {"[]"}
                                    </Text>
                                )}
                            </AutoLayout>
                        ) : (
                            <AutoLayout verticalAlignItems="center" opacity={0.6} hoverStyle={{opacity: 1}} spacing={2} onClick={() => {focusRelation(props.relation.relatedEntity)}}>
                                <Text fontSize={13}>
                                    {props.relation.relatedTitle}
                                </Text>
                                <ArrowRightIcon sizeAttributes={'width="24px" height="24px"'}/>
                            </AutoLayout>
                        )}
                    </AutoLayout>
                    <PropertyRowMoreButton
                        propertyId={props.relationId}
                        canMoveUp={props.canMoveUp}
                        canMoveDown={props.canMoveDown}
                        moveUpProperty={() => props.moveUpProperty()}
                        moveDownProperty={() => props.moveDownProperty()}
                        deleteProperty={() => props.deleteProperty()}
                    />
                </AutoLayout>
                <AutoLayout hidden={!props.showProperties} direction="vertical" verticalAlignItems="center" padding={{left: 34}}>
                    {props.relation.relatedProperties.length !== 0 &&
                        props.relation.relatedProperties.map((property: any) => {
                            return (
                                <AutoLayout opacity={relatedPropertyActive(property.propertyId) ? 1 : 0.3}>
                                    <AutoLayout verticalAlignItems="center" spacing={10}>
                                        <Text width={164} fontSize={13} opacity={0.6}>{props.relation.relatedTitle}.{property.title}</Text>
                                        <Text width={120} fontSize={13} opacity={0.6}>{property.type}</Text>

                                        <AutoLayout onClick={(event) => {
                                            props.toggleRelatedProperty(props.relationId, property.propertyId)
                                        }}>
                                            {relatedPropertyActive(property.propertyId) ?
                                                <EnabledIcon sizeAttributes='width="24px" height="24px"'/> :
                                                <DisabledIcon sizeAttributes='width="24px" height="24px"'/>
                                            }
                                        </AutoLayout>
                                    </AutoLayout>
                                </AutoLayout>
                            )
                        })
                    }

                    {/*<Text width={120} fontSize={13} opacity={0.6} >{props.relation.relatedTitle}</Text>*/}
                    {/*<Text fontSize={13} opacity={0.6} >{props.relation.relatedTitle}</Text>*/}
                </AutoLayout>
            </AutoLayout>
        </AutoLayout>
    )
}
