function PlaceholderRow(props: { opacity?: number }) {
  return (
    <SVG
      opacity={props.opacity ?? 1}
      src='<svg width="364" height="20" viewBox="0 0 364 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="5" fill="#D9D9D9"/><rect width="20" height="20" rx="5" fill="#D9D9D9"/><rect x="31" y="7" width="135" height="7" rx="3.5" fill="#D9D9D9"/><rect x="204" y="7" width="87" height="7" rx="3.5" fill="#D9D9D9"/><circle cx="356.5" cy="10.5" r="6.625" stroke="#D9D9D9" stroke-width="1.75"/><line x1="353.875" y1="10.625" x2="359.125" y2="10.625" stroke="#D9D9D9" stroke-width="1.75" stroke-linecap="round"/></svg>'
    />
  )
}
