export type MatrixType = {
  rowIndex: number;
  colIndex: number;
  rgbArr: [number, number, number] | [];
  isHighlighted: boolean = false;
};

export type DroppedSouceDetails = {
  sRowNum: number;
  sColNum: number;
  rgb: number[];
};

export type DraggedTileDetails = {
  tRowNum: number;
  tColNum: number;
  rgb: number[];
  isDropped: boolean;
};
