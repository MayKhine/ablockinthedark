import * as stylex from "@stylexjs/stylex"
import { useEffect, useState } from "react"
import { Button } from "../Button"
import { GameType } from "../../App"

export type GridCellType = {
  x: number
  y: number
  visited?: boolean
  fire?: boolean
}

type MazeGameProps = {
  game: GameType
  gameGridArrOfArr: Array<Array<GridCellType>>
  restartGame: () => void
  startTimer: () => void
  endTimer: () => void
  fireArr: Array<GridCellType>
}

export const MazeGame = ({
  game,
  restartGame,
  startTimer,
  endTimer,
  gameGridArrOfArr,
}: MazeGameProps) => {
  const randomDestination = game.randomDestination
  const gridSize = game.gridSize
  const randomStart = game.randomStart
  const [movingCell, setMovingCell] = useState(randomStart)
  const [stopKeyDown, setStopKeyDown] = useState(false)

  const [gridArrOfArr, setGridArrOfArr] = useState(gameGridArrOfArr)
  const [gameStatus, setGameStatus] = useState("")

  const checkTouchFire = (x: number, y: number) => {
    gridArrOfArr.map((arr) => {
      arr.find((cell) => {
        if (cell.x === x && cell.y === y && cell.fire === true) {
          console.log("Fire CELL : DIE")
          setGameStatus("over")
          endTimer()
          setStopKeyDown(true)
        }
      })
    })
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    //check first key down
    if (
      (event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight") &&
      gameStatus === ""
    ) {
      setGameStatus("on")
      startTimer()
    }

    //set if a cell is visted or not
    setGridArrOfArr((curArrOfArr: Array<Array<GridCellType>>) => {
      return curArrOfArr.map((row) => {
        return row.map((cell) => {
          if (cell.x === movingCell.x && cell.y === movingCell.y) {
            return { x: cell.x, y: cell.y, visited: true }
          } else {
            return cell
          }
        })
      })
    })

    if (event.key === "ArrowUp") {
      setMovingCell((prevVal) => {
        const newY = prevVal.y - 1
        if (newY < 0) {
          setGameStatus("over")
          endTimer()
          setStopKeyDown(true)
          return prevVal
        } else {
          checkTouchFire(movingCell.x, newY)
          return { ...prevVal, y: newY }
        }
      })
    }

    if (event.key === "ArrowDown") {
      setMovingCell((prevVal) => {
        const newY = prevVal.y + 1
        if (newY > gridSize - 1) {
          setGameStatus("over")
          endTimer()
          setStopKeyDown(true)
          return prevVal
        } else {
          checkTouchFire(movingCell.x, newY)
          return { ...prevVal, y: newY }
        }
      })
    }

    if (event.key === "ArrowLeft") {
      setMovingCell((prevVal) => {
        const newX = prevVal.x - 1
        if (newX < 0) {
          setGameStatus("over")
          endTimer()
          setStopKeyDown(true)
          return prevVal
        } else {
          checkTouchFire(newX, movingCell.y)
          return { ...prevVal, x: newX }
        }
      })
    }

    if (event.key === "ArrowRight") {
      setMovingCell((prevVal) => {
        const newX = prevVal.x + 1
        if (newX > gridSize - 1) {
          setGameStatus("over")
          endTimer()
          setStopKeyDown(true)
          return prevVal
        } else {
          checkTouchFire(newX, movingCell.y)
          return { ...prevVal, x: newX }
        }
      })
    }
  }

  useEffect(() => {
    if (!stopKeyDown) {
      document.addEventListener("keydown", handleKeyDown)
    }

    if (
      movingCell.x === randomDestination.x &&
      movingCell.y === randomDestination.y
    ) {
      setGameStatus("win")
      endTimer()

      setStopKeyDown(true)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [stopKeyDown, movingCell])

  useEffect(() => {
    setMovingCell(randomStart)
  }, [randomStart])

  const gameRestartButtonFN = () => {
    restartGame()
    setGameStatus("")
    setStopKeyDown(false)
    setGridArrOfArr(gameGridArrOfArr)
  }

  return (
    <div {...stylex.props(styles.base)}>
      <div>
        <div>Game Status: {gameStatus}</div>
        <Button text="Game Restart" onClickFn={gameRestartButtonFN} />
      </div>

      <div {...stylex.props(styles.grid)}>
        {gridArrOfArr.map((eachArr, index) => {
          return (
            <div key={index} {...stylex.props(styles.row)}>
              {eachArr.map((eachCell, index) => {
                return (
                  <div key={index} {...stylex.props(styles.cell)}>
                    {movingCell.x === eachCell.x &&
                      movingCell.y === eachCell.y && (
                        <div
                          {...stylex.props(
                            styles.movingCell(
                              movingCell.x,
                              randomDestination.x,
                              movingCell.y,
                              randomDestination.y
                            )
                          )}
                        >
                          {eachCell.x} , {eachCell.y} *
                        </div>
                      )}

                    {(movingCell.x !== eachCell.x ||
                      movingCell.y !== eachCell.y) && (
                      <div
                        {...stylex.props(
                          styles.destinationCell(
                            eachCell.x,
                            randomDestination.x,
                            eachCell.y,
                            randomDestination.y,
                            eachCell.visited,
                            eachCell.fire
                          )
                        )}
                      >
                        {eachCell.x},{eachCell.y}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = stylex.create({
  base: {
    // backgroundColor: "lightblue",
    display: "flex",
    flexDirection: "column",
  },
  grid: {
    backgroundColor: "gray",
    display: "flex",
    flexDirection: "column",
    width: "max-content",
    // height: "100%",
  },

  row: {
    // backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    gap: ".5rem",
  },
  cell: {
    // width: "100%",
    width: "2rem",
    aspectRatio: "1",
    marginTop: ".5rem",
  },
  movingCell: (x1: number, x2: number, y1: number, y2: number) => ({
    backgroundColor: x1 === x2 && y1 === y2 ? "yellow" : "orange", //yellow : win
    width: "100%",
    height: "100%",
  }),
  destinationCell: (
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    visited,
    fire
  ) => ({
    backgroundColor: fire
      ? "red"
      : visited
      ? "pink"
      : x1 === x2 && y1 === y2
      ? "green"
      : "darkgray",
    width: "100%",
    height: "100%",
  }),
})
