// Imports
import "babel-polyfill";
import Game from "./js/game.js";

// Imports CSS
import reset from "./styles/reset.css";
import style from "./styles/index.css";

// Imports images
import snake from "./assets/img/snake.svg";

// Application
const app = {
    // Properties
    instance : null, // Catch the game instance  

    // Method init application
    gameInit : () => {
        // DOM loaded
        console.log("Ready player one");

        // Loading images
        const snakeLogo = new Image();
        snakeLogo.src = snake;
        snakeLogo.alt = "Loggo du jeu du serpent";
        snakeLogo.id = "logo-img";
        document.getElementById("logo-container").appendChild(snakeLogo);
        
        // Init game
        app.instance = new Game();
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
            case 13: // Load game if enter key down
                app.instance.launch();
                break;
        
            default:
                break;
        }
        // Ask to the snake for set the new direction
        app.instance.snakeBody.setDirection(newDirection);
    },

};
// DOM loaded and start the app
document.addEventListener('DOMContentLoaded', app.gameInit);
