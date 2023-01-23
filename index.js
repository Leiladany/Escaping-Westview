const myCanvas = document.querySelector('canvas')
const ctx = myCanvas.getContext('2d')
myCanvas.style.border = '8px solid white'

const backImg = new Image()
backImg.src = '../Escaping-Westview/Images/present.png'
function animate() {
    ctx.drawImage(backImg, 0, 0, myCanvas.width, myCanvas.height)
}

