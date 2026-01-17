
export default function GameBoard () {
    let board
    function createBoard () {
        board = Array.from({length : 10}, () => {
            new Array(10).fill(null)
        })
       
    }

    return {
        createBoard
    }

} 