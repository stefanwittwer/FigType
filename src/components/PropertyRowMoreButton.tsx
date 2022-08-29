interface PropertyRowMoreButtonProps {
  propertyId: string
  canMoveUp: boolean
  canMoveDown: boolean
  moveUpProperty: () => void
  moveDownProperty: () => void
  deleteProperty: () => void
}

const PropertyRowMoreButton = (props: PropertyRowMoreButtonProps) => {
  const [expandedPropertyId, setExpandedPropertyId] = useSyncedState("expandedPropertyId", null)

  const isExpanded = expandedPropertyId == props.propertyId
  const toggleExpandedPropertyId = () => setExpandedPropertyId(isExpanded ? null : props.propertyId)

  return (
    <>
      {isExpanded && (
        <Frame
          height={26}
          width={89}
          stroke="#D9D9D9"
          fill="#fff"
          positioning="absolute"
          x={252}
          y={0}
          cornerRadius={{
            topLeft: 4,
            topRight: 0,
            bottomLeft: 4,
            bottomRight: 0,
          }}
        >
          <AutoLayout horizontalAlignItems="center" spacing={2}>
            <IconButton icon={RemoveIcon} onClick={props.deleteProperty} />
            <IconButton
              disabled={!props.canMoveUp}
              icon={MoveUpIcon}
              onClick={props.moveUpProperty}
            />
            <IconButton
              disabled={!props.canMoveDown}
              icon={MoveDownIcon}
              onClick={props.moveDownProperty}
            />
          </AutoLayout>
        </Frame>
      )}
      <AutoLayout
        stroke={isExpanded ? "#D9D9D9" : null}
        cornerRadius={{
          topLeft: 0,
          topRight: isExpanded ? 4 : 0,
          bottomLeft: 0,
          bottomRight: isExpanded ? 4 : 0,
        }}
        strokeWidth={1}
        horizontalAlignItems="center"
      >
        <AutoLayout
          width={28}
          opacity={isExpanded ? 0.8 : 0.3}
          fill={isExpanded ? "#eee" : undefined}
          cornerRadius={4}
          padding={4}
          hoverStyle={{ opacity: 1, fill: isExpanded ? "#D9D9D9" : "#eee" }}
          onClick={toggleExpandedPropertyId}
        >
          <MoreIcon />
        </AutoLayout>
      </AutoLayout>
    </>
  )
}
