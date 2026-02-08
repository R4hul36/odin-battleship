export default function renderGameBoard(
  container,
  { hideShip },
  player = null,
) {
  container.innerHTML = ''
  const boardWidth = 10
  const boardHeight = 10
  

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      if (player !== null) {
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
      }

      container.appendChild(cell)
      cell.dataset.coords = `${i},${j}`
    }
  }
}
