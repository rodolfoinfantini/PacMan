import Position from './Position.js'
const speed = [350, 300, 400, 450, 250]
export default class Ghost extends Position {
    player
    moving = false
    #interval
    speed = speed[Math.floor(Math.random() * speed.length)]
    walls
    canvas
    tileW
    staterX
    staterY
    color
    constructor(x, y, player, walls, canvas, tileW, color) {
        super(x, y)
        this.staterX = x
        this.staterY = y
        this.player = player
        this.walls = walls
        this.canvas = canvas
        this.tileW = tileW
        this.color = color
    }
    resetPosition() {
        this.x = this.staterX
        this.y = this.staterY
    }
    startMoving() {
        this.moving = true
        this.#interval = setInterval(() => {
            this.move()
        }, this.speed)
    }
    stopMoving() {
        this.moving = false
        clearInterval(this.#interval)
    }
    move() {
        const path = this.findPath()
        if (path.length === 1) {
            this.player.kill(this)
            return
        }
        const nextMove = path[1]
        if (nextMove) {
            if (nextMove.x < this.x) {
                this.left()
            } else if (nextMove.x > this.x) {
                this.right()
            } else if (nextMove.y < this.y) {
                this.up()
            } else if (nextMove.y > this.y) {
                this.down()
            }
        }
    }
    left() {
        this.x--
        const wall = this.walls.find((w) => w.x === this.x && w.y === this.y)
        if (wall) {
            this.x++
        }
        if (this.x < 0) {
            this.x = this.canvas.width / this.tileW - 1
        }
    }
    right() {
        this.x++
        const wall = this.walls.find((w) => w.x === this.x && w.y === this.y)
        if (wall) {
            this.x--
        }
        if (this.x >= this.canvas.width / this.tileW) {
            this.x = 0
        }
    }
    up() {
        this.y--
        const wall = this.walls.find((w) => w.x === this.x && w.y === this.y)
        if (wall) {
            this.y++
        }
        if (this.y < 0) {
            this.y = this.canvas.height / this.tileW - 1
        }
    }
    down() {
        this.y++
        const wall = this.walls.find((w) => w.x === this.x && w.y === this.y)
        if (wall) {
            this.y--
        }
        if (this.y >= this.canvas.height / this.tileW) {
            this.y = 0
        }
    }
    findPath() {
        const path = []
        const visited = new Set()
        const queue = [{ x: this.x, y: this.y, path: [] }]
        let iterations = 0
        while (queue.length) {
            iterations++
            const { x, y, path } = queue.shift()
            if (iterations > 5000) {
                const possibleMoves = [
                    { x: x + 1, y: y },
                    { x: x - 1, y: y },
                    { x: x, y: y + 1 },
                    { x: x, y: y - 1 },
                ]
                for (const pos in possibleMoves) {
                    if (Math.random() < 0.5) {
                        return [{}, { x: possibleMoves[pos].x, y: possibleMoves[pos].y }]
                    }
                }
                break
            }
            if (x === this.player.x && y === this.player.y) {
                return path
            }
            visited.add(`${x}-${y}`)
            const possibleMoves = [
                { x: x + 1, y: y },
                { x: x - 1, y: y },
                { x: x, y: y + 1 },
                { x: x, y: y - 1 },
            ]
            for (const move of possibleMoves) {
                if (visited.has(`${move.x}-${move.y}`)) {
                    continue
                }
                if (this.walls.find((o) => o.x === move.x && o.y === move.y)) {
                    continue
                }
                queue.push({ x: move.x, y: move.y, path: [...path, { x, y }] })
            }
        }
        return path
    }
}
