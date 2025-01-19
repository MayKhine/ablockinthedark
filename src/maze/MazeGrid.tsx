import * as stylex from "@stylexjs/stylex"
import { useEffect, useState } from "react"

type GridCellType = {
  x: number
  y: number
}
const gridSize = 5

const randomStart = {
  x: Math.floor(Math.random() * gridSize),
  y: Math.floor(Math.random() * 2) + Math.ceil(gridSize / 2),
}

const randomDestination = {
  x: Math.floor(Math.random() * gridSize),
  y: Math.floor(Math.random() * 2),
}

export const MazeGrid = () => {
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
  console.log("Generated arr of arr: ", gridArrOfArr)

  const [movingCell, setMovingCell] = useState(randomStart)
  const [gameOver, setGameOver] = useState(false)
  console.log("Moving Cell: ", movingCell)

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log("event key down : ", event.key, event.code)
    if (event.key === "ArrowUp") {
      setMovingCell((prevVal) => {
        const newY = prevVal.y - 1
        if (newY < 0) {
          setGameOver(true)
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
          setGameOver(true)
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
          setGameOver(true)
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
          setGameOver(true)
          return prevVal
        } else {
          return { ...prevVal, x: newX }
        }
      })
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div {...stylex.props(styles.base)}>
      {gridArrOfArr.map((eachArr, index) => {
        return (
          <div key={index} {...stylex.props(styles.row)}>
            {eachArr.map((eachCell, index) => {
              return (
                <div key={index} {...stylex.props(styles.cell)}>
                  {/* Random Start */}
                  {movingCell.x === eachCell.x &&
                    movingCell.y === eachCell.y && (
                      <div {...stylex.props(styles.movingCell)}>
                        {eachCell.x} , {eachCell.y} *
                      </div>
                    )}

                  {/* Random Destination */}
                  {randomDestination.x === eachCell.x &&
                    randomDestination.y === eachCell.y && (
                      <div {...stylex.props(styles.destinationCell)}>
                        {eachCell.x} , {eachCell.y} *
                      </div>
                    )}

                  {(movingCell.x !== eachCell.x ||
                    movingCell.y !== eachCell.y) &&
                    (randomDestination.x !== eachCell.x ||
                      randomDestination.y !== eachCell.y) &&
                    (movingCell.x !== randomDestination.x ||
                      movingCell.y !== randomDestination.y) && (
                      <div>
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
  )
}

const styles = stylex.create({
  base: {
    backgroundColor: "lightblue",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    backgroundColor: "pink",
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  },
  cell: {
    backgroundColor: "lightyellow",
    width: "3rem",
    aspectRatio: "1",
    marginTop: "1rem",
  },
  movingCell: {
    backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
  destinationCell: {
    backgroundColor: "green",
    width: "100%",
    height: "100%",
  },
})
