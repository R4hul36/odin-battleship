import Ship from './ship.js'
import Player from './player.js'
import renderGameBoard from './domController.js'
import generateRandomCoordinates from '../utils/generateCoordinates.js'



export default function gameEngine() {
  let gameRunning = true
  let computerTurn = false
  let humanTurn = true
  let winner = null
  let humanPlayer
  let computerPlayer

  function startGame() {
    humanPlayer = Player('Human')
    const ship1 = Ship(7)
    humanPlayer.placeShipsHorizontally(ship1, [1, 2])

    computerPlayer = Player('Computer')
    const ship2 = Ship(3)
    computerPlayer.placeShipsHorizontally(ship2, [4, 1])
  }

  function getHumanPlayer () {
    return humanPlayer
  }

  function getComputerPlayer () {
    return computerPlayer
  }

  function humanAttack(x, y) {
    if (gameRunning && humanTurn) {
      computerPlayer.receiveAttack(Number(x), Number(y))
      humanTurn = false
      computerTurn = true
    }
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
    if (computerPlayer.allShipsSunk()) {
      gameRunning = false
      winner = humanPlayer.getPlayerName()
      return true
    }
  }

  function resetGame () {
    startGame()
    gameRunning = true
    humanTurn = true
    winner = null
  }

  return {
    startGame,
    getHumanPlayer,
    getComputerPlayer,
    humanAttack,
    computerAttack,
    checkWinner,
    resetGame
  }
}
