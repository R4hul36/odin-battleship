import GameBoard from './gameboard.js'
import Ship from './ship.js'


export default function Player(name) {
  const board = GameBoard()
  board.createBoard()
  const fleet = [Ship(2, 'Corvettes', "#00838f"), Ship(3, 'Destroyers', "#455a64"), Ship(3, 'Destroyers', "#455a64"), Ship(4, 'Cruisers', "#607d8b"), Ship(5, "Aircraft Carriers", "#546e7a")]

  function getPlayerName() {
    return name
  } 
   
  function getFleet () {
    return fleet
  }

  function placeShip(ship, coord, orientation) {
    if (board.placeShip(ship, coord, orientation)) {
      return true
    }
    return false
  }

  function canPlaceShips(x,y,length, orientation) {
    return board.canPlaceShips(x,y,length,orientation)
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

  function isShipSunk(x, y) {
    return board.isShipSunk(x, y)
  }

  function isShip(x, y) {
    return board.isShip(x, y)
  }

  function isMiss(x, y) {
    return board.isMiss(x, y)
  }

  function isHit(x, y) {
    return board.isHit(x, y)
  }

  function getPlacedShipsCount() {
    return board.getPlacedShipsCount()
  }

  function getShipAt(x,y) {
    return board.getShipAt(x,y)
  }


  return {
    getPlayerName,
    placeShip,
    canPlaceShips,
    getPlacedShipsCount,
    getFleet,
    receiveAttack,
    allShipsSunk,
    missedCoord,
    isShipSunk,
    isShip,
    isMiss,
    isHit,
    getShipAt
  }
}
