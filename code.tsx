const { widget } = figma;
const {
  useSyncedState,
  useSyncedMap,
  usePropertyMenu,
  AutoLayout,
  Input,
  SVG,
  Text,
  waitForTask,
} = widget;

const PropertyTypes = [
  "string",
  "boolean",
  "number",
  "timestamp",
  "mixed",
  "array",
  "function",
  "enum",
  "id",
] as const;

type PropertyType = typeof PropertyTypes[number];

interface PropertyRowProps {
  property: Property;
  updateProperty: (changes: Partial<Property>) => void;
  deleteProperty: () => void;
}

function PropertyRow(props: PropertyRowProps) {
  const hasCustomTypeInfo =
    props.property.type === "array" ||
    props.property.type === "mixed" ||
    props.property.type === "enum";
  return (
    <AutoLayout verticalAlignItems="center" spacing={12}>
      <PropertyTypeIcon size={20} type={props.property.type} />
      <Input
        value={props.property.title}
        fontSize={13}
        width={164}
        fontWeight={400}
        onTextEditEnd={(e) => props.updateProperty({ title: e.characters })}
        placeholder="Property name"
      />
      <AutoLayout width={120}>
        {hasCustomTypeInfo ? (
          <AutoLayout spacing={8}>
            <Input
              fontSize={13}
              opacity={0.6}
              value={props.property.customTypeInfo ?? ""}
              onTextEditEnd={(e) =>
                props.updateProperty({ customTypeInfo: e.characters })
              }
              placeholder={`Enter ${props.property.type.toLowerCase()} type`}
              placeholderProps={{ opacity: 0.3 }}
              width={props.property.type === "array" ? 100 : 120}
            />
            {props.property.type === "array" && (
              <Text fontSize={13} opacity={0.6} letterSpacing={3}>
                {"[]"}
              </Text>
            )}
          </AutoLayout>
        ) : (
          <Text fontSize={13} opacity={0.6}>
            {PROPERTY_TYPE_DISPLAY_NAMES[props.property.type] ??
              props.property.type}
          </Text>
        )}
      </AutoLayout>
      <AutoLayout
        width={28}
        horizontalAlignItems="center"
        opacity={0.3}
        cornerRadius={4}
        padding={4}
        hoverStyle={{ opacity: 1, fill: "#eee" }}
        onClick={() => props.deleteProperty()}
      >
        <SVG src='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="black" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' />
      </AutoLayout>
    </AutoLayout>
  );
}

interface Property {
  title: string;
  type: PropertyType;
  customTypeInfo?: string;
}

const randomId = () => Math.random().toString(36).substring(2, 15);

function Widget() {
  const [title, setTitle] = useSyncedState("title", "");
  const [typeToAdd, setTypeToAdd] = useSyncedState<PropertyType>(
    "typeToAdd",
    "string"
  );

  const [propertyKeys, setPropertyKeys] = useSyncedState<string[]>(
    "propertyKeys",
    []
  );
  const properties = useSyncedMap<Property>("properties");

  const deleteProperty = (propertyToDelete: string) => {
    properties.delete(propertyToDelete);
    setPropertyKeys(
      [...propertyKeys].filter((propertyId) => propertyId !== propertyToDelete)
    );
  };

  usePropertyMenu(
    [
      {
        itemType: "dropdown",
        propertyName: "property-type",
        options: PropertyTypes.map((type) => ({
          label: PROPERTY_TYPE_DISPLAY_NAMES[type],
          option: type,
        })),
        selectedOption: typeToAdd,
        tooltip: "Property type to add",
      },
      {
        itemType: "action",
        propertyName: "add",
        tooltip: "Add",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
      },
    ],
    (event) => {
      waitForTask(
        new Promise((resolve) => {
          setTimeout(() => {
            if (event.propertyName === "add") {
              const propertyId = randomId();
              properties.set(propertyId, { title: "", type: typeToAdd });
              setPropertyKeys([...propertyKeys, propertyId]);
            } else if (
              event.propertyName === "property-type" &&
              event.propertyValue
            ) {
              setTypeToAdd(event.propertyValue as PropertyType);
            }
            resolve(null);
          }, 50);
        })
      );
    }
  );

  return (
    <AutoLayout
      direction="vertical"
      verticalAlignItems="center"
      spacing={16}
      padding={16}
      cornerRadius={8}
      fill="#FFFFFF"
      stroke="#E6E6E6"
    >
      <Input
        value={title}
        onTextEditEnd={(e) => setTitle(e.characters)}
        placeholder="Name of your type"
        width={370}
      />
      {propertyKeys.length === 0 ? (
        <AutoLayout direction="vertical" spacing={18} width={370}>
          <AutoLayout direction="vertical" spacing={10} padding={{ top: 8 }}>
            <PlaceholderRow />
            <PlaceholderRow opacity={0.6} />
            <PlaceholderRow opacity={0.3} />
          </AutoLayout>
          <Text fontSize={12} opacity={0.6} width={370} lineHeight={20}>
            Pick a type and click the plus icon in the widget menu to add your
            first property.
          </Text>
        </AutoLayout>
      ) : (
        <AutoLayout spacing={6} direction="vertical">
          {propertyKeys.map((propertyId) => {
            const property = properties.get(propertyId);
            return (
              <PropertyRow
                key={propertyId}
                property={property}
                updateProperty={(changes) =>
                  properties.set(propertyId, { ...property, ...changes })
                }
                deleteProperty={() => deleteProperty(propertyId)}
              />
            );
          })}
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

const PROPERTY_TYPE_DISPLAY_NAMES: { [key in PropertyType]: string } = {
  string: "Text",
  timestamp: "Timestamp",
  array: "List",
  boolean: "Boolean",
  enum: "Enum",
  function: "Function",
  id: "ID",
  mixed: "Mixed",
  number: "Number",
};

function PropertyTypeIcon(props: { type: PropertyType; size?: number }) {
  const size = props.size ?? 24;
  const sizeAttributes = `width="${size}" height="${size}"`;
  switch (props.type) {
    case "string":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.23013 17.2077C5.66845 17.2077 5.15872 17.1019 4.70092 16.8904C4.24312 16.6749 3.87957 16.3652 3.61027 15.9613C3.34098 15.5535 3.20633 15.0611 3.20633 14.484C3.20633 13.9762 3.30636 13.5646 3.5064 13.2491C3.70645 12.9298 3.97382 12.6797 4.30852 12.4989C4.64321 12.3181 5.01253 12.1835 5.41647 12.095C5.82426 12.0027 6.23397 11.9296 6.64561 11.8757C7.1842 11.8065 7.62084 11.7545 7.95553 11.7199C8.29408 11.6814 8.54029 11.618 8.69417 11.5295C8.8519 11.441 8.93076 11.2871 8.93076 11.0678V11.0217C8.93076 10.4523 8.77496 10.0099 8.46335 9.69443C8.15558 9.37897 7.68816 9.22124 7.06109 9.22124C6.41094 9.22124 5.9012 9.36358 5.53188 9.64826C5.16257 9.93294 4.90289 10.2369 4.75285 10.56L3.46024 10.0984C3.69106 9.55978 3.99883 9.14045 4.38353 8.84038C4.77209 8.53646 5.19527 8.32487 5.65307 8.20561C6.11471 8.08251 6.56867 8.02095 7.01493 8.02095C7.29961 8.02095 7.62661 8.05558 7.99593 8.12482C8.36909 8.19022 8.72879 8.32679 9.07503 8.53454C9.42511 8.74228 9.71557 9.05581 9.94639 9.47514C10.1772 9.89447 10.2926 10.4561 10.2926 11.1602V17H8.93076V15.7997H8.86152C8.76919 15.9921 8.6153 16.1979 8.39987 16.4172C8.18443 16.6365 7.89783 16.823 7.54005 16.9769C7.18227 17.1308 6.74563 17.2077 6.23013 17.2077ZM6.43787 15.9844C6.97646 15.9844 7.43041 15.8786 7.79973 15.667C8.17289 15.4554 8.45373 15.1823 8.64223 14.8476C8.83459 14.5129 8.93076 14.1609 8.93076 13.7915V12.5451C8.87306 12.6143 8.74611 12.6778 8.5499 12.7355C8.35755 12.7894 8.13442 12.8375 7.88052 12.8798C7.63046 12.9183 7.38617 12.9529 7.14765 12.9837C6.91298 13.0106 6.72255 13.0337 6.57636 13.0529C6.22243 13.0991 5.89158 13.1741 5.58382 13.278C5.2799 13.378 5.03369 13.5299 4.84518 13.7338C4.66052 13.9339 4.56819 14.207 4.56819 14.5533C4.56819 15.0265 4.74324 15.3842 5.09332 15.6266C5.44725 15.8651 5.89543 15.9844 6.43787 15.9844ZM12.963 17V5.18182H14.3248V9.54439H14.4402C14.5403 9.39051 14.6788 9.19431 14.8557 8.95579C15.0365 8.71342 15.2943 8.49799 15.629 8.30948C15.9675 8.11713 16.4253 8.02095 17.0024 8.02095C17.7487 8.02095 18.4066 8.20754 18.9759 8.5807C19.5453 8.95387 19.9896 9.48284 20.3089 10.1676C20.6282 10.8524 20.7879 11.6603 20.7879 12.5913C20.7879 13.5299 20.6282 14.3436 20.3089 15.0322C19.9896 15.717 19.5472 16.2479 18.9817 16.6249C18.4162 16.9981 17.7641 17.1847 17.0255 17.1847C16.4561 17.1847 16.0002 17.0904 15.6578 16.9019C15.3154 16.7095 15.0519 16.4922 14.8673 16.2498C14.6826 16.0036 14.5403 15.7997 14.4402 15.6381H14.2787V17H12.963ZM14.3017 12.5682C14.3017 13.2376 14.3998 13.8281 14.596 14.3398C14.7922 14.8476 15.0789 15.2457 15.4559 15.5343C15.8329 15.819 16.2945 15.9613 16.8408 15.9613C17.4102 15.9613 17.8853 15.8113 18.2661 15.5112C18.6509 15.2073 18.9394 14.7995 19.1317 14.2878C19.3279 13.7723 19.426 13.1991 19.426 12.5682C19.426 11.945 19.3299 11.3833 19.1375 10.8832C18.949 10.3792 18.6624 9.98103 18.2777 9.68865C17.8968 9.39243 17.4179 9.24432 16.8408 9.24432C16.2868 9.24432 15.8213 9.38474 15.4443 9.66557C15.0673 9.94256 14.7826 10.3311 14.5903 10.8312C14.3979 11.3275 14.3017 11.9065 14.3017 12.5682Z" fill="black"/><line x1="3.25" y1="20.3333" x2="20.75" y2="20.3333" stroke="black" stroke-width="1.33333"/></svg>'
          }
        />
      );
    case "boolean":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.7" y="3.7" width="16.6" height="16.6" rx="2.675" stroke="black" stroke-width="1.4"/><path d="M7.5 13.3636L10.2 16L16.5 9" stroke="black" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          }
        />
      );
    case "number":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.4192 15.6092V14.4479L8.54242 6.34182H9.38491V8.14064H8.81566L4.94478 14.2657V14.3568H11.8441V15.6092H3.4192ZM8.90674 18V15.2562V14.7154V6.34182H10.2502V18H8.90674ZM13.0155 18V16.9754L16.8636 12.7629C17.3152 12.2696 17.6871 11.8407 17.9793 11.4764C18.2716 11.1083 18.4879 10.763 18.6283 10.4404C18.7725 10.114 18.8446 9.77248 18.8446 9.41575C18.8446 9.00589 18.7459 8.65106 18.5486 8.35126C18.355 8.05146 18.0894 7.81996 17.7516 7.65678C17.4139 7.49359 17.0344 7.412 16.6132 7.412C16.1653 7.412 15.7745 7.50498 15.4405 7.69093C15.1103 7.87309 14.8542 8.12925 14.672 8.45942C14.4937 8.78958 14.4045 9.17667 14.4045 9.62068H13.061C13.061 8.93758 13.2185 8.33798 13.5335 7.82186C13.8485 7.30574 14.2773 6.90347 14.82 6.61506C15.3665 6.32664 15.9794 6.18243 16.6587 6.18243C17.3418 6.18243 17.9471 6.32664 18.4746 6.61506C19.0021 6.90347 19.4157 7.29246 19.7155 7.78201C20.0154 8.27157 20.1653 8.81615 20.1653 9.41575C20.1653 9.84459 20.0875 10.2639 19.9319 10.6738C19.7801 11.0799 19.5144 11.5334 19.1349 12.0343C18.7592 12.5314 18.2374 13.1386 17.5695 13.8559L14.9509 16.6566V16.7477H20.3702V18H13.0155Z" fill="black"/></svg>'
          }
        />
      );
    case "timestamp":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9.4" stroke="black" stroke-width="1.2"/><path d="M11.4737 6.21054V13.0526H16.2105" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          }
        />
      );
    case "array":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.03025 19.76V4.72H8.87025V5.856H6.29425V18.624H8.87025V19.76H5.03025ZM15.136 19.76V18.624H17.712V5.856H15.136V4.72H18.976V19.76H15.136Z" fill="black"/></svg>'
          }
        />
      );
    case "function":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.47 7.70625L11.47 3.33125C11.7943 3.12858 12.2057 3.12858 12.53 3.33125L19.53 7.70625C19.8224 7.88899 20 8.20946 20 8.55425V15.9754C20 16.3039 19.8399 16.611 19.5685 16.7962C16.9881 18.557 13.3091 20.8921 12.2641 21.3999C12.0955 21.4818 11.9157 21.4473 11.7568 21.348L4.47 16.7938C4.17762 16.611 4 16.2905 4 15.9458V8.55425C4 8.20946 4.17762 7.88899 4.47 7.70625Z" stroke="black" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.47058 8.5L12 13L19.5294 8.5" stroke="black" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13V21.5" stroke="black" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          }
        />
      );
    case "enum":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.6" y="12.1" width="11.8" height="8.3" rx="1.4" stroke="black" stroke-width="1.2"/><line x1="6" y1="14.9" x2="13" y2="14.9" stroke="black" stroke-width="1.2"/><line x1="6" y1="17.4" x2="13" y2="17.4" stroke="black" stroke-width="1.2"/><path d="M17.3462 13H18.5C19.6046 13 20.5 12.1046 20.5 11V6C20.5 4.89543 19.6046 4 18.5 4H10.5C9.39543 4 8.5 4.89543 8.5 6V10.4" stroke="black" stroke-width="1.2"/><line x1="11" y1="6.9" x2="18" y2="6.9" stroke="black" stroke-width="1.2"/><line x1="11" y1="9.4" x2="18" y2="9.4" stroke="black" stroke-width="1.2"/></svg>'
          }
        />
      );
    case "id":
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 4.08334C11.5159 4.08334 9.08331 6.51595 9.08331 9.50001C9.08331 9.86765 9.15946 10.2097 9.2298 10.5531L4.26642 15.5164C4.14921 15.6336 4.08334 15.7926 4.08331 15.9583V19.2917C4.08333 19.4574 4.14918 19.6164 4.26639 19.7336C4.3836 19.8508 4.54256 19.9167 4.70831 19.9167H8.04165C8.2074 19.9167 8.36636 19.8508 8.48357 19.7336C8.60078 19.6164 8.66663 19.4574 8.66665 19.2917V18.25H10.125C10.2907 18.25 10.4497 18.1841 10.5669 18.0669C10.6841 17.9497 10.75 17.7908 10.75 17.625V16.1667H12.2083C12.3741 16.1667 12.533 16.1008 12.6502 15.9836C12.7674 15.8664 12.8333 15.7074 12.8333 15.5417V14.6229C13.363 14.7956 13.9149 14.9167 14.5 14.9167C17.484 14.9167 19.9166 12.4841 19.9166 9.50001C19.9166 6.51595 17.484 4.08334 14.5 4.08334ZM14.5 5.33334C16.8084 5.33334 18.6666 7.19157 18.6666 9.50001C18.6666 11.8085 16.8084 13.6667 14.5 13.6667C13.776 13.6667 13.0996 13.4836 12.5078 13.1605C12.4126 13.1086 12.3056 13.0823 12.1971 13.0842C12.0887 13.0862 11.9827 13.1163 11.8894 13.1716C11.7962 13.2269 11.7189 13.3056 11.6653 13.3998C11.6116 13.494 11.5833 13.6006 11.5833 13.709V14.9167H10.125C9.95922 14.9167 9.80026 14.9825 9.68306 15.0998C9.56585 15.217 9.5 15.3759 9.49998 15.5417V17H8.04165C7.87589 17 7.71693 17.0659 7.59972 17.1831C7.48252 17.3003 7.41666 17.4593 7.41665 17.625V18.6667H5.33331V16.2171L10.3284 11.222C10.4068 11.1437 10.4629 11.046 10.491 10.9389C10.5192 10.8318 10.5184 10.7192 10.4887 10.6125C10.3891 10.2538 10.3333 9.8832 10.3333 9.50001C10.3333 7.19157 12.1915 5.33334 14.5 5.33334ZM15.3333 7.41668C15.0018 7.41668 14.6838 7.54837 14.4494 7.78279C14.215 8.01721 14.0833 8.33516 14.0833 8.66668C14.0833 8.9982 14.215 9.31614 14.4494 9.55056C14.6838 9.78498 15.0018 9.91668 15.3333 9.91668C15.6648 9.91668 15.9828 9.78498 16.2172 9.55056C16.4516 9.31614 16.5833 8.9982 16.5833 8.66668C16.5833 8.33516 16.4516 8.01721 16.2172 7.78279C15.9828 7.54837 15.6648 7.41668 15.3333 7.41668Z" fill="black"/></svg>'
          }
        />
      );
    case "mixed":
    default:
      return (
        <SVG
          src={
            "<svg " +
            sizeAttributes +
            ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.93425 19.76C8.03825 19.76 7.32358 19.5307 6.79025 19.072C6.26758 18.624 6.04892 17.9893 6.13425 17.168L6.39025 14.4C6.44358 13.8347 6.36358 13.4293 6.15025 13.184C5.93692 12.9387 5.48358 12.816 4.79025 12.816H2.95025V11.68H4.79025C5.47292 11.68 5.92092 11.5573 6.13425 11.312C6.35825 11.0667 6.44358 10.656 6.39025 10.08L6.13425 7.312C6.04892 6.49067 6.26758 5.856 6.79025 5.408C7.32358 4.94933 8.03825 4.72 8.93425 4.72H9.70225V5.856H8.93425C8.43292 5.856 8.03825 5.97867 7.75025 6.224C7.47292 6.46933 7.35558 6.832 7.39825 7.312L7.65425 10.08C7.71825 10.656 7.61158 11.1307 7.33425 11.504C7.05692 11.8667 6.66758 12.096 6.16625 12.192C6.66758 12.288 7.05692 12.5387 7.33425 12.944C7.61158 13.3387 7.71825 13.824 7.65425 14.4L7.39825 17.168C7.35558 17.648 7.47292 18.0107 7.75025 18.256C8.03825 18.5013 8.43292 18.624 8.93425 18.624H9.70225V19.76H8.93425ZM14.304 19.76V18.624H15.056C15.5573 18.624 15.952 18.5013 16.24 18.256C16.528 18.0107 16.6507 17.648 16.608 17.168L16.352 14.4C16.2987 13.824 16.4107 13.3387 16.688 12.944C16.9653 12.5387 17.3547 12.2827 17.856 12.176C17.3547 12.0907 16.9653 11.8667 16.688 11.504C16.4107 11.1307 16.2987 10.656 16.352 10.08L16.608 7.312C16.6507 6.832 16.528 6.46933 16.24 6.224C15.952 5.97867 15.5573 5.856 15.056 5.856H14.304V4.72H15.056C15.9627 4.72 16.6773 4.94933 17.2 5.408C17.7227 5.856 17.9467 6.49067 17.872 7.312L17.632 10.08C17.5787 10.656 17.6587 11.0667 17.872 11.312C18.0853 11.5573 18.5387 11.68 19.232 11.68H21.056V12.816H19.232C18.5387 12.816 18.0853 12.9387 17.872 13.184C17.6587 13.4293 17.5787 13.8347 17.632 14.4L17.872 17.168C17.9467 17.9893 17.7227 18.624 17.2 19.072C16.6773 19.5307 15.9627 19.76 15.056 19.76H14.304Z" fill="black"/></svg>'
          }
        />
      );
  }
}

function PlaceholderRow(props: { opacity?: number }) {
  return (
    <SVG
      opacity={props.opacity ?? 1}
      src='<svg width="364" height="20" viewBox="0 0 364 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="5" fill="#D9D9D9"/><rect width="20" height="20" rx="5" fill="#D9D9D9"/><rect x="31" y="7" width="135" height="7" rx="3.5" fill="#D9D9D9"/><rect x="204" y="7" width="87" height="7" rx="3.5" fill="#D9D9D9"/><circle cx="356.5" cy="10.5" r="6.625" stroke="#D9D9D9" stroke-width="1.75"/><line x1="353.875" y1="10.625" x2="359.125" y2="10.625" stroke="#D9D9D9" stroke-width="1.75" stroke-linecap="round"/></svg>'
    />
  );
}

widget.register(Widget);
