import { generateRandomCoordinates } from "../utils/generateCoordinates.js";

export default function computerMove (board){
    // intially randomly get a coord
    // check if the coordinate hits a ship
    // then assign it as the target ship
    // after next human move check if a target ship is present
    // if so try a new coordinate to the right of the ship
    // check if its a hit and also if ship is sunk
    // if not sunk and its a hit try again going right
    // if miss try going left
    // if its hit try going left again
    // if its miss on left try going up
    // if its miss try going down



    console.log(board)
    let move = generateRandomCoordinates()
    return move

}