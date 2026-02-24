import isNonOverlapping from '../src/utils/checkOverlap'

it('check if ships overlap each other', () => {
  const board = [
    [null, null, null, 1, null, null],
    [null, null, null, null, null, null],
  ]

  expect(isNonOverlapping(0, 1, board, 3, "horizontal")).toBe(false)
  expect(isNonOverlapping(0, 1, board, 2, "horizontal")).toBe(true)
})
 