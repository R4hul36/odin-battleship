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

  function isShip(x,y) {
    return board.isShip()
  }

   function isMiss(x,y) {
    return board.isMiss()
  }

   function isHit(x,y) {
    return board.isHit()
  }
  
  return {
    getPlayerName,
    placeShipsHorizontally,
    receiveAttack,
    allShipsSunk,
    missedCoord,
    isShip,
    isMiss,
    isHit
  }
}
