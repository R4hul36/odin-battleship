export default function isValidBoundary(x, y, length, orientation) {
  const boardLimit = 10
  // const adjustedX = x
  // const adjustedY = y + length - 1
  // return adjustedY < boardLimit
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
