import Ship from './ship.js'
import Player from './player.js'
import {
  generateRandomCoordinates,
  generateRandomNumber,
} from '../utils/generateCoordinates.js'
import { placeShips } from '../utils/placeShips.js'

export default function gameEngine() {
  let gamePhase = 'setup'
  let orientation = 'horizontal'
  let computerTurn = false
  let humanTurn = true
  let winner = null
  let humanPlayer
  let computerPlayer
  let nextLogicalAttackInfo = null

  function startGame(mode) {
    humanPlayer = Player('Human')
    if (mode === 'auto') {
      placeShips(humanPlayer)
    }
    computerPlayer = Player('Computer')
    placeShips(computerPlayer)
    onShipsPlaced()
  }

  function setOrientation(newOrientation) {
    orientation = newOrientation
  }

  function getHumanPlayer() {
    return humanPlayer
  }

  function getComputerPlayer() {
    return computerPlayer
  }

  function placeShipsManually(x, y) {
    const count = humanPlayer.getPlacedShipsCount()

    const humanFleet = humanPlayer.getFleet()
    const ship = humanFleet[count]
    humanPlayer.placeShip(ship, [Number(x), Number(y)], orientation)
    onShipsPlaced()
  }

  function onShipsPlaced() {
    if (
      humanPlayer.getPlacedShipsCount() === 5 &&
      computerPlayer.getPlacedShipsCount() === 5
    ) {
      gamePhase = 'running'
    }
  }

  function onAllShipsSunk() {
    if (computerPlayer.allShipsSunk() || humanPlayer.allShipsSunk()) {
      gamePhase = 'gameover'
    }
  }

  function humanAttack(x, y) {
    if (gamePhase === 'running' && humanTurn) {
      // if (computerPlayer.receiveAttack(Number(x), Number(y))) {
      //   humanTurn = false
      //   computerTurn = true
      //   onAllShipsSunk()
      //   return true
      // }
      // return false
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
  function computerAttack() {
    if (gamePhase === 'running' && computerTurn) {
      let { placement, coords } = computerMove()
      let [x, y] = coords
      let boardAttack = humanPlayer.receiveAttack(Number(x), Number(y))

      while (!boardAttack.valid) {
        console.log('retry')
        console.log(nextLogicalAttackInfo)
        let newMove = computerMove()
        placement = newMove.placement
        ;[x, y] = newMove.coords
        console.log(x, y, 'inside loop')
        boardAttack = humanPlayer.receiveAttack(Number(x), Number(y))
        console.log(boardAttack.result, boardAttack.valid)
      }

      if (boardAttack.result === 'hit' && boardAttack.ship.isSunk()) {
        console.log('ship sunk')
        nextLogicalAttackInfo = null
      } else if (
        boardAttack.result === 'hit' &&
        nextLogicalAttackInfo === null
      ) {
        console.log('after 1st attack')
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
        console.log(placement, 'after 2 attacks')

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
      // console.log(x,y)
      // console.log(placement)
      possibleMoves = [
        { placement: 'horizontal', coords: [x, y + 1] },
        { placement: 'horizontal', coords: [x, y - 1] },
        { placement: 'vertical', coords: [x + 1, y] },
        { placement: 'vertical', coords: [x - 1, y] },
      ]

      possibleMoves = filterValidMoves(possibleMoves, failedPaths, initialHit)

      if (placement === null) {
        console.log(possibleMoves)
        if (possibleMoves.length === 0) {
          return { placement: null, coords: generateRandomCoordinates() }
        }
        randomNum = generateRandomNumber(possibleMoves.length)
        console.log(randomNum)

        return possibleMoves[randomNum]
      } else if (placement) {
        possibleMoves = possibleMoves.filter(
          (move) => move.placement === placement,
        )
        randomNum = generateRandomNumber(2)
        console.log('placement mode on')

        if (state === 'miss') {
          console.log('missed with placement known')
          return handleMiss(placement, initialHit, coords)
        }
        if ((state = 'hit')) {
          console.log(initialHit, coords, 'hit block')
          return handleHit(placement, initialHit, coords)
        }
      }
    }
  }

  function isValidCell(coords) {
    let [x, y] = coords
    return !humanPlayer.isHit(x, y) && !humanPlayer.isMiss(x, y)
  }

  function filterValidMoves(possibleMoves, failedPaths, initialHit) {
    let [x, y] = initialHit
    let moves = possibleMoves
    console.log('filtering')
    return moves.filter((move) => {
      let [x, y] = move.coords
      return (
        !humanPlayer.isHit(x, y) &&
        !humanPlayer.isMiss(x, y) &&
        isValidBoundary([x, y])
      )
    })
  }

  function isValidBoundary(coords) {
    console.log('checking computer boundary')

    const boardMin = 0
    const boardMax = 9
    let [x, y] = coords
    return x <= boardMax && x >= boardMin && y <= boardMax && y >= boardMin
  }

  function handleHit(placement, initialHit, coords) {
    let direction = determineDirection(initialHit, coords)
    let nextCell = getNextCell(coords, direction)
    if (!isValidCell(nextCell) || !isValidBoundary(nextCell)) {
      console.log('return block if hit alredy hit cell')
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
    placeShipsManually,
    humanAttack,
    computerAttack,
    checkWinner,
    resetGame,
    currGamePhase,
  }
}
