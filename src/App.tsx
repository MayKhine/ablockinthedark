import * as stylex from "@stylexjs/stylex"
import { MazeGrid } from "./maze/MazeGrid"
import { useEffect, useState } from "react"

export const App = () => {
  const gridSize = 10

  const randomStart = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * 2) + Math.ceil(gridSize / 2),
  }

  const randomDestination = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * 2),
  }

  const [game, setGame] = useState({
    gridSize: gridSize,
    randomStart: randomStart,
    randomDestination: randomDestination,
  })

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
    setIsRunning(false)
  }

  const [isRunning, setIsRunning] = useState(false)
  const [timerSec, setTimerSec] = useState(0)

  useEffect(() => {
    let timer: number

    if (isRunning) {
      timer = setInterval(() => {
        setTimerSec((prevTime) => prevTime + 1)
      }, 10) //1000
    }
    return () => clearInterval(timer) //clean up the timer interval
  }, [isRunning])

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

  return (
    <div {...stylex.props(styles.base)}>
      <div> A block in the dark</div>
      <div>{formatTime(timerSec)}</div>
      <MazeGrid
        game={game}
        restartGame={restartGame}
        toggleTimer={() => {
          setIsRunning(!isRunning)
        }}
      />
    </div>
  )
}

const styles = stylex.create({
  base: { backgroundColor: "lightgray", width: "100%", height: "100%" },
})
