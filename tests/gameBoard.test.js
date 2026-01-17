import GameBoard from "../src/modules/gameboard";

it("check if a ship is placed on the correct coordinate on the board", () => {
    let newBoard = GameBoard()
    newBoard.createBoard()
    newBoard.placeShips(0,4)
    expect(newBoard.checkIfOccupied(0,4)).toBe("occupied")
})