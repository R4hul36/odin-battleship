import Ship from './ship.js'
import Player from './player.js'
import {
  generateRandomCoordinates,
  generateRandomNumber,
} from '../utils/generateCoordinates.js'
import { placeShips } from '../utils/placeShips.js'
import isNonOverlapping from '../utils/checkOverlap.js'
import isValidBoundary from '../utils/checkBoundary.js'

export default function gameEngine() {
  let gamePhase = 'setup'
  let orientation = 'horizontal'
  let computerTurn = false
  let humanTurn = true
  let winner = null
  let humanPlayer
  let computerPlayer
  let nextLogicalAttackInfo = null

  // Initialize a game by creating players, which will also create their particular boars
  function startGame(mode) {
    humanPlayer = Player('Human')
    if (mode === 'auto') {
      placeShips(humanPlayer)
    }
    computerPlayer = Player('Computer')
    placeShips(computerPlayer)
    onShipsPlaced()
  }

  function setOrientation() {
    orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal'
  }

  function getOrientation() {
    return orientation
  }

  function getHumanPlayer() {
    return humanPlayer
  }

  function getComputerPlayer() {
    return computerPlayer
  }

  // Placing ships on manual mode
  function placeShipsManually(x, y) {
    const count = humanPlayer.getPlacedShipsCount()

    const humanFleet = humanPlayer.getFleet()
    const ship = humanFleet[count]
    humanPlayer.placeShip(ship, [Number(x), Number(y)], orientation)
    onShipsPlaced()
  }

  // check if a ship can be placed on a particular cell
  function canPlaceShips(x, y) {
    const count = humanPlayer.getPlacedShipsCount()

    const humanFleet = humanPlayer.getFleet()
    const ship = humanFleet[count]
    // return isNonOverlapping(Number(x), Number(y), humanPlayer, ship.shipInfo().length, orientation)
    return humanPlayer.canPlaceShips(
      Number(x),
      Number(y),
      ship.shipInfo().length,
      orientation,
    )
  }

  // Change game state once all ships are placed
  function onShipsPlaced() {
    if (
      humanPlayer.getPlacedShipsCount() === 5 &&
      computerPlayer.getPlacedShipsCount() === 5
    ) {
      gamePhase = 'running'
    }
  }

  // Change state to gameover once all the ships are sunk
  function onAllShipsSunk() {
    if (computerPlayer.allShipsSunk() || humanPlayer.allShipsSunk()) {
      gamePhase = 'gameover'
    }
  }

  // On each valid attack in running mode computer player takes damage
  function humanAttack(x, y) {
    if (gamePhase === 'running' && humanTurn) {
      const { valid, ship, result } = computerPlayer.receiveAttack(
        Number(x),
        Number(y),
      )
      if (valid) {
        humanTurn = false
        computerTurn = true
        onAllShipsSunk()
        return true
      }
      if (!valid) {
        return false
      }
    }
    return false
  }

  // Logical move set on computer

  function computerAttack() {
    // Runs when mode is running and if it's computer's turn
    if (gamePhase === 'running' && computerTurn) {
      let { placement, coords } = computerMove()
      let [x, y] = coords
      let boardAttack = humanPlayer.receiveAttack(Number(x), Number(y))

      // If it's not a valid attack, request a new move from computerMove
      while (!boardAttack.valid) {
        let newMove = computerMove()
        placement = newMove.placement
        ;[x, y] = newMove.coords
        boardAttack = humanPlayer.receiveAttack(Number(x), Number(y))
      }

      // These blocks check if a ship isSunk, initial hit, miss etc and change the logicalAttackInfo state accordingly
      if (boardAttack.result === 'hit' && boardAttack.ship.isSunk()) {
        nextLogicalAttackInfo = null
      } else if (
        boardAttack.result === 'hit' &&
        nextLogicalAttackInfo === null
      ) {
        nextLogicalAttackInfo = {
          state: 'hit',
          initialHit: [x, y],
          coords: [x, y],
          placement: null,
          currentPath: null,
          failedPaths: [],
        }
      } else if (
        boardAttack.result === 'hit' &&
        nextLogicalAttackInfo !== null
      ) {
        nextLogicalAttackInfo.state = 'hit'
        nextLogicalAttackInfo.coords = [x, y]
        nextLogicalAttackInfo.placement = placement
      } else if (boardAttack.result === 'miss' && nextLogicalAttackInfo) {
        if (nextLogicalAttackInfo.placement) {
          nextLogicalAttackInfo.state = 'miss'
          nextLogicalAttackInfo.coords = [x, y]
        }
      }

      onAllShipsSunk()
      humanTurn = true
      computerTurn = false
    }
  }

  // The next core logical move is calculated here
  function computerMove() {
    //find a target by attacking ship randomly
    let randomNum
    let possibleMoves
    if (nextLogicalAttackInfo === null) {
      const coords = generateRandomCoordinates()
      return { placement: null, coords }
    } else {
      let { state, initialHit, coords, placement, currentPath, failedPaths } =
        nextLogicalAttackInfo
      let [x, y] = initialHit
      possibleMoves = [
        { placement: 'horizontal', coords: [x, y + 1] },
        { placement: 'horizontal', coords: [x, y - 1] },
        { placement: 'vertical', coords: [x + 1, y] },
        { placement: 'vertical', coords: [x - 1, y] },
      ]

      possibleMoves = filterValidMoves(possibleMoves, failedPaths, initialHit)

      if (placement === null) {
        if (possibleMoves.length === 0) {
          return { placement: null, coords: generateRandomCoordinates() }
        }
        randomNum = generateRandomNumber(possibleMoves.length)
        return possibleMoves[randomNum]
      } else if (placement) {
        possibleMoves = possibleMoves.filter(
          (move) => move.placement === placement,
        )
        randomNum = generateRandomNumber(2)

        if (state === 'miss') {
          return handleMiss(placement, initialHit, coords)
        }
        if ((state = 'hit')) {
          return handleHit(placement, initialHit, coords)
        }
      }
    }
  }

  // checks if a particular cell is already hit or miss
  function isValidCell(coords) {
    let [x, y] = coords
    return !humanPlayer.isHit(x, y) && !humanPlayer.isMiss(x, y)
  }

  // filter out valid moves from the four possible moves
  function filterValidMoves(possibleMoves, failedPaths, initialHit) {
    let [x, y] = initialHit
    let moves = possibleMoves
    return moves.filter((move) => {
      let [x, y] = move.coords
      return (
        !humanPlayer.isHit(x, y) &&
        !humanPlayer.isMiss(x, y) &&
        isValidMove([x, y])
      )
    })
  }

  // checks if the coords are not out of bounds
  function isValidMove(coords) {
    const boardMin = 0
    const boardMax = 9
    let [x, y] = coords
    return x <= boardMax && x >= boardMin && y <= boardMax && y >= boardMin
  }
  // Once a ship direction is found go right or left until a ship is sunk
  function handleHit(placement, initialHit, coords) {
    let direction = determineDirection(initialHit, coords)
    let nextCell = getNextCell(coords, direction)
    if (!isValidCell(nextCell) || !isValidMove(nextCell)) {
      direction = getOppositeDirection(direction)
      nextCell = getNextCell(initialHit, direction)
      if (!isValidCell(nextCell)) {
        return { placement: null, coords: generateRandomCoordinates() }
      }
      nextLogicalAttackInfo.coords = nextCell
      nextLogicalAttackInfo.currentPath = 'left'
      return { placement: placement, coords: nextCell }
    }
    return { placement, coords: nextCell }
  }

  // If an attack is missed after finding the placement, change the direction, if still not found resume random hunting
  function handleMiss(placement, initialHit, coords) {
    let direction = determineDirection(initialHit, coords)
    direction = getOppositeDirection(direction)
    let nextCell = getNextCell(initialHit, direction)
    if (!isValidCell(nextCell)) {
      nextLogicalAttackInfo = null
      return { placement: null, coords: generateRandomCoordinates() }
    }
    return { placement: placement, coords: nextCell, path: direction }
  }

  // Find the direction to lock on by checking initial and 2nd hits
  function determineDirection(initialHit, coords) {
    if (initialHit[1] < coords[1]) {
      return 'right'
    }
    if (initialHit[1] > coords[1]) {
      return 'left'
    }
    if (initialHit[0] < coords[0]) {
      return 'down'
    }
    if (initialHit[0] > coords[0]) {
      return 'up'
    }
  }

  function getOppositeDirection(direction) {
    const directions = {
      right: 'left',
      left: 'right',
      up: 'down',
      down: 'up',
    }
    return directions[direction]
  }
  //Find the next cell after the direction is found
  function getNextCell(coords, direction) {
    if (direction === 'right') {
      return [coords[0], coords[1] + 1]
    }
    if (direction === 'left') {
      return [coords[0], coords[1] - 1]
    }
    if (direction === 'down') {
      return [coords[0] + 1, coords[1]]
    }
    if (direction === 'up') {
      return [coords[0] - 1, coords[1]]
    }
  }

  // Find a winner after cheking the status of all their ships
  function checkWinner() {
    let status = false

    if (computerPlayer.allShipsSunk()) {
      winner = 'Human'
      status = true
    } else if (humanPlayer.allShipsSunk()) {
      winner = 'Computer'
      status = true
    }
    return {
      status,
      winner,
    }
  }

  function currGamePhase() {
    return gamePhase
  }

  // Resets game to default state
  function resetGame() {
    gamePhase = 'setup'
    humanTurn = true
    computerTurn = false
    humanPlayer = null
    computerPlayer = null
    winner = null
    nextLogicalAttackInfo = null
  }

  return {
    startGame,
    getHumanPlayer,
    getComputerPlayer,
    setOrientation,
    getOrientation,
    placeShipsManually,
    canPlaceShips,
    humanAttack,
    computerAttack,
    checkWinner,
    resetGame,
    currGamePhase,
  }
}
