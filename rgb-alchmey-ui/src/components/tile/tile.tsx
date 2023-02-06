import { useEffect, useState } from "react";
import "./styles.css";
export const Tile = (props: {
  rgb: [number, number, number] | [];
  rowPos: number;
  colPos: number;
  isBorderHighlighted: boolean;
  onClick?: () => void;
  draggedTileDetails: (
    tRowPos: number,
    tColPos: number,
    rgb: number[],
    isTileDropped: boolean
  ) => void;
}) => {
  const [isDropped, setIsDropped] = useState(false);
  useEffect(() => {
    props.draggedTileDetails(props.rowPos, props.colPos, props.rgb, isDropped);
  }, [isDropped, props]);
  return (
    <div
      className="cls-tile"
      title={`rgb(${props.rgb[0]},${props.rgb[1]},${props.rgb[2]})`}
      style={{
        backgroundColor: `rgb(${props.rgb[0]},${props.rgb[1]},${props.rgb[2]})`,
        border: `2px solid ${
          props.isBorderHighlighted ? "rgb(255,0,0)" : "rgb(128,128,128)"
        }`,
      }}
      draggable={true}
      onDragStart={(e) => {
        setIsDropped(false);
      }}
      onDragEnd={() => {
        setIsDropped(true);
      }}
    ></div>
  );
};
