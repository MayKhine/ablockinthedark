import * as stylex from "@stylexjs/stylex"

type ButtonProps = {
  text: string
  onClickFn: () => void
}
export const Button = ({ text, onClickFn }: ButtonProps) => {
  return (
    <div {...stylex.props(styles.base)} onClick={onClickFn}>
      {text}
    </div>
  )
}

const styles = stylex.create({
  base: {
    backgroundColor: {
      default: "pink",
      ":hover": "red",
    },
    cursor: "pointer",
    width: "max-content",
    padding: "1rem",
    borderRadius: ".5rem",
    border: "1px solid black",
  },
})
