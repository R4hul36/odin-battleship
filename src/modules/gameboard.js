import Ship from './ship'
import generateRandomCoordinates from '../utils/generateCoordinates'
import isValidBoundary from '../utils/checkBoundary'

export default function GameBoard() {
  let board
  function createBoard() {
    board = Array.from({ length: 10 }, () => Array(10).fill(null))
  }

  function placeShips(ship) {
    const [x, y] = generateRandomCoordinates()
    board[x][y] = ship
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
