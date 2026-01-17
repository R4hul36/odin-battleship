import Ship from "./ship"

export default function GameBoard () {
    let board
    function createBoard () {
        board = Array.from({length : 10}, () => 
            Array(10).fill(null)
        )
    }

    function placeShips (x,y) {
        let newShip = Ship(1)
        board[x][y] = newShip
    }

    function receiveAttack (x,y){
        if(board[x][y] !== null) {
            const currShip = board[x][y]
            currShip.hit()
        }
    }
    

    return {
        createBoard,
        placeShips,
        receiveAttack
    
    }

} 