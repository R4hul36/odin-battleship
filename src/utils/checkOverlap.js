
export default function isNonOverlappingHorizontally (x,y,board,shipLength) {
    let nonOverlapping = true
    for(let i =0; i<shipLength; i++){
        if(board[x][y+i] !== null) {
            nonOverlapping = false
            break
        }
    }

    return nonOverlapping
}

