import Position from './Position.js'
export default class Fruit extends Position {
    special = false
    constructor(x, y, special = false) {
        super(x, y)
        this.special = special
    }
}
