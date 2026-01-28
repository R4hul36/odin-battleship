import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'

const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1, [1,2])
console.log("sdfsdfsdf")

// export default function checkModule() {
//   return "hellow"
// }


export default function renderHumanBoard(human) {
  const boardWidth = 10
  const boardHeight = 10
  console.log("sdfsdfsdf")
  // let playerBoard = Array.from({ length: 10 }, () => Array(10).fill(''))
  const container = document.createElement('div')
  container.classList.add('hum-container')
  container.addEventListener("click", (e) => {
    console.log(e.target)
  })

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      container.appendChild(cell)
      cell.dataset.coords = `${i},${j}`
    }
  }
  return container
}

renderHumanBoard(humanPlayer)

const computerPlayer = Player('Computer')
