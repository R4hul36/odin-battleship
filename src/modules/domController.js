import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'
import gameEngine from './game.js'
import renderGameBoard from './renderBoard.js'
import renderOverlay from './renderOverlay.js'

const engine = gameEngine()
let humanIndicator
let computerIndicator

export const overlay = renderOverlay()
overlay.classList.add('visible')
initialSetupModal()

// Render the gameboards and the turn indicators
function renderGame(board, hideShip, player) {
  renderGameBoard(board, hideShip, player)
  if (engine.currGamePhase() === 'running') {
    renderTurnIndicator()
  }
}

function renderTurnIndicator() {
  if (!humanIndicator) {
    humanIndicator = createTurnIndicator('Your turn')
    computerIndicator = createTurnIndicator("Computer's turn")

    humanIndicator.classList.add('active')
    computerIndicator.classList.add('inactive')
  }

  computerBoard.appendChild(humanIndicator)
  humanBoard.appendChild(computerIndicator)
}

// Updates the active class each turn
function updateActiveIndicator(player) {
  if (player === 'human') {
    humanIndicator.classList.add('active')
    humanIndicator.classList.remove('inactive')
    computerIndicator.classList.add('inactive')
    computerIndicator.classList.remove('active')
  } else {
    humanIndicator.classList.add('inactive')
    humanIndicator.classList.remove('active')
    computerIndicator.classList.add('active')
    computerIndicator.classList.remove('inactive')
  }
}

//intial game setup overlay lister
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('manual-btn')) {
    engine.startGame()
    overlay.classList.remove('visible')
    humanBoard.appendChild(renderOrientationBtns())
  } else if (e.target.classList.contains('auto-btn')) {
    overlay.classList.remove('visible')
    engine.startGame('auto')
    renderGame(humanBoard, { hideShip: false }, engine.getHumanPlayer())
  }
  renderGame(
    computerBoard,
    {
      hideShip: true,
    },
    engine.getComputerPlayer(),
  )
})

// render the orientation button
export default function renderOrientationBtns() {
  const btnContainer = document.createElement('div')
  btnContainer.classList.add('orientation-btn')
  const toggleBtn = document.createElement('button')
  toggleBtn.classList.add('toggle-btn')
  toggleBtn.textContent = `${engine.getOrientation() === 'horizontal' ? 'Place Vertically' : 'Place Horizontally'}`
  btnContainer.appendChild(toggleBtn)
  return btnContainer
}

function createTurnIndicator(msg) {
  const indicatorContainer = document.createElement('div')
  indicatorContainer.classList.add('indicator-container')
  const indicatorMsg = document.createElement('p')
  indicatorMsg.textContent = msg
  indicatorContainer.appendChild(indicatorMsg)
  return indicatorContainer
}

export const humanBoard = document.createElement('div')
humanBoard.classList.add('hum-container')
renderGame(humanBoard, { hideShip: false })

export const computerBoard = document.createElement('div')
computerBoard.classList.add('computer-container')
renderGame(computerBoard, { hideShip: true })

// Toggles the orientaion after each click and re-renders the button label
humanBoard.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggle-btn')) {
    engine.setOrientation()
  }
  let btnContainer = document.querySelector('.orientation-btn')
  humanBoard.removeChild(btnContainer)
  humanBoard.appendChild(renderOrientationBtns())
})

// In setup mode, each click on a cell in the humanboard places a new ship
humanBoard.addEventListener('click', (e) => {
  if (
    engine.currGamePhase() === 'gameover' ||
    engine.currGamePhase() === 'running'
  ) {
    return
  }

  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    engine.placeShipsManually(x, y, 'horizontal')

    renderGame(humanBoard, { hideShip: false }, engine.getHumanPlayer())
    if (engine.currGamePhase() === 'setup') {
      humanBoard.appendChild(renderOrientationBtns())
    }
  }
})

// In setup mode shows a restriction icon if it's not possible to place a ship
humanBoard.addEventListener('mouseover', (e) => {
  if (
    engine.currGamePhase() === 'running' ||
    engine.currGamePhase() === 'gameover'
  ) {
    return
  }
  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    if (!engine.canPlaceShips(x, y)) {
      e.target.classList.add('invalid-placement')
    } else {
      e.target.classList.remove('invalid-placement')
    }
  }
})

// Handles each players turn and renders the changed state on the board
computerBoard.addEventListener('click', (e) => {
  if (engine.currGamePhase() === 'gameover') {
    return
  }

  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    // Human players turn to attack
    if (!engine.humanAttack(x, y)) {
      return
    }
    renderGame(
      computerBoard,
      {
        hideShip: true,
      },
      engine.getComputerPlayer(),
    )
    updateActiveIndicator('computer')
    if (engine.checkWinner().status) {
      gameResult(engine.checkWinner().winner)
      overlay.classList.add('visible')
    }
    // Computer players turn to attack
    setTimeout(() => {
      engine.computerAttack()
      renderGame(
        humanBoard,
        {
          hideShip: false,
        },
        engine.getHumanPlayer(),
      )
      updateActiveIndicator('human')
      if (
        engine.checkWinner().status &&
        engine.checkWinner().winner === 'Computer'
      ) {
        gameResult(engine.checkWinner().winner)
        overlay.classList.add('visible')
      }
    }, 500)
  }
})

// The results overlay with a restart button
function gameResult(player) {
  //const topContainer = document.querySelector('.top-section')
  overlay.innerHTML = ''
  const msgContainer = document.createElement('div')
  msgContainer.classList.add('msg-container')
  const resultMsg = document.createElement('p')
  resultMsg.classList.add('result-msg')
  resultMsg.textContent = `Congrats ${player} has won!!`
  const restartBtn = document.createElement('button')
  restartBtn.textContent = 'Restart'
  restartBtn.classList.add('restart-btn')
  restartBtn.addEventListener('click', (e) => {
    // overlay.innerHTML = ''
    // overlay.classList.remove('visible')
    resetGame()
    initialSetupModal()
  })
  msgContainer.appendChild(resultMsg)
  msgContainer.appendChild(restartBtn)
  overlay.appendChild(msgContainer)
}

// Initial setup overlay
function initialSetupModal() {
  overlay.innerHTML = ''
  const setUpContainer = document.createElement('div')
  setUpContainer.classList.add('setup-container')
  const selectionSection = document.createElement('div')
  selectionSection.classList.add('selection')
  const txt = document.createElement('p')
  txt.textContent = 'Choose how to place the ships: '

  const btnContainer = document.createElement('div')
  btnContainer.classList.add('orientation-btn-container')
  const manual = document.createElement('button')
  manual.classList.add('manual-btn')
  manual.textContent = 'Manual'
  const automatic = document.createElement('button')
  automatic.classList.add('auto-btn')
  automatic.textContent = 'Automatic'

  btnContainer.appendChild(manual)
  btnContainer.appendChild(automatic)
  selectionSection.appendChild(txt)
  selectionSection.appendChild(btnContainer)

  setUpContainer.appendChild(selectionSection)

  overlay.appendChild(setUpContainer)
}

function resetGame() {
  engine.resetGame()
  humanIndicator = null
  computerIndicator = null
  renderGame(humanBoard, { hideShip: false })
  renderGame(computerBoard, { hideShip: true })
}
