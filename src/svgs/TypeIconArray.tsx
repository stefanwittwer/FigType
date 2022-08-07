const TypeIconArray = (props: { sizeAttributes: string }) => (
  <SVG
    src={
      "<svg " +
      props.sizeAttributes +
      ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.03025 19.76V4.72H8.87025V5.856H6.29425V18.624H8.87025V19.76H5.03025ZM15.136 19.76V18.624H17.712V5.856H15.136V4.72H18.976V19.76H15.136Z" fill="black"/></svg>'
    }
  />
)
