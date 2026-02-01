import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'
import { computerPlayer, humanPlayer } from './game.js'

export const computerBoard = document.createElement('div')
computerBoard.classList.add('hum-container')
renderGameBoard(computerPlayer, computerBoard, { hideShip: true })
computerBoard.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell')) {
    const [x, y] = e.target.dataset.coords.split(',')
    computerPlayer.receiveAttack(Number(x), Number(y))
    console.log(x, y)
    computerBoard.innerHTML = ''
    renderGameBoard(computerPlayer, computerBoard, { hideShip: false })
  }
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
