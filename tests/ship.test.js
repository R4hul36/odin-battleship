import Ship from "../src/modules/ship";


it("check damage to the ship", () => {
    let newShip = Ship(3)
    newShip.hit()
    
    expect(newShip.hitCount()).toEqual(1)
})

it("check if she is sunk", () => {
    let newShip = Ship(3)
    newShip.hit()
    newShip.hit()
    newShip.hit()
    expect(newShip.isSunk()).toBe(true)
})