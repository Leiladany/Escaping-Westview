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

let playX = 0
let playY = 0
let playSpeed = 5

let isMoveLeft = false
let isMoveRight = false
let isMoveUp = false
let isMoveDown = false
let isNotMove = true

let spellX = 0
let spellY = 0
let spellSpeed = 5

let score = 0
let animateId
let gameOver = false

let spellMove = [{x: myCanvas.width, y: myCanvas.height -250}]

const startBtn = document.getElementById('start-button')

function animate () {
    ctx.drawImage(backImg, backgroundy, 0, myCanvas.width, myCanvas.height)
    ctx.drawImage(backImg2, backgroundy2, 0, myCanvas.width, myCanvas.height)
    ctx.drawImage(player, playX, playY, 200, 200)

    backgroundy += 2
    backgroundy2 += 2

    if (backgroundy > myCanvas.width) {
      backgroundy = -myCanvas.width
    }

    if (backgroundy2 > myCanvas.width) {
      backgroundy2 = -myCanvas.width
    }

    for (let i=0; i<spellMove.length; i++) {
      ctx.drawImage(spell, spellMove[i].x, spellMove[i].y, 200, 100)

      spellMove[i].x = spellMove[i].x - spellSpeed
    
    if (spellMove[i].x <= 8 && spellMove[i].x > 0) {
      score++
    }
    if (spellMove[i].x < -200) {
      spellMove[i] = {x: 3000, y: myCanvas.height -250}
    }

    if (isMoveLeft && playX > -10) {
        playX -= playSpeed
      } else if (isMoveRight && playX < 1000) {playX += playSpeed
      } else if (isNotMove) {
        playX = 0
      }

      if (isMoveUp && playY > 0) {
        playY -= playSpeed
      } else if (isMoveDown && playY < 350) {playY += playSpeed
      } else if (isNotMove) {
        playY = 170
      }
      
      if (!gameOver){
        animateId = requestAnimationFrame(animate)
      } else {
      cancelAnimationFrame(animateId)
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

const startGame = () => {
    document.querySelector('.menu').style.display = 'none'
    animate()
}

window.addEventListener('load', () => {
    document.getElementById('start-button').onclick = () => {
      startGame()
      startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none'
      })
    }
})