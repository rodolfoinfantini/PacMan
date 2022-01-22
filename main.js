import Player from './modules/Player.js'
import Fruit from './modules/Fruit.js'
import Wall from './modules/Wall.js'
import Position from './modules/Position.js'
import { startPos } from './startPos.js'
import Ghost from './modules/Ghost.js'

const startBtn = document.querySelector('button.start')

let score = 0
const scoreEl = document.querySelector('h1')

const images = {
    man: {
        up: new Image(),
        down: new Image(),
        left: new Image(),
        right: new Image(),
        closed: new Image(),
    },
}
images.man.up.src = './assets/img/pacmanUp.png'
images.man.down.src = './assets/img/pacmanDown.png'
images.man.left.src = './assets/img/pacmanLeft.png'
images.man.right.src = './assets/img/pacmanRight.png'
images.man.closed.src = './assets/img/pacmanClosed.png'

let direction = 'none'

const delay = 200
const tileW = 25

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const colors = ['red', 'green', 'cyan', 'purple']

const fruits = []
const player = new Player(0, 0)
const walls = []
const empty = []
const ghosts = []

function start() {
    startBtn.style.display = 'none'
    document.onkeydown = (e) => {
        cmd[e.key]?.()
    }
    ghosts[0].startMoving()
    for (let i = 1; i < ghosts.length; i++) {
        setTimeout(() => {
            ghosts[i].startMoving()
        }, i * 5000)
    }
}

startBtn.onclick = start

function setup() {
    direction = 'none'
    score = 0
    scoreEl.textContent = 'Score: 0'
    player.x = startPos.player[0]
    player.y = startPos.player[1]

    upper: for (const wall of startPos.walls) {
        for (const w of walls) if (wall[0] === w.x && wall[1] === w.y) continue upper
        walls.push(new Wall(wall[0], wall[1]))
    }
    for (const em of startPos.empty) {
        empty.push(new Position(em[0], em[1]))
    }
    fLoop: for (const fruit of startPos.fruits) {
        for (const em of empty) if (fruit[0] === em.x && fruit[1] === em.y) continue fLoop
        const isSpecial = !!startPos.specials.find((f) => f[0] === fruit[0] && f[1] === fruit[1])
        fruits.push(new Fruit(fruit[0], fruit[1], isSpecial))
    }
    for (let i = 0; i < 3; i++) {
        ghosts.push(
            new Ghost(
                11 + i,
                13,
                player,
                walls,
                canvas,
                tileW,
                colors[Math.floor(Math.random() * colors.length)]
            )
        )
    }
    console.log(fruits.length)
}

let closed = false
let pacManImg = images.man.left

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#555'
    walls.forEach((wall) => {
        ctx.fillRect(wall.x * tileW, wall.y * tileW, tileW, tileW)
    })

    ctx.fillStyle = '#fff'
    fruits.forEach((fruit) => {
        if (fruit.special) {
            ctx.fillRect(fruit.x * tileW + 6, fruit.y * tileW + 6, tileW * 0.5, tileW * 0.5)
        } else {
            ctx.fillRect(
                fruit.x * tileW + tileW / 2 - 1,
                fruit.y * tileW + tileW / 2 - 1,
                tileW * 0.1,
                tileW * 0.1
            )
        }
    })

    ghosts.forEach((ghost) => {
        ctx.fillStyle = ghost.color
        ctx.fillRect(ghost.x * tileW + 6, ghost.y * tileW + 6, tileW * 0.5, tileW * 0.5)
    })

    ctx.fillStyle = '#ff0'
    ctx.beginPath()
    ctx.drawImage(pacManImg, player.x * tileW + 3, player.y * tileW + 3, tileW * 0.8, tileW * 0.8)

    ctx.fill()
    requestAnimationFrame(render)
}
requestAnimationFrame(render)

setInterval(() => {
    closed = !closed
    pacManImg = closed ? images.man.closed : getImgByDirection()
    if (!player.dead) directions[direction]?.()
    const fruit = fruits.findIndex((f) => f.x === player.x && f.y === player.y)
    if (fruit !== -1) {
        if (fruits[fruit].special) {
            score = score + 10
        } else {
            score++
        }
        fruits.splice(fruit, 1)
        scoreEl.textContent = 'Score: ' + score
        if (!fruits.length) {
            ghosts.forEach((ghost) => {
                ghost.stopMoving()
            })
            alert('You won!')
        }
    }
}, delay)

function getImgByDirection() {
    switch (direction) {
        case 'up':
            return images.man.up
        case 'down':
            return images.man.down
        case 'left':
            return images.man.left
        case 'right':
            return images.man.right
        default:
            return images.man.closed
    }
}

const directions = {
    right() {
        player.x++
        const wall = walls.find((w) => w.x === player.x && w.y === player.y)
        if (wall) {
            player.x--
        }
        if (player.x >= canvas.width / tileW) {
            player.x = 0
        }
    },
    left() {
        player.x--
        const wall = walls.find((w) => w.x === player.x && w.y === player.y)
        if (wall) {
            player.x++
        }
        if (player.x < 0) {
            player.x = canvas.width / tileW - 1
        }
    },
    up() {
        player.y--
        const wall = walls.find((w) => w.x === player.x && w.y === player.y)
        if (wall) {
            player.y++
        }
        if (player.y < 0) {
            player.y = canvas.height / tileW - 1
        }
    },
    down() {
        player.y++
        const wall = walls.find((w) => w.x === player.x && w.y === player.y)
        if (wall) {
            player.y--
        }
        if (player.y >= canvas.height / tileW) {
            player.y = 0
        }
    },
}

const cmd = {
    ArrowRight() {
        direction = 'right'
    },
    ArrowLeft() {
        direction = 'left'
    },
    ArrowUp() {
        direction = 'up'
    },
    ArrowDown() {
        direction = 'down'
    },
    a() {
        direction = 'left'
    },
    d() {
        direction = 'right'
    },
    w() {
        direction = 'up'
    },
    s() {
        direction = 'down'
    },
}

setup()
