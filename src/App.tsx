import * as stylex from "@stylexjs/stylex"
import { MazeGrid } from "./maze/MazeGrid"
import { useState } from "react"

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
  }
  return (
    <div {...stylex.props(styles.base)}>
      <div> A block in the dark</div>
      <MazeGrid game={game} restartGame={restartGame} />
    </div>
  )
}

const styles = stylex.create({
  base: { backgroundColor: "lightgray", width: "100%", height: "100%" },
})
