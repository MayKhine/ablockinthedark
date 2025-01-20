import * as stylex from "@stylexjs/stylex"
import { useEffect, useState } from "react"
import { MazeGame } from "./components/maze/MazeGame"

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
    setIsTimerRunning(false)
  }

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
      <div> is timer running: {isTimerRunning === false ? "NO" : "YES"}</div>
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
      </div>
      <MazeGame
        game={game}
        restartGame={restartGame}
        startTimer={() => setIsTimerRunning(true)}
        endTimer={() => setIsTimerRunning(false)}
      />
    </div>
  )
}

const styles = stylex.create({
  base: { backgroundColor: "lightgray", width: "100%", height: "100%" },
})
