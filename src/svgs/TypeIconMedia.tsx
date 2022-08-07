const TypeIconMedia = (props: { sizeAttributes: string }) => (
  <SVG
    src={
      "<svg " +
      props.sizeAttributes +
      ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_7_287" fill="white"><rect x="3" y="4" width="18" height="16" rx="1"/></mask><rect x="3" y="4" width="18" height="16" rx="1" stroke="black" stroke-width="2.8" mask="url(#path-1-inside-1_7_287)"/><path d="M4 16L9 10.5L17 19" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 14.5L15 12.5L20 18" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="9" r="1.5" stroke="black"/></svg>'
    }
  />
)
