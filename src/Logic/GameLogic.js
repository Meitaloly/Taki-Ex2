const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }
const numOfColors = 4;
const numOfCardsForEachPlayer = 1;
let setStateInBoardCB;
let takenCardsCounter = 0;
let turnIndex = 2;
let openTaki = false;
let gameOver = false;
let numOfTurns = 0;
let cardOnTop = null;
let players = [];
let gameStarted = false;
let plus2 = 0;
let transformArrow = 0;
let gameMove = [];
let arrIndex = 0;
let avg = 0;
let avgPerGame = 0;
let is3Games = false;
let gameNum = 1;
let tournamentIsDone = false;

//statistics
let turnTime = [];
let avgTurnTimePerGame = [];
let fullTime = "";
let startTime = "00:01";
let endTime;
let sec = 0;
let min = 0;
let stopTimer = false;
let timeInterval;
let prevIndex = 1;
let takingCard;
let wrongSound;
let changeColorSound;
let winnerSound;
let loserSound;
let shuffleSound;


class GameLogic {
    static newGame() {
        prevIndex = 1;
        players = [];
        turnIndex = 2;
        takenCardsCounter = 0;
        gameOver = false;
        gameMove = [];
        numOfTurns = 0;
        turnTime = [];
        cardOnTop = null;
        openTaki = false;
        plus2 = 0;
        gameStarted = false;
        transformArrow = 0;
        fullTime = "";
        startTime = "00:01";
        endTime;
        sec = 0;
        min = 0;
        stopTimer = false;
        clearInterval(timeInterval);
        this.setSounds();
        gameNum = 1;
        is3Games = false;

    }

    static setSounds() {
        wrongSound = new Audio();
        wrongSound.src = "sounds/wrong.mp3";
        changeColorSound = new Audio();
        changeColorSound.src = "sounds/changeColorSound.mp3";
        winnerSound = new Audio();
        winnerSound.src = "sounds/winner.mp3";
        loserSound = new Audio();
        loserSound.src = "sounds/Fail.mp3";
        shuffleSound = new Audio();
        shuffleSound.src = "sounds/Shuffling Cards.mp3";
        takingCard = new Audio();
        takingCard.src = "sounds/takingCard.mp3";
    }

    static setAvgPerGame() {
        setStateInBoardCB("avgTimeForTurnPerGame", avgPerGame, false);
    }

    static addMove(state) {
        gameMove.push(JSON.parse(JSON.stringify(state)));
    };

    static checkPrevIndex() {
        return prevIndex === gameMove.length;
    }

    static checkNextIndex() {
        return prevIndex === 0;
    }

    static getPrev() {
        if (prevIndex < gameMove.length) {
            prevIndex++;
        }
        return gameMove[gameMove.length - prevIndex];
    };

    static getNext() {
        if (prevIndex > 1) {
            prevIndex--;
        }
        return gameMove[gameMove.length - prevIndex];
    };

    static isGameOver() {
        return gameOver;
    }

    static setCbFucntions(setStateInBoard) {
        setStateInBoardCB = setStateInBoard;
    }

    //add to reset all
    defultParams() {
        takenCardsCounter = 0;
    }

    static createCard(color, value, counterId, specialCard, points) {
        return {
            color: color,
            value: value,
            taken: false,
            played: false,
            specialCard: specialCard,
            cardId: counterId,
            isOpenCard: false,
            points: points,
            imgSourceFront: this.getCardSource(value, color),
            imgSourceBack: "cards/card_back.png"
        }
    }

    static getCardSource(value, color) {
        let cardSource;
        if (value === "change_colorful" || value === "taki_colorful") {
            cardSource = `cards/${value}.png`;
        }
        else {
            cardSource = `cards/${value}_${color}.png`;
        }
        return cardSource;
    }


    static createDeck() {
        const deck = [];
        let cardIdCounter = 0;

        for (let i = 0; i < numOfColors; i++) {
            for (let j = 1; j < 10; j++) {
                for (let k = 0; k < 2; k++) {
                    if (j !== 2) {
                        deck.push(this.createCard(cardColors[i], j, cardIdCounter, false, j));
                        cardIdCounter++;
                    }
                    else {
                        deck.push(this.createCard(cardColors[i], j + 'plus', cardIdCounter, true, 10));
                        cardIdCounter++;
                    }
                }
            }
            for (let j = 0; j < 2; j++) {
                deck.push(this.createCard(cardColors[i], "taki", cardIdCounter, true, 15));
                cardIdCounter++;
                deck.push(this.createCard(cardColors[i], "stop", cardIdCounter, true, 10));
                cardIdCounter++;
                deck.push(this.createCard(cardColors[i], "plus", cardIdCounter, true, 10));
                cardIdCounter++;
            }
            if (i < 2) {
                deck.push(this.createCard(null, "taki_colorful", cardIdCounter, true, 15));
                cardIdCounter++;
            }
            deck.push(this.createCard(null, "change_colorful", cardIdCounter, true, 15));
            cardIdCounter++;
        }
        console.log(deck);
        return deck;
    }

    static shareCardsToPlayers(numOfPlayers, deck) {
        for (let playerIndex = 0; playerIndex < numOfPlayers; playerIndex++) {
            players.push({
                index: playerIndex + 1,
                name: `Player ${playerIndex + 1}`,
                cards: [],
                score: 0,
                showCards: true,
                oneCardLeftCounter: 0
            });

            if (playerIndex !== numOfPlayers - 1) {
                players[playerIndex].name += ' (Rival)';
                players[playerIndex].showCards = false;
            }
            players[playerIndex].cards = this.shareCards(deck);
        }
        return players;
    }

    static shareCards(deck) {
        const cards = [];
        for (let i = 0; i < numOfCardsForEachPlayer; i++) {
            this.addCardToPlayersArr(cards, deck);
        }
        return cards;
    }

    static startNewGameInTournament(deck) {
        for (let key in deck) {
            if (deck[key].value === "taki_colorful" || deck[key].value === "change_colorful") {
                deck[key].color = null;
                deck[key].imgSourceFront = this.getCardSource(deck[key].value, deck[key].color);
            }
            deck[key].played = false;
            deck[key].taken = false;
        }

        for (let key in players) {
            players[key].cards = this.shareCards(deck);
            players[key].oneCardLeftCounter = 0;
        }
        setStateInBoardCB('players', players, false);

        cardOnTop = this.drawOpeningCard(deck);
        setStateInBoardCB('cardOnTop', cardOnTop);
    }

    static addCardToPlayersArr(arrToAddTheCard, deck) {
        console.log(arrToAddTheCard);
        let cardIndex;
        do {
            cardIndex = Math.floor(Math.random() * deck.length);
        } while (deck[cardIndex].taken === true);
        deck[cardIndex].taken = true;
        this.addTakenCardCounter(deck);
        arrToAddTheCard.push(deck[cardIndex]);
        if (turnIndex === players[0].index) {
            setTimeout(() => setStateInBoardCB('players', players, false), 2000);
        }
        else {
            setStateInBoardCB('players', players, false);
        }
        this.resizeCards();
        if (gameStarted) {
            //takingCard.play();
            console.log("player 1: " + players[0].cards);
            console.log("player 2: " + players[1].cards);
            if (plus2 > 0) {
                plus2--;
            }
            if (plus2 === 0) {
                this.changeTurn(1, 2, deck);
            }
        }
    }

    static addTakenCardCounter(deck) {
        takenCardsCounter++;
        setStateInBoardCB('takenCardsCounter', takenCardsCounter, false);
        if (takenCardsCounter === deck.length) {
            shuffleSound.play();
            for (let i = 0; i < deck.length; i++) {
                if (deck[i].played) {
                    deck[i].played = false;
                    deck[i].taken = false;
                    takenCardsCounter--;
                }
            }
        }
    }

    static setTournament() {
        is3Games = true;
    }

    static checkCard(playerIndex, card, numOfPlayers, deck) {
        if (playerIndex === turnIndex) {
            if (openTaki) {
                if (this.checkValidCard(card, openTaki)) {
                    this.removeAndSetTopCard(players[playerIndex - 1], card, deck);
                }
                else {
                    wrongSound.play();
                }
            }
            else {
                if (this.checkValidCard(card, openTaki)) {
                    let cardOnTopColor = cardOnTop.color;
                    this.removeAndSetTopCard(players[playerIndex - 1], card, deck);
                    this.isSpecialCard(players[playerIndex - 1], numOfPlayers, deck, cardOnTopColor);
                }
                else {
                    if (plus2 > 0) {
                        alert(`you have to take ${plus2} cards from deck!"`);
                    }
                    else {
                        wrongSound.play();
                    }
                }
            }
        }
        else {
            wrongSound.play();

        }
    }


    static checkValidCard(card, isOpenTaki) {
        let isValid = false;
        if (isOpenTaki) {
            if (card.color === cardOnTop.color) {
                isValid = true;
            }
        }
        else {
            if (plus2 > 0) {
                if (card.value === "2plus") {
                    isValid = true;
                }
            }
            else {
                if (card.color === cardOnTop.color || card.value === cardOnTop.value || card.value === "change_colorful" || card.value === "taki_colorful") {
                    isValid = true;
                }
            }
        }
        return isValid;

    }

    static removeAndSetTopCard(player, card, deck) {
        this.removeCardFromPlayersArr(player, card, deck);
        this.setNewcardOnTop(card, deck);
        if (player.cards.length === 1) {
            player.oneCardLeftCounter++;
        }
        setStateInBoardCB('players', players, false);
        this.printPlayersCards();
    }

    static printPlayersCards() {
        for (let i = 0; i < 2; i++) {
            console.log("cards of player " + (i + 1) + ":");
            for (let key in players[i].cards) {
                console.log(players[i].cards[key])
            }
        }
    }

    static removeCardFromPlayersArr(player, card, deck) {
        for (let key in player.cards) {
            if (player.cards[key].cardId === card.cardId) {
                player.cards.splice(player.cards.indexOf(player.cards[key]), 1);
                break;
            }
        }
        this.resizeCards();
        setStateInBoardCB("players", players, false);
    }

    static setColorToTopCard(color, deck) {
        changeColorSound.play();
        let newCard = cardOnTop;
        newCard.color = color;
        newCard.imgSourceFront = `cards/change_colorful_${color}.png`;
        this.setNewcardOnTop(newCard, deck);
    }

    static setNewcardOnTop(cardToPutOnTop, deck) {
        deck[cardOnTop.cardId].played = true;
        cardOnTop = cardToPutOnTop;
        setStateInBoardCB('cardOnTop', cardOnTop);
        // if (turnIndex === players[0].index) {
        //     setTimeout(() => { setStateInBoardCB('cardOnTop', cardOnTop) }, 2000);
        // }
        // else {
        //     setStateInBoardCB('cardOnTop', cardOnTop);
        // }
        console.log("card on top is : " + cardOnTop.value + " " + cardOnTop.color);
    }

    static isSpecialCard(player, numOfPlayers, deck, cardOnTopColor) {
        if (cardOnTop.value === "2plus") {
            plus2 += 2;
            this.checkPlayerWin(player, 1, numOfPlayers, deck);
        }
        else if (cardOnTop.value === "change_colorful" /*&& turnIndex === player.index*/) {
            setStateInBoardCB('changeColorWindowIsOpen', true, false);
            //this.changeTurn(this.checkTopCard(), numOfPlayers, deck);
        }
        else if (cardOnTop.value === "stop") {
            if (player.cards.length === 0) {
                //alert("stop the game");
                this.stopTheGame(deck);
            }
            else {
                this.changeTurn(this.checkTopCard(), numOfPlayers, deck);
            }
        }
        else if (cardOnTop.value === "taki" || cardOnTop.value === "taki_colorful") {
            if (turnIndex !== numOfPlayers) { // rival action
                this.rivalActionForTakiCard(player, numOfPlayers, deck);
                //this.checkPlayerWin(player, this.checkTopCard(), numOfPlayers, deck);
            }
            else {
                if (!openTaki) {
                    setStateInBoardCB('ImDoneIsHidden', false, false);
                    openTaki = true;
                }
            }
            if (cardOnTop.value === "taki_colorful") {
                //change the color of the taki to the cardOnTop.color
                cardOnTop.color = cardOnTopColor;
                cardOnTop.value = "taki";
                cardOnTop.imgSourceFront = this.getCardSource("taki", cardOnTopColor);
                setTimeout(() => { setStateInBoardCB('cardOntop', cardOnTop, false) }, 2000);
            }
        }
        else if (cardOnTop.value === "plus") {
            this.changeTurn(numOfPlayers, numOfPlayers, deck);
        }
        else {
            this.checkPlayerWin(player, 1, numOfPlayers, deck);
        }
    }

    static rivalActionForTakiCard(player, numOfPlayers, deck) {
        let SameColorCards = this.getCardsFromRivalArrbByColor(player.cards, cardOnTop.color);
        if (SameColorCards.length > 0) {
            openTaki = true;
            let takiTime = setInterval(() => { this.newTimeOut(player, deck, numOfPlayers, SameColorCards, takiTime) }, 2000);
        }
        else {
            this.checkPlayerWin(player, 1, numOfPlayers, deck);
        }
    }


    static newTimeOut(player, deck, numOfPlayers, arrOfSameCards, takiTime) {
        if (arrIndex < arrOfSameCards.length) {
            this.removeAndSetTopCard(player, arrOfSameCards[arrIndex], deck);
            arrIndex++;
        }
        else {
            clearTimeout(takiTime);
            openTaki = false;
            arrIndex = 0;
            this.checkPlayerWin(player, 1, numOfPlayers, deck);
        }
    }



    static gameTimer() {
        let handler = function () {
            if (!stopTimer) {
                if (++sec === 60) {
                    sec = 0;
                    ++min;
                }
                fullTime = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
                setStateInBoardCB("timer", fullTime, fullTime === "00:02");
            }
            else {
                clearInterval(timeInterval);
            }
        };

        timeInterval = setInterval(handler, 1000);
        handler();
    }

    static findAvgOfTurnTime(arr, isAllGames) {
        let sum = 0;
        if (arr.length !== 0) {
            for (let i = 0; i < arr.length; i++) {
                sum += arr[i];
            }
            let avgNum = Number(sum / arr.length);
            avg = Number(avgNum.toFixed(2));
        }
        else {
            avg = 0;
        }
        if (isAllGames) {
            avgPerGame = avg;
            setStateInBoardCB("avgTimeForTurnPerGame", avg, false);
        }
        setStateInBoardCB("avgTimeForTurn", avg, false);
    }

    static changeTurn(number, numOfPlayers, deck) {
        endTime = fullTime;
        if (openTaki) {
            this.rivalPlay(deck, numOfPlayers);
        }
        else {
            if (turnIndex === players[1].index) {
                this.setTurnTime(endTime);
                //this.rotateArrow();
            }
            if (number === numOfPlayers) {
                if (cardOnTop.value === "stop") {
                    numOfTurns += number;
                }
                else {
                    numOfTurns++;
                }
            }
            else {
                //this.rotateArrow();
                numOfTurns += number;

            }
            //this.rotateArrow();
            console.log("before chnging turn: " + turnIndex);
            let saveTurnIndex = turnIndex;
            turnIndex = ((turnIndex - 1) + number) % numOfPlayers + 1;
            setStateInBoardCB('turnIndex', turnIndex);
            setStateInBoardCB('numOfTurns', numOfTurns, false);
            if (saveTurnIndex !== turnIndex) {
                this.rotateArrow();
            }
            console.log("after chnging turn: " + turnIndex);
            startTime = fullTime;

            if (turnIndex !== numOfPlayers) {
                console.log("rivals turn");
                //this.rivalPlay(deck, numOfPlayers)
                setTimeout(() => { this.rivalPlay(deck, numOfPlayers) }, 2000);
            }
        }
    }


    static setTurnTime(endTime) {
        if (turnIndex === players[1].index) {
            let start = startTime.split(":");
            let startMin = Number(start[0]);
            startMin = startMin * 60;
            let startSec = Number(start[1]);
            let fullStartTimeInSec = startMin + startSec;

            let end = endTime.split(":");
            let endMin = Number(end[0]);
            endMin = endMin * 60;
            let endSec = Number(end[1]);
            let fullendTimeInSec = endMin + endSec;

            turnTime.push(fullendTimeInSec - fullStartTimeInSec);
            this.findAvgOfTurnTime(turnTime, false);
        }
    }


    static playerHasNo2PlusCards(player, numOfPlayers, deck) {
        let res = true;
        if (this.getCardsFromRivalArrbByValue(player.cards, "2plus").length > 0) {
            res = false;
        }
        return res;
    }

    static checkPlayerWin(player, num, numOfPlayers, deck) {

        if (player.cards.length === 0) {
            if (!is3Games) {
                turnIndex === players[numOfPlayers - 1].index ? winnerSound.play() : loserSound.play();
            }
            setTimeout(() => { this.stopTheGame(deck) }, 1000);
        }
        else {
            this.changeTurn(num, numOfPlayers, deck);
        }
    }

    static stopTheGame(deck) {
        avgTurnTimePerGame.push(avg);
        this.findAvgOfTurnTime(avgTurnTimePerGame, true);
        endTime = fullTime;
        stopTimer = true;
        gameOver = true;

        if (!is3Games) {
            setStateInBoardCB('endGameControllerIsHidden', false);
        }
        else {
            let winnerScore = 0;
            let winnerIndex;

            for (let j = 0; j < 2; j++) {
                if (players[j].cards.length > 0) {
                    for (let i = 0; i < players[j].cards.length; i++) {
                        winnerScore += players[j].cards[i].points;
                    }
                }
                else {
                    winnerIndex = j;
                }
            }
            players[winnerIndex].score += winnerScore;

            if (gameNum === 3) {
                if (players[0].score > players[1].score) {
                    setStateInBoardCB("winnerIndex", 0)
                    loserSound.play();
                }
                else if (players[0].score < players[1].score) {
                    setStateInBoardCB("winnerIndex", 1)
                    winnerSound.play();
                }
                else {
                    setStateInBoardCB("winnerIndex", "Tie!")
                }

                tournamentIsDone = true;
                setStateInBoardCB("tournamentIsDone", tournamentIsDone);
                this.newGame();
            }
            else {
                gameNum++;
                setStateInBoardCB("gameNum", gameNum);
                setStateInBoardCB("players", players, false);
                avg = 0;
                setStateInBoardCB("avgTimeForTurn", avg);
                gameStarted = false;
                this.startNewGameInTournament(deck);
                gameStarted = true;
                setStateInBoardCB("gameStarted", gameStarted);
                turnIndex = 2;
                setStateInBoardCB("turnIndex", turnIndex);
                takenCardsCounter = 0;
                setStateInBoardCB("takenCardsCounter", takenCardsCounter);
                gameOver = false;
                numOfTurns = 0;
                setStateInBoardCB("numOfTurns", numOfTurns);
                turnTime = [];
                plus2 = 0;
                transformArrow = 0;
                setStateInBoardCB("transformArrow", transformArrow);
                fullTime = "";
                startTime = "00:01";
                endTime;
                sec = 0;
                min = 0;
                stopTimer = false;
                clearInterval(timeInterval);
                this.setAvgPerGame();
                GameLogic.gameTimer();
            }
        }
    }

    static checkTopCard() {
        var nextTurn = 1;
        if (cardOnTop.value === "stop" || cardOnTop.value === "plus") {
            nextTurn = 2;
        }
        return nextTurn;
    }

    static drawOpeningCard(deck) {
        let CardIndex;
        do {
            CardIndex = Math.floor(Math.random() * deck.length);
        } while (deck[CardIndex].taken || deck[CardIndex].specialCard);
        deck[CardIndex].taken = true;
        this.addTakenCardCounter(deck);
        cardOnTop = deck[CardIndex];
        gameStarted = true;
        this.printPlayersCards();
        //setStateInBoardCB('cardOnTop',cardOnTop);
        return deck[CardIndex];
    }

    static checkStatusOnTableDeckClicked(player, deck) {
        if (!gameOver) {
            let isPlayerTurn = this.checkPlayerTurn(player);
            if (isPlayerTurn) {
                if (plus2 > 0) {
                    if (this.playerHasNo2PlusCards(player, 2, deck)) {
                        let numOfCardsPlayerHasToTake = plus2;
                        for (let i = 0; i < numOfCardsPlayerHasToTake; i++) {
                            this.addCardToPlayersArr(players[1].cards, deck);
                        }
                    }
                }
                else {
                    let hasCardsToUse = this.checkPlayerCards(player);
                    if (hasCardsToUse) {
                        wrongSound.play();
                    }
                    else if (!hasCardsToUse && !openTaki) {
                        this.addCardToPlayersArr(player.cards, deck);
                    }
                }
            }
        }
    }

    static checkPlayerCards(player) {
        let res = false;
        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i].value === cardOnTop.value || player.cards[i].color === cardOnTop.color ||
                player.cards[i].value === "change_colorful" || player.cards[i].value === "taki_colorful") {
                res = true;
                break;
            }
        }
        return res;
    }

    static checkPlayerTurn(player) {
        var res = false;
        if (turnIndex === player.index) {
            res = true;
        }
        return res;
    }

    static rivalPlay(deck, numOfPlayers) {
        let goodCardFound = false;
        if (!gameOver) {
            goodCardFound = false;
            let plus2Cards = this.getCardsFromRivalArrbByValue(players[0].cards, "2plus");
            if (plus2Cards.length > 0) {  // 2plus card exist 
                if (plus2 > 0 || cardOnTop.value === "2plus") { // there is an active/not active 2plus card on deck
                    this.removeAndSetTopCard(players[0], plus2Cards[0], deck);
                    plus2 += 2;
                    this.checkPlayerWin(players[0], 1, numOfPlayers, deck);
                    goodCardFound = true;
                }
                else {
                    goodCardFound = this.findSpcialCardWithSameColor(plus2Cards, numOfPlayers, deck, players[0]);
                    if (goodCardFound) {
                        plus2 += 2;
                        this.checkPlayerWin(players[0], 1, numOfPlayers, deck);
                    }
                }
            }
            if (!goodCardFound) {
                if (plus2 > 0) { //there is an active 2plus card and the rival has no 2plus cards
                    let numOfCardsPlayerHasToTake = plus2;
                    for (let i = 0; i < numOfCardsPlayerHasToTake; i++) {
                        this.addCardToPlayersArr(players[0].cards, deck);
                    }
                    //this.checkPlayerWin(players[0], 1, numOfPlayers, deck);
                }
                else { // no 2plus cards on deck or in rivalArr
                    if (!goodCardFound) {
                        let changeColorCards = this.getCardsFromRivalArrbByValue(players[0].cards, "change_colorful");

                        if (changeColorCards.length > 0) //change color exists
                        {
                            this.playWithColorChangeCard(players[0], changeColorCards[0], deck, numOfPlayers);
                        }
                        else //change color doesn't exist
                        {
                            let stopCards = this.getCardsFromRivalArrbByValue(players[0].cards, "stop");
                            if (stopCards.length > 0) {
                                goodCardFound = this.findSpcialCardWithSameColor(stopCards, numOfPlayers, deck, players[0]);
                            }
                            if (!goodCardFound) // stop with the same color wasn't found
                            {
                                var plusCards = this.getCardsFromRivalArrbByValue(players[0].cards, "plus");
                                if (plusCards.length > 0) {
                                    goodCardFound = this.findSpcialCardWithSameColor(plusCards, numOfPlayers, deck, players[0]);
                                }
                                if (!goodCardFound) // plus with the same color wasn't found
                                {
                                    let superTaki = this.getCardsFromRivalArrbByValue(players[0].cards, "taki_colorful");
                                    if (superTaki.length > 0) {
                                        goodCardFound = true;
                                        let cardOnTopColor = cardOnTop.color;
                                        this.removeAndSetTopCard(players[0], superTaki[0], deck);
                                        cardOnTop.color = cardOnTopColor;
                                        cardOnTop.value = "taki";
                                        cardOnTop.imgSourceFront = this.getCardSource("taki", cardOnTop.color);
                                        setTimeout(() => { setStateInBoardCB('cardOntop', cardOnTop); }, 2000);
                                        this.rivalActionForTakiCard(players[0], numOfPlayers, deck);
                                    }
                                    if (!goodCardFound) {  // super taki wasn't found
                                        let takiCards = this.getCardsFromRivalArrbByValue(players[0].cards, "taki");
                                        if (takiCards.length > 0) {
                                            goodCardFound = this.findSpcialCardWithSameColor(takiCards, numOfPlayers, deck, players[0]);
                                        }
                                        if (!goodCardFound) { // taki wasn't found
                                            let sameColorCards = this.getCardsFromRivalArrbByColor(players[0].cards, cardOnTop.color);
                                            if (sameColorCards.length > 0) //a number with the same color exists
                                            {
                                                this.removeAndSetTopCard(players[0], sameColorCards[0], deck);
                                                goodCardFound = true;
                                                this.checkPlayerWin(players[0], this.checkTopCard(), numOfPlayers, deck);
                                            }
                                            if (!goodCardFound) //a number with the same color doesn't exist
                                            {
                                                let sameValuecards = this.getCardsFromRivalArrbByValue(players[0].cards, cardOnTop.value);
                                                if (sameValuecards.length > 0) //the same number exists
                                                {
                                                    this.removeAndSetTopCard(players[0], sameValuecards[0], deck);
                                                    this.isSpecialCard(players[0], numOfPlayers, deck, cardOnTop.color);
                                                    goodCardFound = true;
                                                }
                                                else //the same number doesn't exist
                                                {
                                                    this.addCardToPlayersArr(players[0].cards, deck);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
    }

    static findSpcialCardWithSameColor(cards, numOfPlayers, deck, player) {
        let goodCardFound = false;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].color === cardOnTop.color) {
                this.removeAndSetTopCard(player, cards[i], deck);
                if (cards[i].value === "stop") {
                    this.checkPlayerWin(player, 2, numOfPlayers, deck);
                }
                else if (cards[i].value === "plus") {
                    this.changeTurn(numOfPlayers, numOfPlayers, deck);
                }
                else if (cards[i].value === "taki") {
                    this.rivalActionForTakiCard(player, numOfPlayers, deck);
                }
                goodCardFound = true;
                break;
            }
        }
        return goodCardFound;
    }

    static getCardsFromRivalArrbByValue(playerCards, value) {
        let cards = [];
        for (let key in playerCards) {
            if (playerCards[key].value === value) {
                cards.push(playerCards[key]);
            }
        }
        return cards;
    }

    static getCardsFromRivalArrbByColor(playerCards, color) {
        let cards = [];
        for (let key in playerCards) {
            if (playerCards[key].color === color) {
                cards.push(playerCards[key]);
            }
        }
        return cards;
    }

    static playWithColorChangeCard(player, card, deck, numOfPlayers) {
        this.removeAndSetTopCard(player, card, deck); //send right parameters!
        let color = this.chooseColor(player);
        cardOnTop.color = color;
        cardOnTop.imgSourceFront = `cards/change_colorful_${color}.png`;
        setTimeout(() => { this.setColorToTopCard(color, deck); }, 1000);
        setTimeout(() => { setStateInBoardCB('changeColorWindowIsOpen', false, false); }, (2000));
        setTimeout(() => { this.checkPlayerWin(player, 1, numOfPlayers, deck); }, 2000);

        //setTimeout(function () { changeOpenDeckColor(color); }, 1000);
        //setTimeout(function () { this.checkPlayerWin(1); }, 1000);
    }

    static chooseColor(player) {
        let colorsArr = this.setColorsArr(player);
        let color = this.getColorFromColorsArr(colorsArr);
        return cardColors[color];
    }

    static setColorsArr(player) {
        var resArr = [0, 0, 0, 0];
        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i].color !== null) {
                switch (player.cards[i].color) {
                    case "blue":
                        resArr[0]++;
                        break;
                    case "red":
                        resArr[1]++;
                        break;
                    case "green":
                        resArr[2]++;
                        break;
                    case "yellow":
                        resArr[3]++;
                        break;

                }
            }
        }
        return resArr;
    }

    static getColorFromColorsArr(colorsArr) {
        let max = 0;
        let indexOfMaxNum = 0;
        let res;

        for (let i = 0; i < colorsArr.length; i++) {
            if (colorsArr[i] > max) {
                max = colorsArr[i];
                indexOfMaxNum = i;
            }
        }
        res = indexOfMaxNum;
        return res;
    }

    static colorChangedInWindow(color, deck, player, numOfPlayers) {
        this.setColorToTopCard(color, deck);
        setStateInBoardCB('changeColorWindowIsOpen', false, false);
        // this.setState({
        //     modalIsOpen: false 
        // });
        this.checkPlayerWin(player, 1, numOfPlayers, deck);
    }


    static onImDoneButtonClicked(player, numOfPlayers, deck) {
        openTaki = false;
        setStateInBoardCB('ImDoneIsHidden', true, false);
        if (cardOnTop.value === "2plus") {
            plus2 += 2;
        }
        this.checkPlayerWin(player, this.checkTopCard(), numOfPlayers, deck);
    }

    static rotateArrow() {
        let newTransformAroow = transformArrow + 180;

        if (newTransformAroow >= 360) {
            newTransformAroow = newTransformAroow - 360;
        }
        transformArrow = newTransformAroow;
        setStateInBoardCB('transformArrow', newTransformAroow, false);
        console.log("rotating");
    }

    static resizeCards() {
        let cardWidth = 120;
        let cardSpace = 70;
        let resizeArr = [0, 0];
        let cardMarginLeft = [0, 0];

        for (let i = 0; i < 2; i++) {
            if (gameStarted) {
                this.checkSpacesBetweenCards(resizeArr, i);
            }
            cardMarginLeft[i] = -(cardWidth - cardSpace - resizeArr[i]);
        }
        setStateInBoardCB('cardMarginLeft', cardMarginLeft, false);
    }

    static checkSpacesBetweenCards(resizeArr, index) {
        if (players[index].cards.length > 21) {
            resizeArr[index] -= 40;
        }
        else if (players[index].cards.length > 17) {
            resizeArr[index] -= 35;
        }
        else if (players[index].cards.length > 14) {
            resizeArr[index] -= 30;
        }
        else if (players[index].cards.length > 11) {
            resizeArr[index] -= 25;
        }
        else if (players[index].cards.length > 8) {
            resizeArr[index] -= 12;
        }
        else if (players[index].cards.length < 5) {
            resizeArr[index] += 25;
        }
    }
}
export default GameLogic;
