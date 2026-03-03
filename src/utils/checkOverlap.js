export default function isNonOverlapping(x, y, board, shipLength, orientation) {
  
  for (let i = 0; i < shipLength; i++) {
    if (orientation === 'horizontal' && board[x][y + i] !== null) {
      return false
      break
    } else if (orientation === 'vertical' && board[x + i][y] !== null) {
      return false
      break
    }
  }

  return true
} 
