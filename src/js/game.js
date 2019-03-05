// Imports
import Snake from "./snake.js";
import Apple from "./apple.js";
import Drawing from './drawing.js';

// Class Game
export default class Game {
    // Constructor
    constructor(){
        this.canvas = document.createElement("canvas"); // Drawing space
        this.canvasWidth = 900; // Drawing space width
        this.canvasHeight = 600; // Drawing space height
        this.blockSize = 30; // Snake block square size
        this.context = this.canvas.getContext('2d'); // Drawing space context
        this.widthInBlocks = this.canvasWidth / this.blockSize; // Width of drawing space in blocks
        this.heightInBlocks = this.canvasHeight / this.blockSize; // Height of drawing space in blocks
        this.delay; // Timing for refresh the drawing space
        this.snakeBody; // New Snake container
        this.appleBody; // New Apple container
        this.score; // Player score
        this.timeout; // Keep the timeout
    }
    // Method init 
    init() {
        // Set the canvas width and height
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        // Set the id attribute to canvas 
        this.canvas.setAttribute("id", "container");
        // Append the canvas to the body
        document.body.appendChild(this.canvas);
        // Launch the game
        this.launch();
    }
    // Method launch
    launch() {
        // Snake init
        this.snakeBody = new Snake();
        // Apple init
        this.appleBody = new Apple();
        // Score reset
        this.score = 0;
        // Delay reset 
        this.delay = 200;
        // Clear timeout
        clearTimeout(this.timeout);
        // Refresh canvas
        this.refreshDisplay();
    };
    // Method refresh position
    refreshDisplay() {
        // Snake go forward
        this.snakeBody.advance();
        // Snake check road
        if (this.snakeBody.checkRoad(this.widthInBlocks, this.heightInBlocks)) {
            // Game over
            Drawing.gameIsOver(this.context, this.canvasWidth, this.canvasHeight);
        }
        else {
            // Check if snake ate apple
            if (this.snakeBody.isEatingApple(this.appleBody)) {
                // Score ++
                this.score ++;
                // Increase speed by 2 each 5 points 
                if (this.score % 5 === 0) {
                    // Reducing the delay
                    this.increaseSpeed();
                }
                // Snake ate Apple = true
                this.snakeBody.ateApple = true;
                // Set a new position until new position is on the current snake
                do {
                    this.appleBody.setNewPosition(this.widthInBlocks, this.heightInBlocks);
                } while (this.appleBody.isOnSnake(this.snakeBody));
            }
            // Clear canvas
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            // Score refresh
            Drawing.drawScore(this.context, this.canvasWidth, this.canvasHeight, this.score);
            // Snake drawing
            Drawing.drawSnake(this.context, this.snakeBody, this.blockSize);
            // Apple drawing
            Drawing.drawApple(this.context, this.appleBody, this.blockSize);
            // Timeout
            this.timeout = setTimeout(this.refreshDisplay.bind(this), this.delay);
        }
    };
    // Method increase snake speed
    increaseSpeed() {
        this.delay /= 1.5;
    };
};
