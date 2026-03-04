import Ship from '../modules/ship.js'
import {
  generateRandomCoordinates,
  randomOrientation,
} from './generateCoordinates.js'

export function placeShips(player) {
  // const shipSizes = [2, 3, 3, 4, 5]

  const fleet = player.getFleet()
  let placementCount = 0

  for (let i = 0; i < fleet.length; i++) {
    const ship = fleet[i]
    
    let coords = generateRandomCoordinates()
    let orientation = randomOrientation()
    while (!player.placeShip(ship, coords, orientation)) {
      
      if(placementCount > 100) {
        console.log("exceeded the count, will change orientation now!");
        
        orientation = orientation === "horizontal" ? "vertical": "horizontal"
        placementCount = 0
        continue
        
      }
      coords = generateRandomCoordinates()
      placementCount++
    }
  }
  return true
}
