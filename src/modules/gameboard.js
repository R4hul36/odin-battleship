import Ship from './ship'
import generateRandomCoordinates from '../utils/generateCoordinates'
import isValidBoundary from '../utils/checkBoundary'
import isNonOverlapping from '../utils/checkOverlap'

export default function GameBoard() {
  let board
  function createBoard() {
    board = Array.from({ length: 10 }, () => Array(10).fill(null))
  }

  function placeShips(ship) {
    const length = ship.shipLength()
    let [x, y] = generateRandomCoordinates()
    while (
      !isValidBoundary(x, y, length || !isNonOverlapping(x, y, board, length))
    ) {
      let newCoord = generateRandomCoordinates()
      x = newCoord[0]
      y = newCoord[1]
    }
    for (let i = 0; i < length; i++) {
      board[x][y + i] = ship
    }
  }

  function receiveAttack(x, y) {
    if (board[x][y] !== null) {
      const currShip = board[x][y]
      currShip.hit()
    }
  }
  function checkIfOccupied(x, y) {
    if (board[x][y] !== null) {
      return 'occupied'
    } else {
      return 'empty cell'
    }
  }

  function checkIsSunk(x, y) {
    if (board[x][y] !== null) {
      return board[x][y].isSunk()
    } else {
      return 'Missed'
    }
  }

  return {
    createBoard,
    placeShips,
    receiveAttack,
    checkIfOccupied,
    checkIsSunk,
  }
}
