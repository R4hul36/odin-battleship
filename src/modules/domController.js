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

function renderGame (board, hideShip, player) {
  renderGameBoard(board, hideShip, player)
  if(engine.currGamePhase() === "running") {
    renderTurnIndicator()
  }
}

function renderTurnIndicator () {
  console.log("renderTurnIndicator called", humanIndicator)
  if(!humanIndicator) {
     humanIndicator = createTurnIndicator("Your turn")
    computerIndicator = createTurnIndicator("Computer's turn")

    humanIndicator.classList.add('active')
    computerIndicator.classList.add('inactive')
  }

  
  computerBoard.appendChild(humanIndicator)
  humanBoard.appendChild(computerIndicator)
}

function updateActiveIndicator(player) {  
  if(player === "human") {
    humanIndicator.classList.add("active")
    humanIndicator.classList.remove('inactive')
    computerIndicator.classList.add('inactive')
    computerIndicator.classList.remove('active')
  }else {
    humanIndicator.classList.add("inactive")
    humanIndicator.classList.remove('active')
    computerIndicator.classList.add('active')
    computerIndicator.classList.remove('inactive')
  }
}

//intial game setup overlay lister
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('manual-btn')) {
    overlay.classList.remove('visible')
    humanBoard.appendChild(renderOrientationBtns())
    engine.startGame()
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

export default function renderOrientationBtns() {
  const btnContainer = document.createElement('div')
  btnContainer.classList.add('orientation-btn')
  const toggleBtn = document.createElement('button')
  toggleBtn.classList.add('toggle-btn')
  toggleBtn.textContent = `${engine.getOrientation() === "horizontal"? "Vertical" : "Horizontal"}`
  btnContainer.appendChild(toggleBtn)
  return btnContainer
}

function createTurnIndicator (msg) {
  const indicatorContainer = document.createElement("div")
  indicatorContainer.classList.add('indicator-container')
  const indicatorMsg = document.createElement("p")
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

humanBoard.addEventListener('click', (e) => {
  
  if (e.target.classList.contains('toggle-btn')) {
    engine.setOrientation()
  }
  let btnContainer = document.querySelector('.orientation-btn')
  humanBoard.removeChild(btnContainer) 
  humanBoard.appendChild(renderOrientationBtns())
})

humanBoard.addEventListener('click', (e) => {
  if (
    engine.currGamePhase() === 'gameover' ||
    engine.currGamePhase() === 'running'
  ) {
    return
  }

  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    console.log('sdfdf')
    engine.placeShipsManually(x, y, 'horizontal')

    renderGame(humanBoard, { hideShip: false }, engine.getHumanPlayer())
    if (engine.currGamePhase() === 'setup') {
      humanBoard.appendChild(renderOrientationBtns())
    }
  }
})

computerBoard.addEventListener('click', (e) => {
  if (engine.currGamePhase() === 'gameover') {
    return
  }

  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    console.log('sdfsdf')
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
      console.log(`game finishes ${engine.checkWinner().winner} won the game`)
      gameResult(engine.checkWinner().winner)
      overlay.classList.add('visible')
    }
    // make computerTurn true, disable the computer board,
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
        console.log(`game finishes ${engine.checkWinner().winner} won the game`)
        overlay.classList.add('visible')
      }
    }, 300)
  }
})

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

function initialSetupModal() {
  overlay.innerHTML = ''
  const setUpContainer = document.createElement('div')
  setUpContainer.classList.add('setup-container')
  const nameLabel = document.createElement('label')
  const nameInput = document.createElement('input')
  nameLabel.textContent = 'Name: '
  nameInput.value = 'Human'
  const selectionSection = document.createElement('div')
  selectionSection.classList.add('selection')
  const txt = document.createElement('p')
  txt.textContent = 'Choose how to place the ships: '
  const manual = document.createElement('button')
  manual.classList.add('manual-btn')
  manual.textContent = 'Manual'
  const automatic = document.createElement('button')
  automatic.classList.add('auto-btn')
  automatic.textContent = 'Automatic'

  selectionSection.appendChild(txt)
  selectionSection.appendChild(manual)
  selectionSection.appendChild(automatic)

  setUpContainer.appendChild(nameLabel)
  setUpContainer.appendChild(nameInput)
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
