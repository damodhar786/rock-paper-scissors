import GameObj from "./Game.js";
const Game = new GameObj();

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
    lockComputerGameBoardHeight();

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
    computerSesn.ariaLabel = `Computer Wins This Session with ${Game.getComputerSession()}.`;
}

const listenForPlayerChoice = () => {
    const playerImages = document.querySelectorAll(".playerGameBoard .gameboard__square img");
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
            computerAnimationSequence(playerChoice);
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
        resetBoard();
    })
}

// Lock Computer Game board Height
const lockComputerGameBoardHeight = () => {
    const computerGameBoard = document.querySelector(".computerGameBoard .gameboard");
    const computerGBstyles = getComputedStyle(computerGameBoard);
    const height = computerGBstyles.getPropertyValue("height");
    computerGameBoard.style.minHeight = height;
}

// Update Player Message on Click (Rock/Paper/Scissors)
const updatePlayerMessage = (choice) => {
    let playerMsg = document.getElementById("playerMsg").textContent;
    playerMsg += `${properCase(choice)}!`;
    document.getElementById("playerMsg").textContent = playerMsg;
}

// Animation Sequence
const computerAnimationSequence = (playerChoice) => {
    let interval = 1000;
    setTimeout(() => computerChoiceAnimation("computer_rock", 1), interval);
    setTimeout(() => computerChoiceAnimation("computer_paper", 2), interval += 500);
    setTimeout(() => computerChoiceAnimation("computer_scissors", 3), interval += 500);
    setTimeout(() => countdownFade(), interval += 750);
    setTimeout(() => {
        deleteCountdown();
        finishGameFlow(playerChoice);
    }, interval += 1000);
    setTimeout(() => askUserToPlayAgain(), interval += 1000);

}

const computerChoiceAnimation = (elementId, number) => {
    const element = document.getElementById(elementId);
    element.firstElementChild.remove();
    const p = document.createElement("p");
    p.textContent = number;
    element.appendChild(p);
}

const countdownFade = () => {
    const countdown = document.querySelectorAll(".computerGameBoard .gameboard__square p");
    countdown.forEach(el => {
        el.className = "fadeOut";
    });
}

const deleteCountdown = () => {
    const countdown = document.querySelectorAll(".computerGameBoard .gameboard__square p");
    countdown.forEach(el => {
        el.remove();
    });
}

const finishGameFlow = (playerChoice) => {
    const computerChoice = getComputerChoice();
    const winner = determineWinner(playerChoice, computerChoice);
    const actionMessage = buildActionMessage(winner, playerChoice, computerChoice);
    displayActionMessage(actionMessage);

    // Update aria result
    updateAriaResult(actionMessage, winner);

    // Update the score state
    updateScoreState(winner);

    // Update persistent data
    updatePersistentData(winner);

    // Update score board
    updateScoreBoard();

    // Update Winner Message
    updateWinnerMessage(winner);

    // Display Computer Choice
    displayComputerChoice(computerChoice);
}

const getComputerChoice = () => {
    const randomNumber = Math.floor(Math.random() * 3);
    const rpsArray = ["rock", "paper", "scissors"];
    return rpsArray[randomNumber];
}

const determineWinner = (player, computer) => {
    if (player === computer) return "tie";
    if (
        player === "rock" && computer === "paper" ||
        player === "paper" && computer === "scissors" ||
        player === "scissors" && computer === "rock"
    ) return "computer";
    return "player";

}

const buildActionMessage = (winner, playerChoice, computerChoice) => {
    if (winner === 'tie') return "Tie Game!";
    if (winner === "computer") {
        const action = getAction(computerChoice);
        return `${properCase(computerChoice)} ${action} ${properCase(playerChoice)}.`;
    } else {
        const action = getAction(playerChoice);
        return `${properCase(playerChoice)} ${action} ${properCase(computerChoice)}.`;
    }
}

const getAction = (choice) => {
    return choice === "rock" ? "smashes" : choice === "paper" ? "wraps" : "cuts";
}

const properCase = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}

const displayActionMessage = (actionMessage) => {
    const computerMsg = document.getElementById("computerMsg");
    computerMsg.textContent = actionMessage;
}

// Update aria Result
const updateAriaResult = (result, winner) => {
    const ariaResult = document.getElementById("playAgain");
    const winMessage =
        winner === "player" 
        ? "Congratulations, you are the Winner."
        : winner === "computer"
            ? "The computer is the Winner."
            : "";
    ariaResult.ariaLabel = `${result} ${winMessage} Click or press enter to play again.`;
        
}

// Update the score state
const updateScoreState = (winner) =>{
    if(winner === "tie") return;
    winner === "computer" ? Game.computerWins() : Game.playerWins();    
}

// Update persistent data
const updatePersistentData = (winner) =>{
    const store = winner === "computer" ? "computerAllTimeScore" : "playerAllTimeScore";
    const score = winner === "computer" ? Game.getComputerAllTime() : Game.getPlayerAllTime();
    localStorage.setItem(store,score);
}

// Update Winner Message
const updateWinnerMessage = (winner) =>{
    if(winner === "tie") return;
    const message = winner === "computer" ? "🤖 Computer wins! 🤖"
    : "🏆🔥 You Win! 🔥🏆";
    const playerMsg = document.getElementById("playerMsg");
    playerMsg.textContent = message;
}

// Display Computer Choice
const displayComputerChoice =(choice) =>{
    const square = document.getElementById("computer_paper");
    createGameImage(choice, square);
}

const askUserToPlayAgain = () => {
    const playAgain = document.getElementById("playAgain");
    playAgain.classList.toggle("hidden");
    playAgain.focus();
}

// Reset Board
const resetBoard = () => {
    const gameSquares = document.querySelectorAll(".gameboard div");
    gameSquares.forEach(el => {
        el.className = "gameboard__square";
    });
    const computerSquares = document.querySelectorAll(".computerGameBoard .gameboard__square");
    computerSquares.forEach(el => {
        if (el.firstElementChild)
        {
            el.firstElementChild.remove();            
        }
        if (el.id === "computer_rock"){
            createGameImage("rock", el);
        }
        if (el.id === "computer_paper"){
            createGameImage("paper", el);
        }
        if (el.id === "computer_scissors"){
            createGameImage("scissors", el);
        }
    });
    document.getElementById("playerMsg").textContent = "Player Chooses.....";
    document.getElementById("computerMsg").textContent = "Computer Chooses.....";
    const ariaResult = document.getElementById("playAgain");
    ariaResult.ariaLabel = "Player Chooses.....";
    document.getElementById("playerMsg").focus();
    document.getElementById("playAgain").classList.toggle("hidden");
    Game.endGame();
}

const createGameImage = (icon, appendToElement) => {    
    const image = document.createElement("img");
    image.src = `./dist/img/${icon}.png`;
    image.alt = icon;
    appendToElement.appendChild(image);
}