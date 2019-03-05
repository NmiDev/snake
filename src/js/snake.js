// Class Snake
export default class Snake {
    // Constructor
    constructor(body = [[6,4], [5,4], [4,4], [3,4], [2,4]] , direction = "right"){
        // Body of the snake
        this.body = body;
        // Direction of the snake
        this.direction = direction;
        // If snake ate apple 
        this.ateApple = false;
    }
    // Method go forward
    advance() {
        // Catch the first position
        const nextPosition = this.body[0].slice();
        // Switch case for direction
        switch (this.direction) {
            case "left":
                // Change the first position
                nextPosition[0] -= 1;
                break;
            
            case "right":
                // Change the first position
                nextPosition[0] += 1;
                break;

            case "down":
                // Change the first position
                nextPosition[1] += 1;                    
                break;
            
            case "up":
                // Change the first position
                nextPosition[1] -= 1;                    
                break;
        
            default:
                break;
        }
        // Adding the new position
        this.body.unshift(nextPosition);
        // Now check if the snake has not eating apple
        if (!this.ateApple) {
            // Delete the last position
            this.body.pop();
        } else {
            // Turn off ateApple
            this.ateApple = false;
        }
    }
    // Method set direction
    setDirection(newDirection) {
        // Create const for allowed Direction
        let allowedDirection = "";
        // Case for allowed direction depending of actual direction
        switch (this.direction) {
            case "left":
                allowedDirection = ["up", "down"];
                break;
            
            case "right":
                allowedDirection = ["up", "down"];
                break;

            case "down":
                allowedDirection = ["left", "right"];
                break;
            
            case "up":
                allowedDirection = ["left", "right"];
                break;

            default :
                throw("Invalid direction");
        }
        // Check if allowed direction and set the new value
        if (allowedDirection.includes(newDirection)) {
            this.direction = newDirection;
        }
    }
    // Method check road
    checkRoad(widthInBlocks, heightInBlocks) {
        // Init Boolean for wall impact
        let wallImpact = false;
        // Init Boolean for snake body impact
        let snakeImpact = false;
        // Snake head and body rest
        const [head, ...rest] = this.body;
        // Snake head position
        const [snakeX, snakeY] = head;
        // Value of correct head position 
        const minX = 0;
        const minY = 0
        const maxX = widthInBlocks - 1;
        const maxY = heightInBlocks - 1;
        const badXposition = snakeX < minX || snakeX > maxX ;
        const badYposition = snakeY < minY || snakeY > maxY ;

        // Check wall impact 
        if (badXposition || badYposition){
            wallImpact = true;
        };

        // Check body impact
        for (const block of rest) {
            if ((snakeX === block[0]) && (snakeY === block[1])) {
                snakeImpact = true;
            }  
        }

        return snakeImpact || wallImpact;
    }
    // Method check if eat apple on the road
    isEatingApple(appleToEat) {
        const head = this.body[0];

        if ((head[0] === appleToEat.position[0]) && (head[1] === appleToEat.position[1])) {
            return true
        } else {
            return false;
        }
    }
};