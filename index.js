const myCanvas = document.querySelector('canvas')
const ctx = myCanvas.getContext('2d')
myCanvas.style.border = '8px solid white'

const backImg = new Image()
backImg.src = './Images/Background/present.png'

const backImg2 = new Image()
backImg2.src = './Images/Background/present.png'

const player = new Image()
player.src = './Images/Wanda/WandaPresent.png'

const spell = new Image()
spell.src = './Images/Fireballs/Purple.png'

let backgroundy = 0
let backgroundy2 = -myCanvas.width

let playX = 70
let playY = 200
let playSpeed = 5

let isMoveLeft = false
let isMoveRight = false
let isMoveUp = false
let isMoveDown = false
let isNotMove = true
let spellSpeed = 5

let score = 0
let animateId
let intervalId = 0

let spellMove = [{x: myCanvas.width, y: myCanvas.height -250}]

let startBtn = document.getElementById('start-button')
let restartBtn = document.getElementById('restart')
let gameOver = document.querySelector("#gameOver")

function animate () {
    ctx.drawImage(backImg, backgroundy, 0, myCanvas.width, myCanvas.height)
    /* ctx.drawImage(backImg2, backgroundy2, 0, myCanvas.width, myCanvas.height) */
    ctx.drawImage(player, playX, playY, 125, 125)

    /* backgroundy += 2
    backgroundy2 += 2

    if (backgroundy > myCanvas.width) {
      backgroundy = -myCanvas.width
    }

    if (backgroundy2 > myCanvas.width) {
      backgroundy2 = -myCanvas.width
    } */

    for (let i=0; i<spellMove.length; i++) {
      ctx.drawImage(spell, spellMove[i].x, spellMove[i].y, 120, 120)

      spellMove[i].x = spellMove[i].x - spellSpeed
    
    if (spellMove[i].x <= 8 && spellMove[i].x > 0) {
      score++
    }
    if (spellMove[i].x < -200) {
      spellMove[i] = {x: 3000, y: 200}
    }

    let obst1 = {radius:40, x: playX, y: playY}
    let obst2 = {radius:40, x: spellMove[i].x + 20, y: 200}

    let distx = obst1.x - obst2.x
    let disty = obst1.y - obst2.y
    let distance = Math.sqrt(distx * distx + disty * disty)

    if (distance < obst1.radius + obst2.radius) {
      gameOver = true
    }

    if (isMoveLeft && playX > -10) {
        playX -= playSpeed
      } else if (isMoveRight && playX < 1000) {playX += playSpeed
      } else if (isNotMove) {
        playX = 0
      }

      if (isMoveUp && playY > 0) {
        playY -= playSpeed
      } else if (isMoveDown && playY < 420) {playY += playSpeed
      } else if (isNotMove) {
        playY = 170
      }
      
      if (gameOver){
        cancelAnimationFrame(intervalId)
        lose()
        score = 0
      } else {
        intervalId = requestAnimationFrame(animate)
      }

      document.addEventListener('keypress', event => {
        if (event.key === 'a') {
          isMoveLeft = true
          isNotMove = false
        } if (event.key === 'd') {
          isMoveRight = true
          isNotMove = false 
        } if (event.key === 'w') {
            isMoveUp = true
            isNotMove = false 
          } if (event.key === 's') {
            isMoveDown = true
            isNotMove = false 
          }
        })
    
        document.addEventListener('keyup', () => {
          isMoveLeft = false
          isMoveRight = false
          isMoveUp = false
          isMoveDown = false
        })
    
}
}

function lose() {
  gameOver = false;
  myCanvas.style.display = "none"
  startBtn.style.display = "none"
  restartBtn.style.display = ""
  document.querySelector('.gameOver').style.display = 'block'

  playX= 70
  playY= 200
  spellMove = [{x: myCanvas.width , y: 200}]
  
}

function startGame() {
  animate()
  document.querySelector('.menu').style.display = 'none'
  canva.style.display='flex'
  document.querySelector('.gameOver').style.display = 'none'
}

window.addEventListener('load', () => {

  canva.style.display='none'
  restart.style.display='none'
  

  document.querySelector('.gameOver').style.display = 'none'
  
  document.getElementById('start-button').onclick = () => {
    startGame()
    }

    document.getElementById('restart').onclick = () => {
      startGame()

  }
})
