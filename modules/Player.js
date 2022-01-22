import Position from './Position.js'
export default class Player extends Position {
    startX
    startY
    health = 3
    dead = false
    constructor(x, y) {
        super(x, y)
        this.startX = x
        this.startY = y
    }
    kill(ghost) {
        if (this.dead) return
        if (this.health === 0) {
            this.dead = true
            this.x = -1
            this.y = -1
            return alert('You lose')
        }
        ghost.resetPosition()
        this.x = 13
        this.y = 23
        this.health--
    }
}
