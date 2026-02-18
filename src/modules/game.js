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
      // let {placement, coords} = computerMove()
      // let[x,y] = coords
      // while (!humanPlayer.receiveAttack(x, y)) {
      //   console.log('attacks')
      //   if(nextLogicalAttackInfo!==null && nextLogicalAttackInfo.placement){
      //     nextLogicalAttackInfo.state= "miss"
      //   }
      //   let newMove = computerMove()
      //   placement = newMove.placement
      //   ;[x,y] = newMove.coords
      // }
      // if(humanPlayer.isHit(x,y) && nextLogicalAttackInfo === null){
      //   nextLogicalAttackInfo = { state: "hit", initialHit: [x,y],coords: [x,y], placement: null, currentPath: null, failedPaths: []}
        
      // }

      // if(humanPlayer.isShipSunk(x,y)){
      //   nextLogicalAttackInfo = null
      // }

      // if(humanPlayer.isHit(x,y) && nextLogicalAttackInfo !== null){
      //   nextLogicalAttackInfo.state = "hit"
      //   nextLogicalAttackInfo.coords = [x,y]
      //   nextLogicalAttackInfo.placement = placement

      // }


      // if(!humanPlayer.isHit(x,y) && nextLogicalAttackInfo) {
      //   nextLogicalAttackInfo.state = "miss"
      //   nextLogicalAttackInfo.coords = [x,y]
        

      // }
      let {placement, coords} = computerMove()
      let [x,y] = coords

      let boardAttack = humanPlayer.receiveAttack(Number(x), Number(y))

    
      while(!boardAttack.valid){
        console.log('retry')
        console.log(nextLogicalAttackInfo)
        let newMove = computerMove()
        placement = newMove.placement
        ;[x,y] = newMove.coords
        console.log(x,y, "inside loop")
        boardAttack = humanPlayer.receiveAttack(Number(x), Number(y))
        console.log(boardAttack.result, boardAttack.valid)
      }

      if(boardAttack.result === "hit" && boardAttack.ship.isSunk()){
        console.log('ship sunk')
        nextLogicalAttackInfo = null      
      } else if(boardAttack.result === "hit" && nextLogicalAttackInfo === null) {
        console.log("after 1st attack");
        nextLogicalAttackInfo = { state: "hit", initialHit: [x,y],coords: [x,y], placement: null, currentPath: null, failedPaths: []}
      } else if(boardAttack.result === "hit" && nextLogicalAttackInfo !== null){
        console.log(placement, "after 2 attacks");
        
        nextLogicalAttackInfo.state = "hit"
        nextLogicalAttackInfo.coords = [x,y]
        nextLogicalAttackInfo.placement = placement
      } else if(boardAttack.result === "miss" && nextLogicalAttackInfo) {
        if(nextLogicalAttackInfo.placement){
          nextLogicalAttackInfo.state = "miss"
          nextLogicalAttackInfo.coords = [x,y] 
        }
      } 

      // if(!boardAttack.valid && nextLogicalAttackInfo) {
      //   nextLogicalAttackInfo.state = "invalid"
      //   nextLogicalAttackInfo.failedPaths.push([x,y])
      // }
      
      // if(!boardAttack.valid && nextLogicalAttackInfo){
      //   console.log("invalid")
      //   if(nextLogicalAttackInfo.placement){
      //     nextLogicalAttackInfo.state = "invalid"
      //   }
      // }

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
      // console.log(x,y)
      // console.log(placement)
      possibleMoves = [{placement: 'horizontal', coords:[x, y+1]}, {placement: 'horizontal', coords:[x, y-1]}, {placement: 'vertical', coords:[x+1, y]}, {placement: 'vertical', coords:[x-1, y]}]
      
      possibleMoves = filterValidMoves(possibleMoves, failedPaths, initialHit)
      
      if(placement === null ){
        console.log(possibleMoves)
        randomNum = generateRandomNumber(possibleMoves.length)
        console.log(randomNum)
        return possibleMoves[randomNum]
      }else if (placement){
        possibleMoves = possibleMoves.filter(move => move.placement === placement)
        randomNum = generateRandomNumber(2)
        console.log("placement mode on");
        
        if(state === "miss") {
          console.log("missed with placement known");
          return handleMiss(placement, initialHit, coords)
        }
        if(state = "hit") {
          console.log(initialHit, coords, "hit block");
          return handleHit(placement, initialHit, coords)
        }
      
      }


  
    // if next logical attack not present randomly select an adjacent move from possible moves an return it
    //if next logical attack is present and it doesnt hit the ship then exclude it from the possible moves
    // else if it hits the ship we will be certain of the mode eg: horizontal or vertical 
   }
   
  }

  function isValidCell (coords) {
    let [x,y] = coords
     return !humanPlayer.isHit(x,y) && !humanPlayer.isMiss(x,y)  
  }

  function filterValidMoves (possibleMoves, failedPaths, initialHit) {
    let [x,y] = initialHit
    let moves = possibleMoves
    console.log("filtering")
    return moves.filter(move => {
      let[x,y] = move.coords
      return !humanPlayer.isHit(x,y) && !humanPlayer.isMiss(x,y)
    })
  }

  function handleHit(placement, initialHit, coords) {
    let direction = determineDirection(initialHit, coords)
    if(direction === "right") {
      console.log("after 2nd hit", humanPlayer.isMiss(coords[0], coords[1]+1), "and curr coords", coords, "next cell is ",[coords[0], coords[1]+1])
      let nextCell = getNextCell(coords, direction)
      if(!isValidCell(nextCell)){
        console.log("return block if hit alredy hit cell");
        direction = getOppositeDirection(direction)
        nextCell = getNextCell(initialHit, direction)
        if(!isValidCell(nextCell)){
          return {placement:null, coords:generateRandomCoordinates()}
        }else {
          nextLogicalAttackInfo.coords = nextCell
          nextLogicalAttackInfo.currentPath = "left"
          return {placement: placement, coords: nextCell}
        }
      }
      return {placement, coords: nextCell}
    }
    if (direction === "left"){
      console.log("after 2nd hit", humanPlayer.isMiss(coords[0], coords[1]-1), "and curr coords", coords,"next cell is ", [coords[0], coords[1]-1])
      let nextCell = getNextCell(coords, direction)
      if(!isValidCell(nextCell)){
        console.log("return block if hit alredy hit cell");
        direction = getOppositeDirection(direction)
        nextCell = getNextCell(initialHit, direction)
        if(!isValidCell(nextCell)) {
          return {placement:null, coords:generateRandomCoordinates()}
        }else {
          nextLogicalAttackInfo.coords = nextCell
          nextLogicalAttackInfo.currentPath = "right"
          return {placement: placement, coords: nextCell}
        }
      }

      return {placement, coords: nextCell, path: "left"}
    }

    if(direction === "down") {
      let nextCell = getNextCell(coords, direction)
      if(!isValidCell(nextCell)){
        console.log("return block if hit alredy hit cell");
        direction = getOppositeDirection(direction)
        nextCell = getNextCell(initialHit, direction)
        if(!isValidCell(nextCell)){
          return {placement:null, coords:generateRandomCoordinates()}
        }else {
          nextLogicalAttackInfo.coords = nextCell
          nextLogicalAttackInfo.currentPath = "up"
          return {placement: placement, coords: nextCell}
        }
      }
      return {placement, coords: nextCell}
    }

    if(direction === "up") {
      let nextCell = getNextCell(coords, direction)
      if(!isValidCell(nextCell)){
        console.log("return block if hit alredy hit cell");
        direction = getOppositeDirection(direction)
        nextCell = getNextCell(initialHit, direction)
        if(!isValidCell(nextCell)) {
          return {placement:null, coords:generateRandomCoordinates()}
        }else {
          nextLogicalAttackInfo.coords = nextCell
          nextLogicalAttackInfo.currentPath = "down"
          return {placement: placement, coords: nextCell}
        }
      }

      return {placement, coords: nextCell, path: "up"}
    }

  }

  function handleMiss (placement, initialHit, coords) {
    let direction = determineDirection(initialHit, coords)
    
    if(direction === "right"){
      console.log("handle miss")
      if(humanPlayer.isHit(initialHit[0], initialHit[1]-1) || humanPlayer.isMiss(initialHit[0], initialHit[1]-1)){
        nextLogicalAttackInfo = null
        return {placement: null, coords:generateRandomCoordinates()}
      }
      return {placement: placement, coords: [initialHit[0], initialHit[1]-1], path: 'left'}
    }if (direction === "left"){
      console.log("handle miss")
      if(humanPlayer.isHit(initialHit[0], initialHit[1]+1) || humanPlayer.isMiss(initialHit[0], initialHit[1]+1)){
        nextLogicalAttackInfo = null
        return {placement: null, coords:generateRandomCoordinates()}
      }
      return {placement: placement, coords: [initialHit[0], initialHit[1]+1], path: 'right'}
    }
  }

  function determineDirection(initialHit, coords) {

    if(initialHit[1] < coords[1]) {
      return "right"
    }
    if(initialHit[1] > coords[1]) {
      return "left"
    }
    if(initialHit[0] < coords[0]) {
      return "down"
    }
    if(initialHit[0] > coords[0]) {
      return "up"
    }

  } 

  function getOppositeDirection(direction) {
    const directions = {
      "right": "left",
      "left": "right",
      "up": "down",
      "down": "up"
    }
    return directions[direction]
  }

  function getNextCell (coords, direction) {
    if(direction === "right") {
      return [coords[0], coords[1]+1]
    }
    if(direction === "left") {
      return [coords[0], coords[1]-1]
    }
    if(direction === "down") {
      return [coords[0]+1, coords[1]]
    }
    if(direction === "up") {
      return [coords[0]-1, coords[1]]
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
