const app = {
    // Properties
    instance : null, // Catch the game instance  

    // Method init application
    gameInit : () => {
        // DOM loaded
        console.log("Ready player one");
        
        // Init game
        app.instance = new app.game();
        app.instance.init();
        
        // Check the key press
        document.addEventListener("keydown", app.handleKeyDown);
    },
    // Method handle key down by user
    handleKeyDown : evt => {
        // Key code 
        const key = evt.keyCode;
        // New direction 
        let newDirection;
        // Case of direction 
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39: 
                newDirection = "right";
                break;
            case 40: 
                newDirection = "down";
                break;
            case 32: // Reload game if space key down
                app.instance.launch();
                break;
        
            default:
                break;
        }
        // Ask to the snake for set the new direction
        app.instance.snakeBody.setDirection(newDirection);
    },

    // Class Game
    game : class Game {
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
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.canvas.setAttribute("id", "container");
            // TODO: cleaning and comment this section
            // this.canvas.style.border = "30px solid gray";
            // this.canvas.style.margin = "50px auto";
            // this.canvas.display = "block";
            // this.canvas.backgroundColor = "ddd";
            document.body.appendChild(this.canvas);
            this.launch();
        }
        // Method launch
        launch() {
            // Snake init
            this.snakeBody = new app.snake();
            // Apple init
            this.appleBody = new app.apple();
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
                app.drawing.gameIsOver(this.context, this.canvasWidth, this.canvasHeight);
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
                app.drawing.drawScore(this.context, this.canvasWidth, this.canvasHeight, this.score);
                // Snake drawing
                app.drawing.drawSnake(this.context, this.snakeBody, this.blockSize);
                // Apple drawing
                app.drawing.drawApple(this.context, this.appleBody, this.blockSize);
                // Timeout
                this.timeout = setTimeout(this.refreshDisplay.bind(this), this.delay);
            }
        };
        // Method increase snake speed
        increaseSpeed() {
            this.delay /= 1.5;
        };
    },
    // Class Apple
    apple : class Apple {
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
    },
    // Class Snake
    snake : class Snake {
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
            if (allowedDirection.indexOf(newDirection) > -1) {
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
    },
    // Class Drawing
    drawing : class Drawing {
        // Methods
        static drawSnake(context, snake, blockSize) {
            // Keep canvas context
            context.save();
            // Canvas fill
            context.fillStyle = "#153e7b";
            for (const block of snake.body) {
                this.drawBlock(context, block, blockSize); 
            }
            // Restort canvas context
            context.restore();
        }
        static drawApple(context, apple , blockSize){
            // Keep canvas context
            context.save();
            // Styles and mesures
            context.fillStyle = "#33cc33";
            context.beginPath();
            const radius = blockSize / 2;
            const xPosition = apple.position[0]*blockSize + radius;
            const yPosition = apple.position[1]*blockSize + radius;
            context.arc(xPosition, yPosition, radius, 0, Math.PI*2, true);
            // Canvas fill
            context.fill();
            // Restort canvas context
            context.restore();
        }
        static drawBlock(context, position, blockSize){
            // new block position
            const [x, y] = position;
            // Canvas fill
            context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
        static drawScore(context, canvasWidth, canvasHeight, score) {
            // Keep convas context
            context.save();
            // Style 
            context.font = "bold 65px sans-sherif";
            context.fillStyle = "grey";
            context.textAlign = "center";
            context.textBaseline = "middle";
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            // Load message
            context.fillText(score.toString(), centerX, centerY);
            // Restort canvas context
            context.restore();
        }
        static gameIsOver(context, canvasWidth, canvasHeight) {
            // Keep convas context
            context.save();
            // Style 
            context.font = "bold 75px sans-sherif";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.strokeStyle = "white";
            context.lineWidth = 5;
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            // Load message Game over
            context.strokeText("Game Over", centerX, centerY - 180);
            context.fillText("Game Over", centerX, centerY - 180);
            // Load message Replay
            context.font = "bold 30px sans-sherif";
            context.fillStyle = "black";
            context.fillText("Appuyer sur la touche espace pour relancer le jeu", centerX, centerY - 120);
            // Restort canvas context
            context.restore();
        }
    },
};
// DOM loaded and start the app
document.addEventListener('DOMContentLoaded', app.gameInit);