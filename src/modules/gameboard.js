import Ship from './ship.js'
import generateRandomCoordinates from '../utils/generateCoordinates.js'
import isValidBoundary from '../utils/checkBoundary.js'
import isNonOverlappingHorizontally from '../utils/checkOverlap.js'

export default function GameBoard() {
  let board
  let missedCoord = []
  let hitCoord = []
  function createBoard() {
    board = Array.from({ length: 10 }, () => Array(10).fill(null))
  }

  function placeShipsHorizontally(ship, [x, y], orientation) {
    const length = ship.shipLength()
    if (
      isValidBoundary(x, y, length, orientation) &&
      isNonOverlappingHorizontally(x, y, board, length)
    ) {
      for (let i = 0; i < length; i++) {
        if (orientation === 'horizontal') {
          board[x][y + i] = ship
        } else if (orientation === 'vertical') {
          board[x + i][y] = ship
        }
      }
      return true
    }
    return false
  }

  function isAlreadyInteracted(x, y) {
    let isInteracted = false
    let attackedCells = [...missedCoord, ...hitCoord]
    for (let i = 0; i < attackedCells.length; i++) {
      const [attackedX, attackedY] = attackedCells[i]
      if (attackedX === x && attackedY === y) {
        isInteracted = true
        break
      }
    }
    return isInteracted
  }

  function receiveAttack(x, y) {
    if (!isAlreadyInteracted(x, y)) {
      if (board[x][y] !== null) {
        const currShip = board[x][y]
        hitCoord.push([x, y])
        currShip.hit()
      } else {
        missedCoord.push([x, y])
      }
      return true
    }
    return false
  }

  function allShipsSunk() {
    let shipsSunk = true
    for (const row of board) {
      for (const tile of row) {
        if (tile !== null) {
          if (tile.isSunk() === false) {
            shipsSunk = false
          }
        }
      }
    }
    return shipsSunk
  }

  function checkMissedCoord() {
    return missedCoord
  }

  function isShipSunk(x, y) {
    return board[x][y] !== null ? board[x][y].isSunk() : false
  }

  function isShip(x, y) {
    return board[x][y] !== null
  }

  function isHit(x, y) {
    let hit = hitCoord
    let isShipHit = false
    for (let i = 0; i < hit.length; i++) {
      const [hitX, hitY] = hit[i]
      if (hitX === x && hitY === y) {
        isShipHit = true
        break
      }
    }
    return isShipHit
  }

  function isMiss(x, y) {
    let missed = missedCoord
    let isMissed = false
    for (let i = 0; i < missed.length; i++) {
      const [missX, missY] = missed[i]
      if (missX === x && missY === y) {
        isMissed = true
        break
      }
    }
    return isMissed
  }

  return {
    createBoard,
    placeShipsHorizontally,
    receiveAttack,
    checkMissedCoord,
    allShipsSunk,
    isShip,
    isMiss,
    isHit,
    isShipSunk,
  }
}
