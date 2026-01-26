import GameBoard from '../src/modules/gameboard'
import Ship from '../src/modules/ship'
import generateRandomCoordinates from '../src/utils/generateCoordinates'

jest.mock('../src/utils/generateCoordinates', () => jest.fn(() => [0, 4]))

let newBoard = GameBoard()

describe('Gameboard', () => {
  beforeEach(() => {
    newBoard.createBoard()
  })
  it('check if ship receives damage correctly', () => {
    const newShip = Ship(3)
    newBoard.placeShipsHorizontally(newShip, [0,4])
    newBoard.receiveAttack(0, 4)
    newBoard.receiveAttack(1, 7)
    expect(newShip.hitCount()).toBe(1)
  })

  it('check if a ship is sunk', () => {
    const newShip = Ship(1)
    newBoard.placeShipsHorizontally(newShip, [0,4])
    newBoard.receiveAttack(0, 4)
    expect(newShip.isSunk()).toBe(true)
  })

  it('checks if all the ships in the board are sunk', () => {
    const newShip = Ship(1)
    newBoard.placeShipsHorizontally(newShip, [1,5])
    newBoard.receiveAttack(1, 5)
    expect(newBoard.allShipsSunk()).toBe(true)
  })
})
