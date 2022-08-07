interface WidgetContainerProps {
  children?: FigmaDeclarativeNode | FigmaDeclarativeNode[]
}

const WidgetContainer = (props: WidgetContainerProps) => (
  <AutoLayout
    direction="vertical"
    verticalAlignItems="center"
    spacing={16}
    padding={16}
    cornerRadius={8}
    fill="#FFFFFF"
    effect={[
      {
        type: "drop-shadow",
        blur: 5,
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 3 },
      },
      {
        type: "drop-shadow",
        blur: 2,
        color: { r: 0, g: 0, b: 0, a: 0.15 },
        offset: { x: 0, y: 0 },
      },
    ]}
  >
    {props.children}
  </AutoLayout>
)
