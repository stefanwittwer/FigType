interface RelationListProps {
    relationIds: string[]
    relations: SyncedMap<Relation>
    deleteRelation: (relationId: string) => void
    moveUpRelation: (relationId: string) => void
    moveDownRelation: (relationId: string) => void
    toggleRelatedProperty: (relationId: string, propertyId: string) => void
}

const RelationList = (props: RelationListProps) => {
    const [showRelatedProperties, setShowRelatedProperties] = useSyncedState("showRelatedProperties", false)

    return (
        <AutoLayout spacing={6} direction="vertical">
            <AutoLayout spacing={6} verticalAlignItems="center">
                <AutoLayout onClick={() => {
                    setShowRelatedProperties(!showRelatedProperties)
                }}>
                    {showRelatedProperties ?
                        <EnabledIcon sizeAttributes='width="24px" height="24px"'/> :
                        <DisabledIcon sizeAttributes='width="24px" height="24px"'/>
                    }
                </AutoLayout>
                <Text fontSize={13}>Show relation details</Text>
            </AutoLayout>
            {props.relationIds.map((relationId, index) => {
                const relation = props.relations.get(relationId)
                return (
                    <RelationRow
                        key={relationId}
                        relation={relation}
                        relationId={relationId}
                        updateRelation={(changes) =>
                            props.relations.set(relationId, {...relation, ...changes})
                        }
                        canMoveUp={index > 0}
                        canMoveDown={index < props.relationIds.length - 1}
                        moveUpProperty={() => props.moveUpRelation(relationId)}
                        moveDownProperty={() => props.moveDownRelation(relationId)}
                        deleteProperty={() => props.deleteRelation(relationId)}
                        toggleRelatedProperty={props.toggleRelatedProperty}
                        showProperties={showRelatedProperties}
                    />
                )
            })}
        </AutoLayout>
    )
}
