import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'
import gameEngine from './game.js'

const engine = gameEngine()
engine.startGame()
console.log(engine.getHumanPlayer());


export const humanBoard = document.createElement('div')
humanBoard.classList.add('hum-container')
renderGameBoard(engine.getHumanPlayer(), humanBoard, { hideShip: false })

export const computerBoard = document.createElement('div')
computerBoard.classList.add('computer-container')
renderGameBoard(engine.getComputerPlayer(), computerBoard, { hideShip: true })

computerBoard.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    engine.humanAttack(x, y)
    console.log(x, y)
    computerBoard.innerHTML = ''
    renderGameBoard(engine.getComputerPlayer(), computerBoard, { hideShip: true })
    // make computerTurn true, disable the computer board,
    setTimeout(()=> {
      engine.computerAttack()
      humanBoard.innerHTML = ''
      renderGameBoard(engine.getHumanPlayer(), humanBoard, { hideShip: false })
    }, 300)
   
    
  }
  setTimeout(()=> {
    if (engine.checkWinner()) {
      console.log('someone won')
    }
  }, 100)
  
})

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

setInterval(()=> {
  console.log("resettt")
  engine.resetGame()
  
}, 5000)