import * as stylex from "@stylexjs/stylex"
import { MazeGrid } from "./maze/MazeGrid"

export const App = () => {
  return (
    <div {...stylex.props(styles.base)}>
      <div> A block in the dark</div>
      <MazeGrid />
    </div>
  )
}

const styles = stylex.create({
  base: { backgroundColor: "lightgray", width: "100%", height: "100%" },
})
