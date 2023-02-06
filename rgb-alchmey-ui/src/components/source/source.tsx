import "./styles.css";
export const Source = (props: {
  rgb: [number, number, number] | [];
  rowPos: number;
  colPos: number;
  onClick?: () => void;
  getSourceDetail: (
    sRowPos: number,
    sColPos: number,
    sCurrentRgb: number[]
  ) => void;
}) => {
  return (
    <>
      <div
        id={`${props.rowPos}-${props.colPos}`}
        className="cls-source"
        title={`rgb(${props.rgb[0]},${props.rgb[1]},${props.rgb[2]})`}
        style={{
          backgroundColor: `rgb(${props.rgb[0]},${props.rgb[1]},${props.rgb[2]})`,
        }}
        onClick={props.onClick}
        onDragOver={(e) => {
          props.getSourceDetail(props.rowPos, props.colPos, props.rgb);
        }}
      ></div>
    </>
  );
};
