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
    renderGameBoard(engine.getComputerPlayer(), computerBoard, {
      hideShip: true,
    })
    if (engine.checkWinner().status) {
      console.log(`game finishes ${engine.checkWinner().winner} won the game`)
      gameResult(engine.checkWinner().winner)
     
    }
    // make computerTurn true, disable the computer board,
    setTimeout(() => {
      engine.computerAttack()
      renderGameBoard(engine.getHumanPlayer(), humanBoard, {
        hideShip: false,
      })
      if (engine.checkWinner().status && engine.checkWinner().winner === "Computer" ) {
        gameResult(engine.checkWinner().winner)
        console.log(`game finishes ${engine.checkWinner().winner} won the game`)
      }
    }, 300)
    
  }
})

function gameResult(player) {
  const topContainer = document.querySelector('.top-section')
  topContainer.innerHTML = ""
  const msgContainer = document.createElement('div')
  msgContainer.classList.add('msg-container')
  const resultMsg = document.createElement("p")
  resultMsg.classList.add('result-msg')
  resultMsg.textContent = `Congrats ${player} has won!!`
  const restartBtn = document.createElement('button')
  restartBtn.textContent = "Restart"
  restartBtn.classList.add('restart-btn')
  restartBtn.addEventListener('click', (e) => {
    topContainer.innerHTML=""
    resetGame()
  })

  msgContainer.appendChild(resultMsg)
  msgContainer.appendChild(restartBtn)
  topContainer.appendChild(msgContainer)
}

function resetGame() {
  engine.resetGame()
  renderGameBoard(engine.getHumanPlayer(), humanBoard, { hideShip: false })
  renderGameBoard(engine.getComputerPlayer(), computerBoard, { hideShip: true })
}


export default function renderGameBoard(player, container, { hideShip }) {
  container.innerHTML = ""
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
