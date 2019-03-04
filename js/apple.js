// Class Apple
export default class Apple {
    // Constructor
    constructor(position = [5,5]) {
        // Set the apple position
        this.position = position;
    }
    // Method to set a new position 
    setNewPosition(widthInBlocks, heightInBlocks) {
        const newX = Math.round(Math.random() * (widthInBlocks - 1));
        const newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX, newY];
    }
    // Method to check if the position is set on the snake 
    isOnSnake(snakeToCheck) {
        let isOnSnake = false;
        for (const block of snakeToCheck.body) {
            if ((this.position[0] === block[0]) && (this.position[1] === block[1])){
                isOnSnake = true;
            }
        }
        return isOnSnake
    }
};