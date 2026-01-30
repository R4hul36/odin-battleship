import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'

const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1, [1,2])

export const container = document.createElement('div')
container.classList.add('hum-container')
container.addEventListener("click", (e) => {
    const [x,y] = e.target.dataset.coords.split(',')
    console.log(x,y);
    humanPlayer.receiveAttack(Number(x),Number(y))
    container.innerHTML = ""
    renderHumanBoard(humanPlayer)
})

export default function renderHumanBoard(human) {
  const boardWidth = 10
  const boardHeight = 10
  console.log("sdfsdfsdf")
 
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      
      const cell = document.createElement('div')
      cell.classList.add('cell')
      if(human.isHit(i,j)){
        console.log("hittt");
        cell.classList.add('ship-hit')
      }else if (human.isMiss(i,j)){
        cell.classList.add('miss')
      }else if(human.isShip(i,j)){
        cell.classList.add('ship')
      }
      container.appendChild(cell)
      cell.dataset.coords = `${i},${j}`
    }
  }
  
}

renderHumanBoard(humanPlayer)

const computerPlayer = Player('Computer')
