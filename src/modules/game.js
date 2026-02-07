import Ship from './ship.js'
import Player from './player.js'
import { generateRandomCoordinates } from '../utils/generateCoordinates.js'
import { placeShips } from '../utils/placeShips.js'

export default function gameEngine() {
  let gamePhase = 'setup'
  let computerTurn = false
  let humanTurn = true
  let winner = null
  let humanPlayer
  let computerPlayer
  let shipCount = 0

  function startGame(mode) {
    humanPlayer = Player('Human')
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

  function placeShipsManually (x,y) {
      if(shipCount === 4) {
        gamePhase = "running"
      }
      const humanFleet = humanPlayer.getFleet()
      const ship = humanFleet[shipCount]
      
      console.log(humanPlayer)
      if(humanPlayer.placeShip(ship, [Number(x),Number(y)], 'horizontal')) {
        shipCount++
        console.log(shipCount)
      }
  }

  function humanAttack(x, y) {
    if (gamePhase === 'running' && humanTurn) {
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
    if (gamePhase === 'running' && computerTurn) {
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
      gamePhase = 'gameover'
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

  function currGamePhase() {
    return gamePhase
  }

  function resetGame() {
    gamePhase = 'setup'
    startGame('auto')
    humanTurn = true
    computerTurn = false
    winner = null
  }

  return {
    startGame,
    getHumanPlayer,
    getComputerPlayer,
    placeShipsManually,
    humanAttack,
    computerAttack,
    checkWinner,
    resetGame,
    currGamePhase,
  }
}
