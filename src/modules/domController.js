import Player from './player.js'
import GameBoard from './gameboard.js'
import Ship from './ship.js'

const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1, [1,2])

export const container = document.createElement('div')
container.classList.add('hum-container')
container.addEventListener("click", (e) => {
    if(e.target.classList.contains("cell")){
      const [x,y] = e.target.dataset.coords.split(',')
      humanPlayer.receiveAttack(Number(x),Number(y))
      console.log(x,y);
      container.innerHTML = ""
      renderGameBoard(humanPlayer)
    }  
})

export default function renderGameBoard(player) {
  const boardWidth = 10
  const boardHeight = 10
  console.log("sdfsdfsdf")
 
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      
      const cell = document.createElement('div')
      cell.classList.add('cell')
      if(player.isHit(i,j)){
        console.log("hittt");
        cell.classList.add('ship-hit')
      }else if (player.isMiss(i,j)){
        cell.classList.add('miss')
      }else if(player.isShip(i,j)){
        cell.classList.add('ship')
      }
      container.appendChild(cell)
      cell.dataset.coords = `${i},${j}`
    }
  }
  
}

renderGameBoard(humanPlayer)

const computerPlayer = Player('Computer')
