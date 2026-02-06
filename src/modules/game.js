import Ship from './ship.js'
import Player from './player.js'
import { generateRandomCoordinates } from '../utils/generateCoordinates.js'
import { placeShips } from '../utils/placeShips.js'

export default function gameEngine() {
  let gameRunning = false
  let computerTurn = false
  let humanTurn = true
  let winner = null
  let humanPlayer
  let computerPlayer

  function startGame(mode) {
    humanPlayer = Player('Human')
    // const ship1 = Ship(7)
    // humanPlayer.placeShipsHorizontally(ship1, [1, 2])
    if (mode === 'auto') {
      placeShips(humanPlayer)
    }

    computerPlayer = Player('Computer')
    placeShips(computerPlayer)
  }

  function getHumanPlayer() {
    return humanPlayer
  }

  function getComputerPlayer() {
    return computerPlayer
  }

  function humanAttack(x, y) {
    if (gameRunning && humanTurn) {
      if (computerPlayer.receiveAttack(Number(x), Number(y))) {
        humanTurn = false
        computerTurn = true
        return true
      }
      return false
    }
    return false
  }
  function computerAttack() {
    if (gameRunning && computerTurn) {
      let [x, y] = generateRandomCoordinates()
      while (!humanPlayer.receiveAttack(x, y)) {
        console.log('attacks')
        ;[x, y] = generateRandomCoordinates()
      }
      humanTurn = true
      computerTurn = false
    }
  }

  function checkWinner() {
    let status = false

    if (computerPlayer.allShipsSunk() || humanPlayer.allShipsSunk()) {
      gameRunning = false
      status = true
    }
    if (computerPlayer.allShipsSunk()) {
      winner = 'Human'
    } else if (humanPlayer.allShipsSunk()) {
      winner = 'Computer'
    }
    return {
      status,
      winner,
    }
  }

  function isGameRunning() {
    return gameRunning
  }

  function resetGame() {
    startGame()
    gameRunning = true
    humanTurn = true
    computerTurn = false
    winner = null
  }

  return {
    startGame,
    getHumanPlayer,
    getComputerPlayer,
    humanAttack,
    computerAttack,
    checkWinner,
    resetGame,
    isGameRunning,
  }
}
