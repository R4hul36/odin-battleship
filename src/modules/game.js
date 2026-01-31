import Ship from './ship.js'
import Player from './player.js'
import renderGameBoard from './domController.js'

    
export const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1, [1,2])

    