import Ship from '../modules/ship.js'
import {
  generateRandomCoordinates,
  randomOrientation,
} from './generateCoordinates.js'

export function placeShips(player) {
  const shipSizes = [2, 3, 3, 4, 5]

  for (let i = 0; i < shipSizes.length; i++) {
    const ship = Ship(shipSizes[i])
    let coords = generateRandomCoordinates()
    const orientation = randomOrientation()
    while (!player.placeShip(ship, coords, orientation)) {
      coords = generateRandomCoordinates()
    }
  }
}
