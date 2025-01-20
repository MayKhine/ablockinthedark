import * as stylex from "@stylexjs/stylex"
import { useEffect, useState } from "react"

export type GridCellType = {
  x: number
  y: number
}

type MazeGridProps = {
  game: {
    gridSize: number
    randomStart: GridCellType
    randomDestination: GridCellType
  }
  restartGame: () => void
}

export const MazeGrid = ({ game, restartGame }: MazeGridProps) => {
  const randomDestination = game.randomDestination
  const gridSize = game.gridSize
  const randomStart = game.randomStart
  const [movingCell, setMovingCell] = useState(randomStart)
  const [stopKeyDown, setStopKeyDown] = useState(false)

  const generateGridArrOfArr = (gridSize: number) => {
    const tempArr = new Array<Array<GridCellType>>()

    for (let i = 0; i < gridSize; i++) {
      tempArr.push([])
      for (let x = 0; x < gridSize; x++) {
        const tempGridCell = { x: x, y: i }
        tempArr[i].push(tempGridCell)
      }
    }
    return tempArr
  }

  const gridArrOfArr = generateGridArrOfArr(gridSize)

  const [gameStatus, setGameStatus] = useState("")

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      setMovingCell((prevVal) => {
        const newY = prevVal.y - 1
        if (newY < 0) {
          setGameStatus("over")
          setStopKeyDown(true)
          return prevVal
        } else {
          return { ...prevVal, y: newY }
        }
      })
    }

    if (event.key === "ArrowDown") {
      setMovingCell((prevVal) => {
        const newY = prevVal.y + 1
        if (newY > gridSize - 1) {
          setGameStatus("over")
          setStopKeyDown(true)

          return prevVal
        } else {
          return { ...prevVal, y: newY }
        }
      })
    }

    if (event.key === "ArrowLeft") {
      setMovingCell((prevVal) => {
        const newX = prevVal.x - 1
        if (newX < 0) {
          setGameStatus("over")
          setStopKeyDown(true)

          return prevVal
        } else {
          return { ...prevVal, x: newX }
        }
      })
    }

    if (event.key === "ArrowRight") {
      setMovingCell((prevVal) => {
        const newX = prevVal.x + 1
        if (newX > gridSize - 1) {
          setGameStatus("over")
          setStopKeyDown(true)
          return prevVal
        } else {
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
      setStopKeyDown(true)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [stopKeyDown, movingCell])

  useEffect(() => {
    setMovingCell(randomStart)
  }, [randomStart])

  return (
    <div {...stylex.props(styles.base)}>
      <div>
        <div>Game Status: {gameStatus}</div>
        <div
          onClick={() => {
            restartGame()
            setGameStatus("")
            setStopKeyDown(false)
          }}
        >
          Game Restart Button
        </div>
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
                          {/* {eachCell.x} , {eachCell.y} * */}
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
                            randomDestination.y
                          )
                        )}
                      >
                        {/* {eachCell.x},{eachCell.y} */}
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
    backgroundColor: x1 === x2 && y1 === y2 ? "yellow" : "red", //yellow : win
    width: "100%",
    height: "100%",
  }),
  destinationCell: (x1: number, x2: number, y1: number, y2: number) => ({
    backgroundColor: x1 === x2 && y1 === y2 ? "green" : "darkgray",
    width: "100%",
    height: "100%",
  }),
})
