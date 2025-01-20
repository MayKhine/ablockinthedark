import * as stylex from "@stylexjs/stylex"
import { useEffect, useState } from "react"
import { GridCellType, MazeGame } from "./components/maze/MazeGame"

export type GameType = {
  gridSize: number
  randomStart: GridCellType
  randomDestination: GridCellType
}
export const App = () => {
  const gridSize = 5

  const randomStart = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * 2) + Math.ceil(gridSize / 2),
  }

  const randomDestination = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * 2),
  }

  const [game, setGame] = useState<GameType>({
    gridSize: gridSize,
    randomStart: randomStart,
    randomDestination: randomDestination,
  })

  const generateRandomFiresArr = () => {
    const tempArr = Array<GridCellType>()

    while (tempArr.length < 5) {
      const tempFire = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      }

      if (
        (tempFire.x !== randomStart.x || tempFire.y !== randomStart.y) &&
        (tempFire.x !== randomDestination.x ||
          tempFire.y !== randomDestination.y)
      ) {
        //check if the fire aleady exists

        const isDuplicateFire = tempArr.some(
          (fire) => fire.x === tempFire.x && fire.y === tempFire.y
        )

        if (!isDuplicateFire) {
          tempArr.push(tempFire)
        }
      }
    }

    return tempArr
  }

  const fireArr = generateRandomFiresArr()

  const restartGame = () => {
    const randomStart = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * 2) + Math.ceil(gridSize / 2),
    }

    const randomDestination = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * 2),
    }
    setGame({
      gridSize: gridSize,
      randomStart: randomStart,
      randomDestination: randomDestination,
    })
    setTimerSec(0)
    setIsTimerRunning(false)
  }

  const generateGridArrOfArr = (gridSize: number) => {
    const tempArr = new Array<Array<GridCellType>>()

    for (let i = 0; i < gridSize; i++) {
      tempArr.push([])
      for (let x = 0; x < gridSize; x++) {
        const tempGridCell = { x: x, y: i, visited: false, fire: false }
        tempArr[i].push(tempGridCell)
      }
    }
    return tempArr
  }

  const updateGridArrOfArrWithFire = (
    gameGridArrOfArr: Array<Array<GridCellType>>
  ) => {
    return gameGridArrOfArr.map((row: Array<GridCellType>) => {
      return row.map((cell: GridCellType) => {
        const fireCell = fireArr.find(
          (fire) => fire.x === cell.x && fire.y === cell.y
        )
        if (fireCell) {
          return { ...cell, fire: true }
        }
        return cell
      })
    })
  }

  const gameGridArrOfArr = generateGridArrOfArr(gridSize)
  const updatedGameGridArrOfArr = updateGridArrOfArrWithFire(gameGridArrOfArr)

  // console.log(
  //   "What is updated Game fire",
  //   gameGridArrOfArr,
  //   updatedGameGridArrOfArr
  // )

  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSec, setTimerSec] = useState(0)

  let timer: number

  useEffect(() => {
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimerSec((prevTime) => prevTime + 1)
      }, 10)
    } else {
      clearInterval(timer)
    }

    return () => clearInterval(timer) // Clean up the interval on unmount or when isTimerRunning changes
  }, [isTimerRunning])

  const formatTime = (timeInCentiseconds: number) => {
    const centiseconds = timeInCentiseconds % 100
    const seconds = Math.floor((timeInCentiseconds / 100) % 60)
    const minutes = Math.floor((timeInCentiseconds / (100 * 60)) % 60)
    const hours = Math.floor(timeInCentiseconds / (100 * 60 * 60))
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`
  }

  const formattedTime = formatTime(timerSec)
  return (
    <div {...stylex.props(styles.base)}>
      <div> A block in the dark</div>
      <div>{formattedTime}</div>
      {/* <div> is timer running: {isTimerRunning === false ? "NO" : "YES"}</div>
      <div
        onClick={() => {
          setIsTimerRunning(true)
        }}
      >
        Timer start
      </div>
      <div
        onClick={() => {
          setIsTimerRunning(false)
        }}
      >
        Timer End
      </div> */}
      <MazeGame
        game={game}
        gameGridArrOfArr={updatedGameGridArrOfArr}
        // gameGridArrOfArr={updateGridArrOfArrWithFire}
        restartGame={restartGame}
        startTimer={() => setIsTimerRunning(true)}
        endTimer={() => setIsTimerRunning(false)}
        fireArr={fireArr}
      />
    </div>
  )
}

const styles = stylex.create({
  base: { backgroundColor: "lightgray", width: "100%", height: "100%" },
})
