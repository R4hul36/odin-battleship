import { computerBoard, humanBoard } from './modules/domController.js'

const gameContainer = document.querySelector('.main')

gameContainer.appendChild(humanBoard)
gameContainer.appendChild(computerBoard)
