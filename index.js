const myCanvas = document.querySelector('canvas')
const ctx = myCanvas.getContext('2d')
myCanvas.style.border = '8px solid white'

const backImg = new Image()
backImg.src = './Images/Background/present.png'

const playImg = new Image()
playImg.src = './Images/Wanda/WandaPresent.png'

const obsImg = new Image()
obsImg.src = './Images/Fireballs/Purple.png'

const playWidth = 250
const playHeight = 200

let playx = 0
let playy = 0
let playspeed = 5

let isMoveLeft = false
let isMoveRight = false
let isMoveUp = false
let isMoveDown = false
let isNotMove = true

let animateId
let gameOver = false

let obstacles = []

class Obstacle {
    constructor(Obsx, Obsy, width, height) {
        this.Obsx = Obsx
        this.Obsy = Obsy
        this.width = width
        this.height = height
}

draw() {
    ctx.beginPath()
    
    ctx.Obsy += 2
    ctx.fill()
    ctx.closePath()
}
}


const startBtn = document.getElementById('start-button')




const animate = () => {
    ctx.drawImage(backImg, 0, 0, myCanvas.width, myCanvas.height)
    ctx.drawImage(playImg, playx, playy, 200, 200)
    ctx.drawImage(obsImg, this.Obsx, this.Obsy, this.width, this.height)

    if (isMoveLeft && playx > -10) {
        playx -= playspeed
      } else if (isMoveRight && playx < 1000) {playx += playspeed
      } else if (isNotMove) {
        playx = 30 
      }

      if (isMoveUp && playy > 0) {
        playy -= playspeed
      } else if (isMoveDown && playy < 350) {playy += playspeed
      } else if (isNotMove) {
        playy = 170
      }
      

      if(!gameOver){
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


