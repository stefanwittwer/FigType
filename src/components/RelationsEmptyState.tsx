const RelationsEmptyState = () => (
  <AutoLayout direction="vertical" spacing={18} width={370}>
    <AutoLayout direction="vertical" spacing={10} padding={{ top: 8 }}>
      <PlaceholderRow />
      <PlaceholderRow opacity={0.6} />
      <PlaceholderRow opacity={0.3} />
    </AutoLayout>
    <Text fontSize={12} opacity={0.6} width={370} lineHeight={20}>
      Pick relation from the widget menu and click the plus icon to add your first relation.
    </Text>
  </AutoLayout>
)
