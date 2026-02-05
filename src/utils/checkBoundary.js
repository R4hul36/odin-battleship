export default function isValidBoundary(x, y, length, orientation) {
  const boardLimit = 10
  let adjustedX = x
  let adjustedY = y

  if (orientation === 'horizontal') {
    adjustedY = adjustedY + length - 1
    return adjustedY < boardLimit
  } else if (orientation === 'vertical') {
    adjustedX = adjustedX + length - 1
    return adjustedX < boardLimit
  }
}
