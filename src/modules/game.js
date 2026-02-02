import Ship from './ship.js'
import Player from './player.js'
import renderGameBoard from './domController.js'
import generateRandomCoordinates from '../utils/generateCoordinates.js'

export const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1, [1, 2])

export const computerPlayer = Player('Computer')
const ship2 = Ship(3)
computerPlayer.placeShipsHorizontally(ship2, [4, 1])

export default function gameEngine() {
  let gameRunning = true
  let computerTurn = false
  let humanTurn = true
  let winner = ''

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

  return {
    humanAttack,
    computerAttack,
    checkWinner,
  }
}
