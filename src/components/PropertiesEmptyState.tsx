const PropertiesEmptyState = () => (
  <AutoLayout direction="vertical" spacing={18} width={370}>
    <AutoLayout direction="vertical" spacing={10} padding={{ top: 8 }}>
      <PlaceholderRow />
      <PlaceholderRow opacity={0.6} />
      <PlaceholderRow opacity={0.3} />
    </AutoLayout>
    <Text fontSize={12} opacity={0.6} width={370} lineHeight={20}>
      Pick a type and click the plus icon in the widget menu to add your first property.
    </Text>
  </AutoLayout>
)
