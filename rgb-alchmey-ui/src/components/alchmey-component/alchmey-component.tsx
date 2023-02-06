import { useEffect, useState } from "react";
import { Source } from "../source/source";
import { Tile } from "../tile/tile";
import { MatrixType } from "./types";
import "./styles.css";

export const Alchmey = (props: {
  rowCount: number;
  columnCount: number;
  target: number[];
  getClosestRgbAndMovesCount: (
    closestColor: number[],
    movesCount: number,
    deltaValue: number
  ) => void;
}) => {
  const [rowCount, setRowCount] = useState(props.rowCount);
  const [columnCount, setColumnCount] = useState(props.columnCount);
  const [currentRowPos, setCurrentRowPos] = useState(0);
  const [currentColumnPos, setCurrentColumnPos] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [rgbMatrix, setRgbMatrix] = useState<MatrixType[][]>([]);

  let tempSRowNum = 0;
  let tempSColNum = 0;

  useEffect(() => {
    setRowCount(props.rowCount);
    setColumnCount(props.columnCount);
  }, [props.rowCount, props.columnCount]);

  useEffect(() => {
    setRgbMatrix(() => {
      let tempMartixInfos: MatrixType[] = [];
      let matrixInfos: MatrixType[][] = [];
      for (let rowNum = 0; rowNum < rowCount + 2; rowNum++) {
        tempMartixInfos = [];
        for (let colNum = 0; colNum < columnCount + 2; colNum++) {
          if (
            (rowNum === 0 && colNum === 0) ||
            (rowNum === 0 && colNum === columnCount + 1) ||
            (rowNum === rowCount + 1 && colNum === 0) ||
            (rowNum === rowCount + 1 && colNum === columnCount + 1)
          ) {
            tempMartixInfos.push({
              rowIndex: rowNum,
              colIndex: colNum,
              rgbArr: [],
              isHighlighted: false,
            });
          } else {
            tempMartixInfos.push({
              rowIndex: rowNum,
              colIndex: colNum,
              rgbArr: [0, 0, 0],
              isHighlighted: false,
            });
          }
        }
        matrixInfos.push(tempMartixInfos);
      }
      return matrixInfos;
    });
  }, [rowCount, columnCount]);

  const getSelectedSourceDetail = (
    sRowNum: number,
    sColNum: number,
    rgb: number[]
  ) => {
    tempSRowNum = sRowNum;
    tempSColNum = sColNum;
  };

  const draggedTileInfo = (
    tRowNum: number,
    tColNum: number,
    rgb: number[],
    isDropped: boolean
  ) => {
    if (isDropped && movesCount >= 3) {
      rgbMatrix[tempSRowNum][tempSColNum].rgbArr = rgb as [
        number,
        number,
        number
      ];

      setRgbTileColor(
        tempSRowNum,
        tempSColNum,
        rowCount,
        columnCount,
        rgb,
        rgbMatrix
      );
      const { tileRowNum, tileColumnNum, minDeltaValue, closestColorRGB } =
        getHighlightedTileDetails();
      heighlightMatchingTile(tileRowNum, tileColumnNum, rgbMatrix);
      props.getClosestRgbAndMovesCount(
        closestColorRGB,
        movesCount + 1,
        minDeltaValue
      );

      setMovesCount(movesCount + 1);
    }
  };

  const heighlightMatchingTile = (
    tileRowNum: number,
    tileColumnNum: number,
    rgbMatrix: MatrixType[][]
  ) => {
    let isMatchFound = false;
    rgbMatrix.forEach((items, index) => {
      items.forEach((sItem, sIndex) => {
        if (index === tileRowNum && sIndex === tileColumnNum && !isMatchFound) {
          sItem.isHighlighted = true;
          isMatchFound = true;
        } else {
          sItem.isHighlighted = false;
        }
      });
    });
  };

  const setRgbTileColor = (
    rowPos: number,
    colPos: number,
    rowCount: number,
    columnCount: number,
    rgbColor: number[],
    rgbMatrix: MatrixType[][]
  ) => {
    let leftSourceRGB = [];
    let topSourceRGB = [];
    let rightSourceRGB = [];
    let bottomSourceRGB = [];
    let leftFr = 0;
    let topFr = 0;
    let rightFr = 0;
    let bottomFr = 0;

    if (rowPos === 0 || rowPos === rowCount + 1) {
      for (let indx = 1; indx <= rowCount; indx++) {
        let currentMatrixRowIndex = indx;
        let currentMatrixColumnIndex = colPos;
        leftSourceRGB = rgbMatrix[currentMatrixRowIndex][0].rgbArr;
        topSourceRGB = rgbMatrix[0][currentMatrixColumnIndex].rgbArr;
        rightSourceRGB =
          rgbMatrix[currentMatrixRowIndex][columnCount + 1].rgbArr;
        bottomSourceRGB =
          rgbMatrix[rowCount + 1][currentMatrixColumnIndex].rgbArr;

        leftFr =
          (columnCount + 1 - currentMatrixColumnIndex) / (columnCount + 1);
        topFr = (rowCount + 1 - currentMatrixRowIndex) / (rowCount + 1);
        rightFr =
          (columnCount + 1 - (columnCount + 1 - currentMatrixColumnIndex)) /
          (columnCount + 1);
        bottomFr =
          (rowCount + 1 - (rowCount + 1 - currentMatrixRowIndex)) /
          (rowCount + 1);

        let r1 = leftSourceRGB[0] ? leftSourceRGB[0] * leftFr : 0;
        let g1 = leftSourceRGB[1] ? leftSourceRGB[1] * leftFr : 0;
        let b1 = leftSourceRGB[2] ? leftSourceRGB[2] * leftFr : 0;

        let r2 = topSourceRGB[0] ? topSourceRGB[0] * topFr : 0;
        let g2 = topSourceRGB[1] ? topSourceRGB[1] * topFr : 0;
        let b2 = topSourceRGB[2] ? topSourceRGB[2] * topFr : 0;

        let r3 = rightSourceRGB[0] ? rightSourceRGB[0] * rightFr : 0;
        let g3 = rightSourceRGB[1] ? rightSourceRGB[1] * rightFr : 0;
        let b3 = rightSourceRGB[2] ? rightSourceRGB[2] * rightFr : 0;

        let r4 = bottomSourceRGB[0] ? bottomSourceRGB[0] * bottomFr : 0;
        let g4 = bottomSourceRGB[1] ? bottomSourceRGB[1] * bottomFr : 0;
        let b4 = bottomSourceRGB[2] ? bottomSourceRGB[2] * bottomFr : 0;

        let r = r1 + r2 + r3 + r4;
        let g = g1 + g2 + g3 + g4;
        let b = b1 + b2 + b3 + b4;
        let f = 255 / Math.max(r, g, b, 255);
        rgbMatrix[currentMatrixRowIndex][currentMatrixColumnIndex].rgbArr = [
          r * f,
          g * f,
          b * f,
        ];
      }
    } else if (colPos === 0 || colPos === columnCount + 1) {
      for (let indx = 1; indx <= columnCount; indx++) {
        let currentMatrixRowIndex = rowPos;
        let currentMatrixColumnIndex = indx;
        leftSourceRGB = rgbMatrix[currentMatrixRowIndex][0].rgbArr;
        topSourceRGB = rgbMatrix[0][currentMatrixColumnIndex].rgbArr;
        rightSourceRGB =
          rgbMatrix[currentMatrixRowIndex][columnCount + 1].rgbArr;
        bottomSourceRGB =
          rgbMatrix[rowCount + 1][currentMatrixColumnIndex].rgbArr;
        leftFr =
          (columnCount + 1 - currentMatrixColumnIndex) / (columnCount + 1);
        topFr = (rowCount + 1 - currentMatrixRowIndex) / (rowCount + 1);
        rightFr =
          (columnCount + 1 - (columnCount + 1 - currentMatrixColumnIndex)) /
          (columnCount + 1);
        bottomFr =
          (rowCount + 1 - (rowCount + 1 - currentMatrixRowIndex)) /
          (rowCount + 1);

        let r1 = leftSourceRGB[0] ? leftSourceRGB[0] * leftFr : 0;
        let g1 = leftSourceRGB[1] ? leftSourceRGB[1] * leftFr : 0;
        let b1 = leftSourceRGB[2] ? leftSourceRGB[2] * leftFr : 0;

        let r2 = topSourceRGB[0] ? topSourceRGB[0] * topFr : 0;
        let g2 = topSourceRGB[1] ? topSourceRGB[1] * topFr : 0;
        let b2 = topSourceRGB[2] ? topSourceRGB[2] * topFr : 0;

        let r3 = rightSourceRGB[0] ? rightSourceRGB[0] * rightFr : 0;
        let g3 = rightSourceRGB[1] ? rightSourceRGB[1] * rightFr : 0;
        let b3 = rightSourceRGB[2] ? rightSourceRGB[2] * rightFr : 0;

        let r4 = bottomSourceRGB[0] ? bottomSourceRGB[0] * bottomFr : 0;
        let g4 = bottomSourceRGB[1] ? bottomSourceRGB[1] * bottomFr : 0;
        let b4 = bottomSourceRGB[2] ? bottomSourceRGB[2] * bottomFr : 0;

        let r = r1 + r2 + r3 + r4;
        let g = g1 + g2 + g3 + g4;
        let b = b1 + b2 + b3 + b4;
        let f = 255 / Math.max(r, g, b, 255);
        rgbMatrix[currentMatrixRowIndex][currentMatrixColumnIndex].rgbArr = [
          r * f,
          g * f,
          b * f,
        ];
      }
    }
  };

  const displayMatrixColor = (
    rowPos: number,
    colPos: number,
    rgbMatrix: MatrixType[][]
  ) => {
    for (let i = 0; i < rgbMatrix.length; i++) {
      for (let j = 0; j < rgbMatrix[i].length; j++) {
        if (rowPos === i && colPos === j) {
          let value = rgbMatrix[i][j];

          if (movesCount === 1) {
            value.rgbArr = [255, 0, 0];
            setRgbTileColor(
              rowPos,
              colPos,
              rowCount,
              columnCount,
              [255, 0, 0],
              rgbMatrix
            );
          } else if (movesCount === 2) {
            value.rgbArr = [0, 255, 0];
            setRgbTileColor(
              rowPos,
              colPos,
              rowCount,
              columnCount,
              [0, 255, 0],
              rgbMatrix
            );
          } else if (movesCount === 3) {
            value.rgbArr = [0, 0, 255];

            setRgbTileColor(
              rowPos,
              colPos,
              rowCount,
              columnCount,
              [0, 0, 255],
              rgbMatrix
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    if (movesCount > 3) return;
    displayMatrixColor(currentRowPos, currentColumnPos, rgbMatrix);
    const { tileRowNum, tileColumnNum, minDeltaValue, closestColorRGB } =
      getHighlightedTileDetails();
    heighlightMatchingTile(tileRowNum, tileColumnNum, rgbMatrix);
    props.getClosestRgbAndMovesCount(
      closestColorRGB,
      movesCount,
      minDeltaValue
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movesCount, currentRowPos, currentColumnPos]);

  const getHighlightedTileDetails = () => {
    let minDeltaValue = 1;
    let closestColorRGB: number[] = [];
    let tileRowNum = 0;
    let tileColumnNum = 0;
    for (let i = 1; i < rgbMatrix.length; i++) {
      for (let j = 1; j < rgbMatrix[i].length; j++) {
        let tempValue = rgbMatrix[i][j].rgbArr as number[];

        let delta =
          (1 / 255) *
          (1 / Math.sqrt(3)) *
          Math.sqrt(
            (props.target[0] - tempValue[0]) ** 2 +
              (props.target[1] - tempValue[1]) ** 2 +
              (props.target[2] - tempValue[2]) ** 2
          );
        if (minDeltaValue >= delta) {
          minDeltaValue = delta;
          closestColorRGB = tempValue;
          tileRowNum = i;
          tileColumnNum = j;
        }
      }
    }

    return { tileRowNum, tileColumnNum, minDeltaValue, closestColorRGB };
  };

  const onSourceClick = (rowPos: number, colPos: number, rgb: number[]) => {
    setMovesCount(movesCount + 1);
    setCurrentColumnPos(colPos);
    setCurrentRowPos(rowPos);
  };

  return (
    <>
      {rgbMatrix.map((items, index) => (
        <div key={Math.random()} className="cls-alchmey-row">
          {items.map((sItem, sIndex) => {
            return (
              <div className="inner-div" key={Math.random()}>
                {(sItem.rowIndex === 0 || sItem.rowIndex === rowCount + 1) &&
                  sItem.rgbArr.length === 0 && (
                    <div
                      key={sItem.rowIndex + sItem.colIndex}
                      className="empty-div"
                    ></div>
                  )}
                {(sItem.rowIndex === 0 || sItem.rowIndex === rowCount + 1) &&
                  sItem.rgbArr.length > 0 && (
                    <Source
                      key={`${sItem.rowIndex}-${sItem.colIndex}`}
                      rowPos={sItem.rowIndex}
                      colPos={sItem.colIndex}
                      rgb={sItem.rgbArr}
                      onClick={() => {
                        onSourceClick(
                          sItem.rowIndex,
                          sItem.colIndex,
                          sItem.rgbArr
                        );
                      }}
                      getSourceDetail={getSelectedSourceDetail}
                    ></Source>
                  )}
                {sItem.rowIndex !== 0 &&
                  sItem.rowIndex !== rowCount + 1 &&
                  (sItem.colIndex === 0 ||
                    sItem.colIndex === columnCount + 1) && (
                    <Source
                      key={`${sItem.rowIndex}-${sItem.colIndex}`}
                      rowPos={sItem.rowIndex}
                      colPos={sItem.colIndex}
                      rgb={sItem.rgbArr}
                      onClick={() => {
                        onSourceClick(
                          sItem.rowIndex,
                          sItem.colIndex,
                          sItem.rgbArr
                        );
                      }}
                      getSourceDetail={getSelectedSourceDetail}
                    ></Source>
                  )}
                {sItem.rowIndex !== 0 &&
                  sItem.rowIndex !== rowCount + 1 &&
                  sItem.colIndex !== 0 &&
                  sItem.colIndex !== columnCount + 1 && (
                    <Tile
                      key={`${sItem.rowIndex}-${sItem.colIndex}`}
                      rowPos={sItem.rowIndex}
                      colPos={sItem.colIndex}
                      isBorderHighlighted={sItem.isHighlighted}
                      rgb={sItem.rgbArr}
                      draggedTileDetails={draggedTileInfo}
                    ></Tile>
                  )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};
