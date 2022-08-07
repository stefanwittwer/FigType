const TypeIconRichText = (props: { sizeAttributes: string }) => (
  <SVG
    src={
      "<svg " +
      props.sizeAttributes +
      ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="5.3" x2="12" y2="5.3" stroke="black" stroke-width="1.4"/><line x1="4" y1="9.8" x2="20" y2="9.8" stroke="black" stroke-width="1.4"/><line x1="4" y1="12.8" x2="20" y2="12.8" stroke="black" stroke-width="1.4"/><line x1="4" y1="15.8" x2="11" y2="15.8" stroke="black" stroke-width="1.4"/><mask id="path-5-inside-1_6_279" fill="white"><rect x="13" y="15" width="7" height="5.5" rx="1"/></mask><rect x="13" y="15" width="7" height="5.5" rx="1" stroke="black" stroke-width="2.8" mask="url(#path-5-inside-1_6_279)"/></svg>'
    }
  />
)
