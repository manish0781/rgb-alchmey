import React, { useEffect, useState } from "react";
import { LabelComponent } from "./components/label-component/label-component";
import {
  getcurrentUserInitDetails,
  getInitDetails,
} from "../src/services/services";
import { Init_Detail } from "./types/types";
import { Alchmey } from "./components/alchmey-component/alchmey-component";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [initDetails, setInitDetails] = useState<Init_Detail>({
    userId: "",
    maxMoves: 0,
    width: 0,
    height: 0,
    target: [0, 0, 0],
    closesetColorRgb: [0, 0, 0],
  });
  const [movesLeft, setMovesLeft] = useState(10000);
  const [movesCount, setMovesCount] = useState(0);
  const [deltaValue, setDeltaValue] = useState(100);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("userId")
  );

  const getClosestRgbAndMovesCount = (
    closestColor: number[],
    movesCount: number,
    deltaValue: number
  ) => {
    setInitDetails({ ...initDetails, closesetColorRgb: closestColor });
    setMovesCount(movesCount);
    setDeltaValue(deltaValue);
  };

  useEffect(() => {
    if (showDialog && dialogMessage !== "") {
      const result = window.confirm(dialogMessage);
      if (!result) {
        localStorage.clear();
      }
      window.location.reload();
    }
  }, [deltaValue, dialogMessage, movesLeft, showDialog]);

  useEffect(() => {
    if (movesLeft > 0 && deltaValue * 100 < 10) {
      setShowDialog(true);
      setDialogMessage("Success!.Do you want to play again?");
    } else if (movesLeft <= 0 && deltaValue * 100 >= 10) {
      setShowDialog(true);
      setDialogMessage("Failed!.Do you want to play again?");
    } else {
      setShowDialog(false);
      setDialogMessage("");
    }
  }, [deltaValue, movesLeft]);

  useEffect(() => {
    let userId =
      localStorage.getItem("userId") === null
        ? localStorage.getItem("userId")
        : null;
    if (currentUserId === null) {
      getInitDetails()
        .then((res) => {
          if (res.data) {
            setInitDetails(res.data);
            setCurrentUserId(userId);
            localStorage.setItem("userId", res.data.userId);
            setErrorMessage("");
          }
        })
        .catch((ex) => {
          setErrorMessage(
            "Seems service is not running.Please run the color alchmey server service."
          );
        });
    } else {
      getcurrentUserInitDetails(currentUserId)
        .then((res) => {
          if (res.data) {
            setInitDetails(res.data);
            setErrorMessage("");
          }
        })
        .catch((ex) => {
          setErrorMessage(
            "Seems service is not running.Please run the color alchmey server service."
          );
        });
    }
  }, [currentUserId]);

  useEffect(() => {
    if (initDetails.maxMoves > 0) {
      setMovesLeft(initDetails.maxMoves - movesCount);
    }
  }, [initDetails, movesCount]);
  return (
    <>
      <h2 className="error-message">{errorMessage}</h2>
      {initDetails && initDetails.height > 0 && initDetails.width > 0 && (
        <>
          <LabelComponent
            userId={initDetails.userId}
            maxMoves={movesLeft}
            target={initDetails.target}
            closesetColorRgb={
              initDetails.closesetColorRgb
                ? initDetails.closesetColorRgb
                : undefined
            }
            deltaValue={deltaValue * 100}
          ></LabelComponent>

          <Alchmey
            rowCount={initDetails.height}
            columnCount={initDetails.width}
            target={initDetails.target}
            getClosestRgbAndMovesCount={getClosestRgbAndMovesCount}
          ></Alchmey>
        </>
      )}
    </>
  );
}

export default App;
