import { computerBoard, humanBoard, overlay } from './modules/domController.js'

const container = document.querySelector('.main')

const gameContainer = document.createElement('div')
gameContainer.classList.add('game-container')
gameContainer.appendChild(humanBoard)
gameContainer.appendChild(computerBoard)
gameContainer.appendChild(overlay)

container.appendChild(gameContainer)