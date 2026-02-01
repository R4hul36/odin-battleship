import GameBoard from './gameboard.js'

export default function Player(name) {
  const board = GameBoard()
  board.createBoard()

  function getPlayerName() {
    return name
  }

  function placeShipsHorizontally(ship, coord) {
    board.placeShipsHorizontally(ship, coord)
  }

  function receiveAttack(x, y) {
    return board.receiveAttack(x, y)
  }

  function allShipsSunk() {
    return board.allShipsSunk()
  }

  function missedCoord() {
    return board.checkMissedCoord()
  }

  function isShipSunk (x, y) {
    return board.isShipSunk(x, y)
  }

  function isShip(x,y) {
    return board.isShip(x,y)
  }

   function isMiss(x,y) {
    return board.isMiss(x,y)
  }

   function isHit(x,y) {
    return board.isHit(x,y)
  }
  
  return {
    getPlayerName,
    placeShipsHorizontally,
    receiveAttack,
    allShipsSunk,
    missedCoord,
    isShipSunk,
    isShip,
    isMiss,
    isHit
  }
}
