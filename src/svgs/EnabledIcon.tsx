const EnabledIcon = (props: { sizeAttributes: string }) => (
  <SVG
    src={
        `<svg ${props.sizeAttributes} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="5" width="22" height="11" rx="5" fill="#D9D9D9"/>
            <circle cx="17.5" cy="10.5" r="4.5" fill="#353535"/>
        </svg>`
    }
  />
)
