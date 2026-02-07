import Ship from '../modules/ship.js'
import {
  generateRandomCoordinates,
  randomOrientation,
} from './generateCoordinates.js'

export function placeShips(player) {
  // const shipSizes = [2, 3, 3, 4, 5]

  const fleet = player.getFleet()
  console.log(fleet)

  for (let i = 0; i < fleet.length; i++) {
    const ship = fleet[i]
    console.log(ship.shipInfo())
    let coords = generateRandomCoordinates()
    const orientation = randomOrientation()
    while (!player.placeShip(ship, coords, orientation)) {
      coords = generateRandomCoordinates()
    }
  }
}
