export default function isNonOverlapping(x, y, board, shipLength, orientation) {
  let nonOverlapping = true
  for (let i = 0; i < shipLength; i++) {
    if (orientation === 'horizontal' && board[x][y + i] !== null) {
      nonOverlapping = false
      break
    } else if (orientation === 'vertical' && board[x + i][y] !== null) {
      nonOverlapping = false
      break
    }
  }

  return nonOverlapping
} 
