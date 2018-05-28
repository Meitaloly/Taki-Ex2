const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }
const numOfColors = 4;
const numOfCardsForEachPlayer = 8;
let setStateInBoardCB;
let takenCardsCounter = 0;
let turnIndex = 2;
let openTaki = false;
let gameOver = false;
let numOfTurns = 0;
let cardOnTop = null;

class GameLogic {

    static setCbFucntions(setStateInBoard) {
        setStateInBoardCB = setStateInBoard;
    }

    //add to reset all
    defultParams() {
        takenCardsCounter = 0;
    }

    static createCard(color, value, counterId, specialCard) {
        return {
            color: color,
            value: value,
            taken: false,
            played: false,
            specialCard: specialCard,
            cardId: counterId,
            isOpenCard: false,
            imgSourceFront: this.getCardSource(value, color),
            imgSourceBack: "cards/card_back.png"
        }
    }

    static getCardSource(value, color) {
        let cardSource;
        if (value === "change_colorful" || value === "taki_colorful") {
            cardSource = "cards/" + value + ".png";
        }
        else {
            cardSource = "cards/" + value + "_" + color + ".png";
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
                        deck.push(this.createCard(cardColors[i], j, cardIdCounter, false));
                        cardIdCounter++;
                    }
                    else {
                        deck.push(this.createCard(cardColors[i], j + 'plus', cardIdCounter, true));
                        cardIdCounter++;
                    }
                }
            }
            for (let j = 0; j < 2; j++) {
                deck.push(this.createCard(cardColors[i], "taki", cardIdCounter, true));
                cardIdCounter++;
                deck.push(this.createCard(cardColors[i], "stop", cardIdCounter, true));
                cardIdCounter++;
                deck.push(this.createCard(cardColors[i], "plus", cardIdCounter, true));
                cardIdCounter++;
            }
            if (i < 2) {
                deck.push(this.createCard(null, "taki_colorful", cardIdCounter, true));
                cardIdCounter++;
            }
            deck.push(this.createCard(null, "change_colorful", cardIdCounter, true));
            cardIdCounter++;
        }
        console.log(deck);
        return deck;
    }

    static shareCardsToPlayers(numOfPlayers, deck) {
        const players = [];

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

    static addCardToPlayersArr(arrToAddTheCard, deck) {
        console.log(arrToAddTheCard);
        let cardIndex;
        do {
            cardIndex = Math.floor(Math.random() * deck.length);
        } while (deck[cardIndex].taken === true);
        deck[cardIndex].taken = true;
        this.addTakenCardCounter();
        arrToAddTheCard.push(deck[cardIndex]);
    }

    static addTakenCardCounter() {
        takenCardsCounter++;
        setStateInBoardCB('takenCardsCounter', takenCardsCounter);
    }

    static checkCard(player, card, numOfPlayers, deck) {
        if (player.index === turnIndex) {
            if (openTaki) {
                if (this.checkValidCard(card, openTaki)) {
                    this.removeAndSetTopCard(player, card, deck);
                }
                else {
                    alert("Wrong!");
                    //wrongSound.play();
                }
            }
            else {
                if (this.checkValidCard(card, openTaki)) {
                    let cardOnTopColor = cardOnTop.color;
                    this.removeAndSetTopCard(player, card, deck);
                    this.isSpecialCard(player, numOfPlayers, deck, cardOnTopColor);
                }
                else {
                    alert("Wrong!");
                    //wrongSound.play();
                }
            }
        }
        else {
            alert("not your turn!");
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
            if (card.color === cardOnTop.color || card.value === cardOnTop.value || card.value === "change_colorful" || card.value === "taki_colorful") {
                isValid = true;
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
    }

    static removeCardFromPlayersArr(player, card, deck) {
        for (let key in player.cards) {
            if (player.cards[key].cardId === card.cardId) {
                player.cards.splice(player.cards.indexOf(player.cards[key]), 1);
                //deck[card.cardId].played = true;
                break;
            }
        }
    }

    static setNewcardOnTop(cardToPutOnTop, deck) {
        deck[cardOnTop.cardId].played = true;
        cardOnTop = cardToPutOnTop;
        setStateInBoardCB('cardOnTop', cardOnTop);
        //cardOnTop = Object.assign(cardOnTop, cardToPutOnTop);
        console.log(cardOnTop);
    }

    static isSpecialCard(player, numOfPlayers, deck, cardOnTopColor) {
        if (cardOnTop.value === "change_colorful" /*&& turnIndex === player.index*/) {
            alert("change Color");
            //showChooseAColorWindow();
            this.changeTurn(player, this.checkTopCard(), numOfPlayers, deck);
        }
        else if (cardOnTop.value === "stop") {
            if (player.cards.length === 0) {
                alert("stop the game");
                //stopTheGame();
            }
            else {
                this.changeTurn(player, this.checkTopCard(), numOfPlayers, deck);
            }
        }
        else if (cardOnTop.value === "taki" || cardOnTop.value === "taki_colorful") {
            if (turnIndex !== numOfPlayers) { // rival action
                this.putAllCardsWithSameColorOfTaki(player);
                this.checkPlayerWin(player, this.checkTopCard(), numOfPlayers, deck);
            }
            else {
                if (!openTaki) {
                    //createTakiButton();
                    openTaki = true;
                }
            }
            if (cardOnTop.value === "taki_colorful") {
                //change the color of the taki to the cardOnTop.color
                cardOnTop.color = cardOnTopColor;
                cardOnTop.imgSourceFront = this.getCardSource("taki", cardOnTopColor);
                setTimeout(setStateInBoardCB('cardOntop', cardOnTop), 2000);
            }
        }
        else if (cardOnTop.value === "plus") {
            this.changeTurn(player, numOfPlayers, numOfPlayers,deck);
        }
        else {
            this.checkPlayerWin(player, 1, numOfPlayers, deck);
        }
    }

    static putAllCardsWithSameColorOfTaki(player) {
        let SameColorCards = this.getCardsFromRivalArrbByColor(player, cardOnTop.color);
        if (SameColorCards.length > 0) {
            openTaki = true;
            //let takiTime = setInterval(function () { newTimeOut(SameColorCards, takiTime) }, 1000);
        }
        else {
            this.checkPlayerWin(1);
        }
    }



    static changeTurn(player, number, numOfPlayers, deck) {
        //endTime = timer.getTime();
        //if (!openTaki) {
        if (number !== 2) {
            numOfTurns++;
            //setTurnTime(endTime);
            //      rotateArrow();
        }
        else {
            numOfTurns = + number;
            //turnTime.push(0);
        }
        turnIndex = (turnIndex + number) % (numOfPlayers + 1) + 1;
        setStateInBoardCB('turnIndex', turnIndex);
        setStateInBoardCB('numOfTurns', numOfTurns);

        //--------------------------------
        // NO NEED - SO FAR! 
        // -------------------------------
        // if (number === numOfPlayers) {
        //     numOfTurns++;
        // }
        // else {
        //     numOfTurns = + number;
        // }
        // -------------------------------

        //startTime = timer.getTime();
        if (turnIndex !== numOfPlayers) {
            setTimeout(this.rivalPlay(deck, numOfPlayers), 2000);
        }
        //   }
    }

    static checkPlayerWin(player, num, numOfPlayers, deck) {
        if (player.cards.length === 0) {
            //setTimeout(stopTheGame, 1000);
            alert("you win");
        }
        else {
            this.changeTurn(player, num, numOfPlayers, deck);
        }
    }

    static checkTopCard() {
        var nextTurn = 1;
        if (cardOnTop.value === "stop") {
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
        this.addTakenCardCounter();
        cardOnTop = deck[CardIndex];
        //setStateInBoardCB('cardOnTop',cardOnTop);
        return deck[CardIndex];
    }

    static checkStatusOnTableDeckClicked(player, deck) {
        if (!gameOver) {
            let isPlayerTurn = this.checkPlayerTurn(player);
            if (isPlayerTurn) {
                var hasCardsToUse = this.checkPlayerCards(player);
                if (hasCardsToUse) {
                    alert("you have cards to use");
                    //wrongSound.play();
                }
                else if (!hasCardsToUse && !openTaki) {
                    this.addCardToPlayersArr(player.cards, deck);
                }
            }
        }
    }

    static checkPlayerCards(player) {
        let res = false;
        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i].value === cardOnTop.value || player.cards[i].color === cardOnTop.color ||
                player.cards[i].value === "change_colorful") {
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
        // console.log("rival cards are:");
        // for (let key in players[0]) {
        //     console.log(players[0][key]);
        // }
        if (!gameOver) {
            let goodCardFound = false;
            let changeColorCards = this.getCardsFromRivalArrbByValue(player, "change_colorful");

            if (changeColorCards.length > 0) //change color exists
            {
                this.playWithColorChangeCard(player, changeColorCards[0], deck);
            }
            else //change color doesn't exist
            {
                let stopCards = this.getCardsFromRivalArrbByValue(player, "stop");
                if (stopCards.length > 0) {
                    goodCardFound = this.findSpcialCardWithSameColor(stopCards, numOfPlayers, deck, player);
                }
                if (!goodCardFound) // stop with the same color wasn't found
                {
                    let takiCards = this.getCardsFromRivalArrbByValue(player, "taki");

                    if (takiCards.length > 0) {
                        goodCardFound = this.findSpcialCardWithSameColor(takiCards, numOfPlayers, deck, player);
                    }
                    if (!goodCardFound) // taki with the same color wasn't found
                    {
                        var plusCards = this.getCardsFromRivalArrbByValue(player, "plus");
                        if (plusCards.length > 0) {
                            goodCardFound = this.findSpcialCardWithSameColor(plusCards, numOfPlayers, deck, player);
                        }
                        if (!goodCardFound) {
                            let sameColorCards = this.getCardsFromRivalArrbByColor(player, cardOnTop.color);
                            if (sameColorCards.length > 0) //a number with the same color exists
                            {
                                this.removeAndSetTopCard(player, sameColorCards[0], deck);
                                goodCardFound = true;
                                this.checkPlayerWin(player, this.checkTopCard(), numOfPlayers, deck);
                            }
                            if (!goodCardFound) //a number with the same color doesn't exist
                            {
                                let sameValuecards = this.getCardsFromRivalArrbByValue(player, cardOnTop.value);
                                if (sameValuecards.length > 0) //the same number exists
                                {
                                    this.removeAndSetTopCard(player, sameValuecards[0], deck);
                                    this.isSpecialCard(player, sameValuecards[0], numOfPlayers, deck);
                                    goodCardFound = true;
                                }
                                else //the same number doesn't exist
                                {
                                    this.addCardToPlayersArr(player.cards, deck);
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
                this.removeAndSetTopCard(cards[i], "rival-cards");
                if (cards[i].value === "stop") {
                    this.checkPlayerWin(player, 2, numOfPlayers, deck);
                }
                else if (cards[i].value === "plus") {
                    this.changeTurn(player, numOfPlayers, numOfPlayers, deck);
                }
                else if (cards[i].value === "taki") {
                    this.putAllCardsWithSameColorOfTaki(player);
                }
                goodCardFound = true;
                break;
            }
        }
        return goodCardFound;
    }

    static getCardsFromRivalArrbByValue(player, value) {
        let cards = [];
        for (let key in player) {
            if (player[key].value === value) {
                cards.push(player[key]);
            }
        }
        return cards;
    }

    static getCardsFromRivalArrbByColor(player, color) {
        let cards = [];
        for (let key in player) {
            if (player[key].color === color) {
                cards.push(player[key]);
            }
        }
        return cards;
    }

    static playWithColorChangeCard(player, card, deck) {
        this.removeAndSetTopCard(player, card, deck); //send right parameters!
        let color = this.chooseColor();
        cardOnTop.color = color;
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
}
export default GameLogic;
