const app = {
    // Properties
    canvas : document.createElement("canvas"), // Drawing space
    canvasWidth : 900, // Drawing space width
    canvasHeight : 600, // Drawing space height
    blockSize : 30, // Snake block square size
    context : null, // Drawing space context
    delay : null, // Timing for refresh the drawing space
    snakeBody : null, // New Snake container
    appleBody : null, // New Apple container
    widthInBlocks : 0, // Width of drawing space in blocks
    heightInBlocks : 0, // Height of drawing space in blocks
    score : 0, // Player score
    timeout : null, // Keep the timeout
    
    // Method init application
    gameInit : () => {
        // DOM loaded
        console.log("Ready player one");
        
        // Canvas drawing space
        app.canvas.setAttribute("id", "container");
        app.canvas.width = app.canvasWidth;
        app.canvas.height = app.canvasHeight;
        document.body.appendChild(app.canvas);
        // Canvas context
        app.context = app.canvas.getContext('2d');
        
        // App launch 
        app.launch();
        
        // Check the key press
        document.addEventListener("keydown", app.handleKeyDown);
    },
    // Method launch
    launch : () => {
        // Snake init
        app.snakeBody = new app.snake();
        // Apple init
        app.appleBody = new app.apple();
        // Score reset
        app.score = 0;
        // Delay reset 
        app.delay = 200;
        // Clear timeout
        clearTimeout(app.timeout);
        // Refresh canvas
        app.refreshDisplay();
    },
    // Method refresh position
    refreshDisplay : () => {
        // Snake go forward
        app.snakeBody.advance();
        // Snake check road
        if (app.snakeBody.checkRoad()) {
            // Game over
            app.drawing.gameIsOver(app.context, app.canvasWidth, app.canvasHeight);
        }
        else {
            // Check if snake ate apple
            if (app.snakeBody.isEatingApple(app.appleBody)) {
                // Score ++
                app.score ++;
                // Increase speed by 2 each 5 points 
                if (app.score % 5 === 0) {
                    // Reducing the delay
                    app.increaseSpeed();
                }
                // Snake ate Apple = true
                app.snakeBody.ateApple = true;
                // Set a new position until new position is on the current snake
                do {
                    app.appleBody.setNewPosition();
                } while (app.appleBody.isOnSnake(app.snakeBody));
            }
            // Clear canvas
            app.context.clearRect(0, 0, app.canvasWidth, app.canvasHeight);
            // Score refresh
            app.drawing.drawScore(app.context, app.canvasWidth, app.canvasHeight, app.score);
            // Snake drawing
            app.drawing.drawSnake(app.context, app.snakeBody, app.blockSize);
            // Apple drawing
            app.drawing.drawApple(app.context, app.appleBody, app.blockSize);
            // Timeout
            app.timeout = setTimeout(app.refreshDisplay, app.delay);
        }
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
                app.launch();
                break;
        
            default:
                break;
        }
        // Ask to the snake for set the new direction
        app.snakeBody.setDirection(newDirection);
    },
    // Method increase snake speed
    increaseSpeed : () => {
        app.delay /= 1.5;
    },

    // Class Apple
    apple : class Apple {
        // Constructor
        constructor(position = [5,5]) {
            // Set the apple position
            this.position = position;
        }
        // Method to set a new position 
        setNewPosition() {
            const newX = Math.round(Math.random() * (app.widthInBlocks - 1));
            const newY = Math.round(Math.random() * (app.heightInBlocks - 1));
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
        checkRoad() {
            // Size of canvas in blocks
            app.widthInBlocks = app.canvasWidth / app.blockSize;
            app.heightInBlocks = app.canvasHeight / app.blockSize;
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
            const maxX = app.widthInBlocks - 1;
            const maxY = app.heightInBlocks - 1;
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

            if ((head[0] === appleToEat.position[0]) && (head[1]=== appleToEat.position[1])) {
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
            app.context.restore();
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
            app.context.font = "bold 65px sans-sherif";
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