// Class Drawing
export default class Drawing {
    // Methods
    static drawSnake(context, snake, blockSize) {
        // Keep canvas context
        context.save();
        // Canvas fill
        context.fillStyle = "rgba(0, 0, 0, 0.70)";
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
        context.fillStyle = "#8F00B2";
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
    static drawScore(context, score) {
        // Prepare message
        const message = `score <${score}>`;
        // Keep convas context
        context.save();
        // Style 
        context.font = "lighter 1.4rem joystix";
        context.fillStyle = "black";
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.lineWidth = 5;
        // Load message
        context.fillText(message.toString(), 15, 30);
        // Restort canvas context
        context.restore();
    }
    static gameIsOver(context, canvasWidth, canvasHeight) {
        // Keep convas context
        context.save();
        // Style 
        context.font = "lighter 3.5rem joystix";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 5;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        // Load message Game over
        context.fillText("Game Over", centerX, centerY - 120);
        // Load message Replay
        context.font = "lighter 1.6rem joystix";
        context.fillStyle = "black";
        context.fillText("Press enter and play again", centerX, centerY);
        // Restort canvas context
        context.restore();
    }
};
