import GameBoard from './gameboard'

export default function Player(name) {
  const board = GameBoard()
  board.createBoard()

  function getPlayerName() {
    return name
  }

  function placeShipsHorizontally(ship) {
    board.placeShipsHorizontally(ship)
  }

  function receiveAttack(x, y) {
    board.receiveAttack(x, y)
  }

  function allShipsSunk() {
    return board.allShipsSunk()
  }

  function missedCoord() {
    return board.missedCoord()
  }

  return {
    getPlayerName,
    placeShipsHorizontally,
    receiveAttack,
    allShipsSunk,
    missedCoord,
  }
}
