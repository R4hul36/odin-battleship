import GameBoard from '../src/modules/gameboard'
import Ship from '../src/modules/ship'
import generateRandomCoordinates from '../src/utils/generateCoordinates'

jest.mock('../src/utils/generateCoordinates', () => jest.fn(() => [0, 4]))

it('check the flow of placing and receiving damage on a ship placed horizontally', () => {
  let newBoard = GameBoard()
  newBoard.createBoard()
  const newShip = Ship(3)
  newBoard.placeShipsHorizontally(newShip)
  newBoard.receiveAttack(0, 4)
  expect(newShip.hitCount()).toBe(1)
  expect(newShip.isSunk()).toBe(false)
})
