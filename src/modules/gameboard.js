import Ship from './ship'
import generateRandomCoordinates from '../utils/generateCoordinates'
import isValidHorizontalBoundary from '../utils/checkBoundary'
import isNonOverlappingHorizontally from '../utils/checkOverlap'


export default function GameBoard() {
  let board
  let missedCoord = []
  function createBoard() {
    board = Array.from({ length: 10 }, () => Array(10).fill(null))
  }

  function placeShipsHorizontally(ship,[x,y]) {
    const length = ship.shipLength()
    // let [x, y] = generateRandomCoordinates()
    // while (
    //   !isValidHorizontalBoundary(x, y, length || !isNonOverlappingHorizontally(x, y, board, length))
    // ) {
    //   let newCoord = generateRandomCoordinates()
    //   x = newCoord[0]
    //   y = newCoord[1]
    // }
    if(isValidHorizontalBoundary(x,y,length) && isNonOverlappingHorizontally(x, y, board, length)){
      for (let i = 0; i < length; i++) {
        board[x][y + i] = ship
      }
    }
   
  }

  function receiveAttack(x, y) {
    if (board[x][y] !== null) {
      const currShip = board[x][y]
      currShip.hit()
    }else {
      missedCoord.push([x,y])
    }
  }

  function allShipsSunk() {
    let shipsSunk = true

    for (row of board) {
      for(tile of row) {
        if(tile!== null) {
          if(tile.isSunk() === false){
            shipsSunk = false
          }
        }
      }
    }
    return shipsSunk
  }

  function checkMissedCoord () {
    return missedCoord
  }

  return {
    createBoard,
    placeShipsHorizontally,
    receiveAttack,
    checkMissedCoord,
    allShipsSunk
  }
}
