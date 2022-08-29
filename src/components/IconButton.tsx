interface IconButtonProps {
  icon: () => SVG
  disabled?: boolean
  onClick: () => void
}

const IconButton = (props: IconButtonProps) => {
  const Icon = props.icon
  return (
    <AutoLayout
      width={28}
      horizontalAlignItems="center"
      opacity={props.disabled ? 0.1 : 0.3}
      cornerRadius={4}
      padding={4}
      hoverStyle={!props.disabled ? { opacity: 1, fill: "#eee" } : {}}
      onClick={props.disabled ? undefined : props.onClick}
    >
      <Icon />
    </AutoLayout>
  )
}
