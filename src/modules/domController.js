import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'
import gameEngine from './game.js'

const engine = gameEngine()
engine.startGame()

export const humanBoard = document.createElement('div')
humanBoard.classList.add('hum-container')
renderGameBoard(engine.getHumanPlayer(), humanBoard, { hideShip: false })

export const computerBoard = document.createElement('div')
computerBoard.classList.add('computer-container')
renderGameBoard(engine.getComputerPlayer(), computerBoard, { hideShip: true })

computerBoard.addEventListener('click', (e) => {
  if (!engine.isGameRunning()) {
    return
  }
  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    if (!engine.humanAttack(x, y)) {
      return
    }
    computerBoard.innerHTML = ''
    renderGameBoard(engine.getComputerPlayer(), computerBoard, {
      hideShip: true,
    })
    if (engine.checkWinner().status) {
      console.log(`game finishes ${engine.checkWinner().winner} won the game`)
    }
    // make computerTurn true, disable the computer board,
    setTimeout(() => {
      engine.computerAttack()
      humanBoard.innerHTML = ''
      renderGameBoard(engine.getHumanPlayer(), humanBoard, {
        hideShip: false,
      })
    }, 300)
    if (engine.checkWinner().status) {
      console.log(`game finishes ${engine.checkWinner().winner} won the game`)
    }
  }
})

function newGame() {
  if (engine.checkWinner()) {
  }
}

export default function renderGameBoard(player, container, { hideShip }) {
  const boardWidth = 10
  const boardHeight = 10
  console.log('sdfsdfsdf')

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')

      if (player.isShipSunk(i, j)) {
        cell.classList.add('ship-sunk')
      }
      if (player.isHit(i, j)) {
        console.log('hittt')
        cell.classList.add('ship-hit')
        const dmgIndicator = document.createElement('p')
        dmgIndicator.textContent = 'x'
        cell.appendChild(dmgIndicator)
      } else if (player.isMiss(i, j)) {
        cell.classList.add('miss')
      } else if (!hideShip && player.isShip(i, j)) {
        cell.classList.add('ship')
      }

      container.appendChild(cell)
      cell.dataset.coords = `${i},${j}`
    }
  }
}
