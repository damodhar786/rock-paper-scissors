import GameObj from "./Game";
const Game = new GameObj();
console.log("Game Objects: ", Game);


const initApp = () => {

    // Store All Time Data
    initAllTimeData();

    // Update Scoreboard
    updateScoreBoard();

    // Listen For Palyer Choice
    listenForPlayerChoice();

    // Listen Enter Key
    listenForEnterKey();

    // Listen For The Play Again
    listForPlayAgain();

    // Lock The Gameboard Height
    lockComputerFameBoardHeight();

    // Set Focus To Start New Game
     document.querySelector("h1").focus;

}

document.addEventListener("DOMContentLoaded", initApp);


// Store All Time Data
const initAllTimeData = () => {
    Game.setPlayerAlltime(parseInt(localStorage.getItem("playerAllTimeScore")) || 0);

    Game.setComputerAllTime(parseInt(localStorage.getItem("computerAllTimeScore")) || 0);
}


// Update Scoreboard
const updateScoreBoard = () => {

    const playerAts = document.getElementById("player_all_time_score");
    playerAts.textContent = Game.getPlayerAllTime();
    playerAts.ariaLabel = `Player has ${Game.getPlayerAllTime()} All Time Wins.`;

    const computerAts = document.getElementById("computer_all_time_score");
    computerAts.textContent = Game.getComputerAllTime();
    computerAts.ariaLabel = `Computer has ${Game.getComputerAllTime()} All Time Wins.`;

    const playerSesn = document.getElementById("player_session_score");
    playerSesn.textContent = Game.getPlayerSession();
    playerSesn.ariaLabel = `Player Wins This Session with ${Game.getPlayerSession()}.`;

    const computerSesn = document.getElementById("computer_session_score");
    computerSesn.textContent = Game.getComputerSession();
    computerSesn.ariaLabel = `Computer Wins This Session with ${Game.getPlayerSession()}.`;
}

const listenForPlayerChoice = () => {
    const playerImages = document.querySelectorAll(".playerBoard .gameboard__square img");
    playerImages.forEach(img => {
        img.addEventListener("click", (event) => {
            if (Game.getActiveStatus()) return;
            Game.startGame();
            const playerChoice = event.target.parentElement.id;
            updatePlayerMessage(playerChoice);
            playerImages.forEach(img => {
                if (img === event.target) {
                    img.parentElement.classList.add("selected");
                } else {
                    img.parentElement.classList.add("not-selected");
                }
            });
            // Animation
        });
    })
}

// Listen For Enter Key
const listenForEnterKey = () => {
    window.addEventListener("keydown", (event) => {
        if (event.code === "Enter" && event.target.tagName === 'IMG') {
            event.target.click();
        }
    })
}

// Play Again....
const listForPlayAgain = () => {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        resetBoard(); //TODO:
    })
}

// Lock Computer Game board Height
const lockComputerFameBoardHeight = () => {
    const computerGameBoard = document.querySelector(".computerBoard .gameboard");
    const computerGBstyles = getComputedStyle(computerGameBoard);
    const height = computerGBstyles.getPropertyValue("height");
    computerGameBoard.style.minHeight = height;
}

// Update Player Message on Click (Rock/Paper/Scissors)
const updatePlayerMessage = (choice) => {
    let playerMsg = document.getElementById("playerMsg").textContent;
    playerMsg += `${choice[0].toUpperCase()}${choice.slice(1)}!`;
    document.getElementById("playerMsg").textContent = playerMsg;
}

