// Class Drawing
export default class Drawing {
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
};