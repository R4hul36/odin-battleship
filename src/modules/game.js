import Ship from './ship.js'
import Player from './player.js'
import renderGameBoard from './domController.js'

    
export const humanPlayer = Player('Human')
const ship1 = Ship(3)
humanPlayer.placeShipsHorizontally(ship1, [1,2])

export const computerPlayer = Player('Computer')    
const ship2 = Ship(3)
computerPlayer.placeShipsHorizontally(ship2, [4,1])
