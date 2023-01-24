const myCanvas = document.querySelector('canvas')
const ctx = myCanvas.getContext('2d')
myCanvas.style.border = '8px solid white'

const backImg = new Image()
backImg.src = './Images/Background/present.png'

const backImg2 = new Image()
backImg2.src = './Images/Background/present.png'

const playImg = new Image()
playImg.src = './Images/Wanda/WandaPresent.png'

const obsImg = new Image()
obsImg.src = './Images/Fireballs/Purple.png'

const obsImg2 = new Image()
obsImg2.src = './Images/Fireballs/Purple.png'

const obsImg3 = new Image()
obsImg2.src = './Images/Fireballs/Purple.png'


const playWidth = 250
const playHeight = 200

let backgroundy = 0
let backgroundy2 = -myCanvas.width

let playx = 800
let playy = 0
let playspeed = 5

let isMoveLeft = false
let isMoveRight = false
let isMoveUp = false
let isMoveDown = false
let isNotMove = true

let obsx = 0
let obsy = 0
let obsspeed = 5

let animateId
let gameOver = false

let obstacles =[]

class Obstacle {
  constructor(obsx, obsy, width, height) {
    this.obsx = obsx
    this.obsy = obsy
    this.width = width
    this.height = height
} 

draw() {
  ctx.beginPath()
  ctx.obsImg = new Image()
  ctx.obsImg.src = './Images/Fireballs/Purple.png'
  ctx.rect(this.obsx, this.obsy, this.width, this)
  ctx.closePath
}

checkCollision() {

    playx < this.obsx + this.width &&
    playx + playWidth > this.obsx &&
    playy < this.obsy + this.height &&
     {
    gameOver : true
  }

}
}


const startBtn = document.getElementById('start-button')

function animate () {
    ctx.drawImage(backImg, backgroundy, 0, myCanvas.width, myCanvas.height)
    ctx.drawImage(backImg2, backgroundy2, 0, myCanvas.width, myCanvas.height)
    ctx.drawImage(playImg, playx, playy, 200, 200)
    ctx.drawImage(obsImg, obsx, 0, 200, 100)

    backgroundy += 2
    backgroundy2 += 2

    if (backgroundy > myCanvas.width) {
      backgroundy = -myCanvas.width
    }

    if (backgroundy2 > myCanvas.width) {
      backgroundy2 = -myCanvas.width
    }

    obsx += obsspeed
    obsy += obsspeed

    if (isMoveLeft && playx > -10) {
        playx -= playspeed
      } else if (isMoveRight && playx < 1000) {playx += playspeed
      } else if (isNotMove) {
        playx = 1000
      }

      if (isMoveUp && playy > 0) {
        playy -= playspeed
      } else if (isMoveDown && playy < 350) {playy += playspeed
      } else if (isNotMove) {
        playy = 170
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

const startGame = () => {
    document.querySelector('.game-intro').style.display = 'none'
    animate()
}

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'
  })

window.addEventListener('load', () => {
    document.getElementById('start-button').onclick = () => {
        startGame()
    }

})


