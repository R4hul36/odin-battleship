import Ship from './ship.js'
import Player from './player.js'
import { generateRandomCoordinates, generateRandomNumber } from '../utils/generateCoordinates.js'
import { placeShips } from '../utils/placeShips.js'


export default function gameEngine() {
  let gamePhase = 'setup'
  let orientation = 'horizontal'
  let computerTurn = false
  let humanTurn = true
  let winner = null
  let humanPlayer
  let computerPlayer
  let nextLogicalAttackInfo = null


  function startGame(mode) {
    humanPlayer = Player('Human')
    if (mode === 'auto') {
      placeShips(humanPlayer)
    }
    computerPlayer = Player('Computer')
    placeShips(computerPlayer)
    onShipsPlaced()
  }

  function setOrientation(newOrientation) {
    orientation = newOrientation
  }

  function getHumanPlayer() {
    return humanPlayer
  }

  function getComputerPlayer() {
    return computerPlayer
  }

  function placeShipsManually(x, y) {
    const count = humanPlayer.getPlacedShipsCount()

    const humanFleet = humanPlayer.getFleet()
    const ship = humanFleet[count]
    humanPlayer.placeShip(ship, [Number(x), Number(y)], orientation)
    onShipsPlaced()
  }

  function onShipsPlaced() {
    if (
      humanPlayer.getPlacedShipsCount() === 5 &&
      computerPlayer.getPlacedShipsCount() === 5
    ) {
      gamePhase = 'running'
    }
  }

  function onAllShipsSunk() {
    if (computerPlayer.allShipsSunk() || humanPlayer.allShipsSunk()) {
      gamePhase = 'gameover'
    }
  }

  function humanAttack(x, y) {
    if (gamePhase === 'running' && humanTurn) {
      // if (computerPlayer.receiveAttack(Number(x), Number(y))) {
      //   humanTurn = false
      //   computerTurn = true
      //   onAllShipsSunk()
      //   return true
      // }
      // return false
      const {valid, ship, result} = computerPlayer.receiveAttack(Number(x), Number(y))
      if(valid) {
        humanTurn = false
        computerTurn = true
        onAllShipsSunk()
        return true
      }
      if(!valid) {
        return false
      } 

    }
    return false
  }
  function computerAttack() {
    if (gamePhase === 'running' && computerTurn) {
      let {placement, coords} = computerMove()
      let[x,y] = coords
      while (!humanPlayer.receiveAttack(x, y)) {
        console.log('attacks')
        if(nextLogicalAttackInfo!==null && nextLogicalAttackInfo.placement){
          nextLogicalAttackInfo.state= "miss"
        }
        let newMove = computerMove()
        placement = newMove.placement
        ;[x,y] = newMove.coords
      }
      if(humanPlayer.isHit(x,y) && nextLogicalAttackInfo === null){
        nextLogicalAttackInfo = { state: "hit", initialHit: [x,y],coords: [x,y], placement: null, currentPath: null, failedPaths: []}
        
      }

      if(humanPlayer.isShipSunk(x,y)){
        nextLogicalAttackInfo = null
      }

      if(humanPlayer.isHit(x,y) && nextLogicalAttackInfo !== null){
        nextLogicalAttackInfo.state = "hit"
        nextLogicalAttackInfo.coords = [x,y]
        nextLogicalAttackInfo.placement = placement

      }


      if(!humanPlayer.isHit(x,y) && nextLogicalAttackInfo) {
        nextLogicalAttackInfo.state = "miss"
        nextLogicalAttackInfo.coords = [x,y]
        

      }
      onAllShipsSunk()
      humanTurn = true
      computerTurn = false
    }
  }

  function computerMove() {
    //find a target by attacking ship randomly
   
   let randomNum;
   let possibleMoves
   if(nextLogicalAttackInfo === null){
      const coords = generateRandomCoordinates()
      return {placement: null , coords}
   }else {
      let{state, initialHit,coords, placement, currentPath, failedPaths} = nextLogicalAttackInfo
      let [x,y] = initialHit
      console.log(x,y)
      console.log(placement)
      possibleMoves = [{placement: 'horizontal', coords:[x, y+1]}, {placement: 'horizontal', coords:[x, y-1]}, {placement: 'vertical', coords:[x+1, y]}, {placement: 'vertical', coords:[x-1, y]}]
      if(placement === null){
        randomNum = generateRandomNumber(4)
        console.log(randomNum)
        return possibleMoves[randomNum]
      }else if (placement){
        possibleMoves = possibleMoves.filter(move => move.placement === placement)
        randomNum = generateRandomNumber(2)
        if(state === "miss") {
          if(placement === "horizontal" && initialHit[1] < coords[1]){
            return {placement: placement, coords: [initialHit[0], initialHit[1]-1], path: "left"}
          } else if (placement === "horizontal" && initialHit[1] > coords[1]){
            return {placement: placement, coords: [initialHit[0], initialHit[1]+1], path: 'right'}
          }
         console.log("missed with placement known");
        }
        if(state = "hit") {
          console.log(initialHit, coords);
          if(placement === "horizontal" && coords[1] > initialHit[1]) {
            console.log([coords[0], coords[1]+1])
            return {placement, coords: [coords[0], coords[1]+1], path: "right"}
           
          } else if (placement === "horizontal" && coords[1] < initialHit[1]){
            console.log("after 2nd hit")
            return {placement, coords: [coords[0], coords[1]-1], path: "left"}
          }
        }
      
      }


  
    // if next logical attack not present randomly select an adjacent move from possible moves an return it
    //if next logical attack is present and it doesnt hit the ship then exclude it from the possible moves
    // else if it hits the ship we will be certain of the mode eg: horizontal or vertical 
   }
   
  }

  function checkWinner() {
    let status = false

    if (computerPlayer.allShipsSunk()) {
      winner = 'Human'
      status = true
    } else if (humanPlayer.allShipsSunk()) {
      winner = 'Computer'
      status = true
    }
    return {
      status,
      winner,
    }
  }

  function currGamePhase() {
    return gamePhase
  }

  function resetGame() {
    gamePhase = 'setup'
    startGame('auto')
    humanTurn = true
    computerTurn = false
    winner = null
  }

  return {
    startGame,
    getHumanPlayer,
    getComputerPlayer,
    setOrientation,
    placeShipsManually,
    humanAttack,
    computerAttack,
    checkWinner,
    resetGame,
    currGamePhase,
  }
}
