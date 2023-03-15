export default class GameObj{
    constructor(){
        this.active = false;
        this.playerAllTime = 0;
        this.computerAllTime = 0;
        this.playerSession = 0;
        this.computerSession = 0;
    }

    getActiveStatus(){
        return this.active;
    }

    startGame(){
        this.active = true;
    }

    endGame(){
        this.active = false;
    }

    getPlayerAllTime(){
        return this.playerAllTime;
    }

    setPlayerAlltime(number){
     this.playerAllTime = number;
    }

    getComputerAllTime(){
        return this.computerAllTime;
    }

    setComputerAllTime(number){
        this.computerAllTime = number
    }

    getPlayerSession(){
        return this.playerSession;
    }

    playerWins(){
        this.playerSession += 1;
        this.playerAllTime += 1;
    }

    getComputerSession(){
        return this.computerSession;
    }

    computerWins(){
        this.computerSession += 1;
        this.computerAllTime += 1;
    }
}