const myCanvas = document.querySelector('canvas')
const ctx = myCanvas.getContext('2d')
myCanvas.style.border = '8px solid #911717'


const backImg = new Image()
backImg.src = './Images/Background/newback.jpg'

const backImg2 = new Image()
backImg2.src = './Images/Background/newback.jpg'

const player = new Image()
player.src = './Images/Wanda/WandaPresent.png'

const spell = new Image()
spell.src = './Images/Fireballs/Purple.png'

let backsound = new Audio('./Sound/backsound.mp3')
backsound.volume = 0.5
let evilL = new Audio('./Sound/evilL.mp3')
evilL.volume = 0.5

let backgroundy = 0
let backgroundy2 = -myCanvas.width

let playX = 70
let playY = 200
let playSpeed = 1.5

let isMoveLeft = false
let isMoveRight = false
let isMoveUp = false
let isMoveDown = false
let isNotMove = true


let score = 0
let animateId
let intervalId = 0

let spellSpeed = 6
let spellMove1 = [{x: myCanvas.width, y: myCanvas.height -330}]
let spellMove2 = [{x: myCanvas.width + 1800, y: 100}]
let spellMove3 = [{x: myCanvas.width + 2400, y: 350}]

let startBtn = document.getElementById('start-button')
let restartBtn = document.getElementById('restart')
let gameOver = document.querySelector("#gameOver")

function animate () {
    ctx.drawImage(backImg, backgroundy, 0, myCanvas.width, myCanvas.height)
    ctx.drawImage(backImg2, backgroundy2, 0, myCanvas.width, myCanvas.height) 
    ctx.drawImage(player, playX, playY, 125, 125)

    backgroundy += 2
    backgroundy2 += 2

    if (backgroundy > myCanvas.width) {
      backgroundy = -myCanvas.width
    }

    if (backgroundy2 > myCanvas.width) {
      backgroundy2 = -myCanvas.width
    }

//1st spell
    for (let i=0; i<spellMove1.length; i++) {
      ctx.drawImage(spell, spellMove1[i].x, spellMove1[i].y, 120, 120)

      spellMove1[i].x = spellMove1[i].x - (spellSpeed * 2)
    
    if (spellMove1[i].x <= 8 && spellMove1[i].x > 0) {
      score++
    }
    if (spellMove1[i].x < -200) {
      spellMove1[i] = {x: 3000, y: 200}
    }

    let obst1 = {radius:30, x: playX, y: playY}
    let obst2 = {radius:30, x: spellMove1[i].x + 23, y: 200}

    let distx = obst1.x - obst2.x
    let disty = obst1.y - obst2.y
    let distance = Math.sqrt(distx * distx + disty * disty)

    if (distance < obst1.radius + obst2.radius) {
      gameOver = true
    }
    }
//2nd spell
    for (let i=0; i<spellMove2.length; i++) {
      ctx.drawImage(spell, spellMove2[i].x, spellMove2[i].y, 120, 120)

      spellMove2[i].x = spellMove2[i].x - (spellSpeed + 3)
    
    if (spellMove2[i].x <= 8 && spellMove2[i].x > 0) {
      score++
    }
    if (spellMove2[i].x < -200) {
      spellMove2[i] = {x: 3000, y: 100}
    }

    let obst1 = {radius:30, x: playX, y: playY}
    let obst2 = {radius:30, x: spellMove2[i].x + 23, y: 100}

    let distx = obst1.x - obst2.x
    let disty = obst1.y - obst2.y
    let distance = Math.sqrt(distx * distx + disty * disty)

    if (distance < obst1.radius + obst2.radius) {
      gameOver = true
    }
    }
//3rd spell
    for (let i=0; i<spellMove3.length; i++) {
      ctx.drawImage(spell, spellMove3[i].x, spellMove3[i].y, 120, 120)

      spellMove3[i].x = spellMove3[i].x - (spellSpeed + 2) * 2

    if (spellMove3[i].x <= 8 && spellMove3[i].x > 0) {
  score++
    }
    if (spellMove3[i].x < -200) {
    spellMove3[i] = {x: 3000, y: 400}
    }

    let obst1 = {radius:30, x: playX, y: playY}
    let obst2 = {radius:30, x: spellMove3[i].x + 23, y: 400}

    let distx = obst1.x - obst2.x
    let disty = obst1.y - obst2.y
    let distance = Math.sqrt(distx * distx + disty * disty)

    if (distance < obst1.radius + obst2.radius) {
    gameOver = true
    }
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

      ctx.font = "60px Georgia";
      ctx.fillStyle = "#B90F0F";
      ctx.fillText(`Score: ${score}`,
      myCanvas.width / 2 - 100,
      myCanvas.height - 500
      )
      
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

function lose() {
  gameOver = false;
  myCanvas.style.display = "none"
  startBtn.style.display = "none"
  restartBtn.style.display = ""
  document.querySelector('.gameOver').style.display = 'block'
  backsound.pause()
  evilL.play()

  playX= 70
  playY= 200
  spellMove1 = [{x: myCanvas.width, y: myCanvas.height -330}]
  spellMove2 = [{x: myCanvas.width + 1800, y:100}]
  spellMove3 = [{x: myCanvas.width + 2400, y: 350}]
  let Score = document.querySelector(".gameOver h2")
  Score.innerHTML = `Score: ${score}`
}




function startGame() {
  animate()
  backsound.play()
  evilL.pause()
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
