import renderHumanBoard from './modules/domController.js'


const gameContainer = document.querySelector(".main")

const txt = document.createElement("p")
txt.textContent = "hiii"

const humanBoard = document.querySelector('.hum-container')
gameContainer.appendChild(renderHumanBoard())



console.log(renderHumanBoard());

