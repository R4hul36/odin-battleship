import Player from './player'
import GameBoard from './gameboard'
import Ship from './ship'

const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1)

function renderHumanBoard(human) {
  const boardWidth = 10
  const boardHeight = 10
  let playerBoard = Array.from({ length: 10 }, () => Array(10).fill(''))
  const container = document.createElement('div')
  container.classList.add('humContainer')

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      container.appendChild(cell)
      cell.dataset.coords = `${i},${j}`
    }
  }
}

renderHumanBoard(humanPlayer)

const computerPlayer = Player('Computer')
