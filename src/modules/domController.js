import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'
import gameEngine from './game.js'
import renderGameBoard from './renderBoard.js'
import renderOverlay from './renderOverlay.js'

const engine = gameEngine()

export const overlay = renderOverlay()
overlay.classList.add('visible')
initialSetupModal()

//intial game setup overlay lister
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('manual-btn')) {
    overlay.classList.remove('visible')
    humanBoard.appendChild(renderOrientationBtns())
    engine.startGame()
  } else if (e.target.classList.contains('auto-btn')) {
    overlay.classList.remove('visible')
    engine.startGame('auto')
    renderGameBoard(humanBoard, { hideShip: false }, engine.getHumanPlayer())
  }
  renderGameBoard(
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

export const humanBoard = document.createElement('div')
humanBoard.classList.add('hum-container')
renderGameBoard(humanBoard, { hideShip: false })

export const computerBoard = document.createElement('div')
computerBoard.classList.add('computer-container')
renderGameBoard(computerBoard, { hideShip: true })

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

    renderGameBoard(humanBoard, { hideShip: false }, engine.getHumanPlayer())
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
    renderGameBoard(
      computerBoard,
      {
        hideShip: true,
      },
      engine.getComputerPlayer(),
    )
    if (engine.checkWinner().status) {
      console.log(`game finishes ${engine.checkWinner().winner} won the game`)
      gameResult(engine.checkWinner().winner)
      overlay.classList.add('visible')
    }
    // make computerTurn true, disable the computer board,
    setTimeout(() => {
      engine.computerAttack()
      renderGameBoard(
        humanBoard,
        {
          hideShip: false,
        },
        engine.getHumanPlayer(),
      )
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
  renderGameBoard(humanBoard, { hideShip: false })
  renderGameBoard(computerBoard, { hideShip: true })
}
