const TypeIconRelation = (props: { sizeAttributes: string }) => (
  <SVG
    src={
        "<svg " +
        props.sizeAttributes +
        ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="9" width="15" height="9" rx="3.5" stroke="black"/><rect x="7.5" y="4" width="15" height="9" rx="3.5" stroke="black"/></svg>'
    }
  />
)
