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
        app.snakeBody = new app.snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
        // Apple init
        app.appleBody = new app.apple([10,10]);
        // Score reset
        app.score = 0;
        // Delay reset 
        app.delay = 200;
        // Clear timeout
        clearTimeout(app.timeout);
        // Refresh canvas
        app.refreshPosition();
    },
    // Method refresh position
    refreshPosition : () => {
        // Snake go forward
        app.snakeBody.advance();
        // Snake check road
        if (app.snakeBody.checkRoad()) {
            // Game over
            app.gameIsOver();
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
            app.drawScore();
            // Snake drawing
            app.snakeBody.draw();
            // Apple drawing
            app.appleBody.draw();
            // Timeout
            app.timeout = setTimeout(app.refreshPosition, app.delay);
        }
    },
    // Method drawing block
    drawBlock : (position) => {
        const xPosition = position[0] * app.blockSize;
        const yPosition = position[1] * app.blockSize;
        app.context.fillRect(xPosition, yPosition, app.blockSize, app.blockSize);
    },
    // Method dranwScore, helpfull to refresh the score during the game
    drawScore : () => {
        // Keep convas context
        app.context.save();
        // Style 
        app.context.font = "bold 65px sans-sherif";
        app.context.fillStyle = "grey";
        app.context.textAlign = "center";
        app.context.textBaseline = "middle";
        const centerX = app.canvasWidth / 2;
        const centerY = app.canvasHeight / 2;
        // Load message
        app.context.fillText(app.score.toString(), centerX, centerY);
        // Restort canvas context
        app.context.restore();
    },
    // Method handle key down by user
    handleKeyDown : (evt) => {
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
    // Method game is over
    gameIsOver : () => {
        // Keep convas context
        app.context.save();
        // Style 
        app.context.font = "bold 75px sans-sherif";
        app.context.fillStyle = "black";
        app.context.textAlign = "center";
        app.context.textBaseline = "middle";
        app.context.strokeStyle = "white";
        app.context.lineWidth = 5;
        const centerX = app.canvasWidth / 2;
        const centerY = app.canvasHeight / 2;
        // Load message Game over
        app.context.strokeText("Game Over", centerX, centerY - 180);
        app.context.fillText("Game Over", centerX, centerY - 180);
        // Load message Replay
        app.context.font = "bold 30px sans-sherif";
        app.context.fillStyle = "black";
        app.context.fillText("Appuyer sur la touche espace pour relancer le jeu", centerX, centerY - 120);
        // Restort canvas context
        app.context.restore();
    },

    // Class apple
    apple : class apple {
        // Constructor
        constructor(position) {
            // Set the apple position
            this.position = position;
        }
        // Method drawing capacity for apple
        draw = () => {
            app.context.save();
            app.context.fillStyle = "#33cc33";
            app.context.beginPath();
            const radius = app.blockSize / 2;
            const xPosition = this.position[0]*app.blockSize + radius;
            const yPosition = this.position[1]*app.blockSize + radius;
            app.context.arc(xPosition, yPosition, radius, 0, Math.PI*2, true);
            app.context.fill();

            app.context.restore();
        }
        // Method to set a new position 
        setNewPosition = () => {
            const newX = Math.round(Math.random() * (app.widthInBlocks - 1));
            const newY = Math.round(Math.random() * (app.heightInBlocks - 1));
            this.position = [newX, newY];
        }
        // Method to check if the position is set on the snake 
        isOnSnake = (snakeToCheck) => {
            let isOnSnake = false;
            for (let index = 0; index < snakeToCheck.body.length; index++) {
                if ((this.position[0] === snakeToCheck.body[index][0]) && (this.position[1] === snakeToCheck.body[index][1])){
                    isOnSnake = true;
                }
            }
            return isOnSnake
        }
    },
    // Class snake
    snake : class snake {
        // Constructor
        constructor(body, direction){
            // Body of the snake
            this.body = body;
            // Direction of the snake
            this.direction = direction;
            // If snake ate apple 
            this.ateApple = false;
        }
        // Method drawing
        draw = () => {
            app.context.save();
            app.context.fillStyle = "#153e7b";
            for (let index = 0; index < this.body.length; index++) {
                app.drawBlock(this.body[index]);  
            }
            app.context.restore();
        }
        // Method go forward
        advance = () => {
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
        setDirection = (newDirection) => {
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
        checkRoad = () => {
            // Size of canvas in blocks
            app.widthInBlocks = app.canvasWidth / app.blockSize;
            app.heightInBlocks = app.canvasHeight / app.blockSize;
            // Boolean for wall impact
            let wallImpact = false;
            // Boolean for snake body impact
            let snakeImpact = false;
            // Snake head value
            const head = this.body[0];
            // End of the snake body
            const rest = this.body.slice(1);
            // X snake head position
            const snakeX = head[0];
            // Y snake head position
            const snakeY = head[1];
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
            for (let index = 0; index < rest.length; index++) {
                if ((snakeX === rest[index][0]) && (snakeY === rest[index][1])) {
                    snakeImpact = true;
                }  
            }

            return snakeImpact || wallImpact;
        }
        // Method check if eat apple on the road
        isEatingApple = (appleToEat) => {
            const head = this.body[0];

            if ((head[0] === appleToEat.position[0]) && (head[1]=== appleToEat.position[1])) {
                return true
            } else {
                return false;
            }
        }
    },
};
// DOM loaded and start the app
document.addEventListener('DOMContentLoaded', app.gameInit);