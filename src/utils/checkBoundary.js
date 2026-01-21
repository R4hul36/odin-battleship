export default function isValidHorizontalBoundary(x, y, length) {
  const boardWidth = 10
  const adjustedX = x
  const adjustedY = y + length - 1
  return adjustedY < boardWidth
}
