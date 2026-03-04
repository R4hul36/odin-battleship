// export default function isNonOverlapping(x, y, board, shipLength, orientation) {
//   for (let i = 0; i < shipLength; i++) {
//     if (orientation === 'horizontal' && board[x][y + i] !== null) {
//       return false
//       break
//     } else if (orientation === 'vertical' && board[x + i][y] !== null) {
//       return false
//       break
//     }
//   }

//   return true
// }

export default function isNonOverlapping(x, y, board, shipLength, orientation) {
  let totalLength = shipLength + 2
  let areaWidth = 3

  if (orientation === 'horizontal') {
    console.log('horizontal')

    //2,1 ("initial click")
    // 1,0 -> 1,7
    // 2,0 -> 2, 7
    // 3,0 -> 3, 7

    let startX = x - 1
    let startY = y - 1
    console.log(startX, startY)
    for (let i = startX; i < areaWidth; i++) {
      console.log('hi')

      for (let j = startY; j < totalLength; j++) {
        console.log(i, j)
        if (!checkShipOnBoundary(i, j)) {
          if (board[i][j] !== null) {
            return false
          }
        }
      }
    }
  }
  return true
}

function checkShipOnBoundary(x, y) {
  return x >= 10 || x <= -1 || y >= 10 || y <= -1
}
