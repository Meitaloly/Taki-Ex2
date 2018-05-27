const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }
const numOfColors = 4;
const numOfCardsForEachPlayer = 8;
let setStateInBoardCB;
let takenCardsCounter = 0;
let turnIndex = 2;
let openTaki = false;
let gameOver = false;

class GameLogic {

    static setCbFucntions(setStateInBoard) {
        setStateInBoardCB = setStateInBoard;
    }

    //add to reset all
    defultParams(){
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
        if (value === "change_colorful") {
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
                if (j !== 2) {
                    deck.push(this.createCard(cardColors[i], j, cardIdCounter, false));
                    cardIdCounter++;
                    deck.push(this.createCard(cardColors[i], j, cardIdCounter, false));
                    cardIdCounter++;
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
            deck.push(this.createCard(null, "change_colorful", cardIdCounter, true));
            cardIdCounter++;

        }
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

    static addTakenCardCounter(){
        takenCardsCounter++;
        setStateInBoardCB('takenCardsCounter', takenCardsCounter);
    }

    static checkCard(player, card, cardOnTop, numOfPlayers, deck, numOfTurns) {
        if (player.index === turnIndex) {
            // // if (openTaki) {
                 
                    //  if (card.color === cardOnTop.color) {
                    //      removeAndSetTopCard(card, elemntClassName);
                    //  }
                    //  else
                    //  {
                    //     alert("Wrong!");
            //             wrongSound.play();
                     //}
            //     }
            // // }
            // else {
            if (card.color === cardOnTop.color || card.value === cardOnTop.value || card.value === "change_colorful") {
                this.removeAndSetTopCard(player, card, deck, cardOnTop);
                this.isSpecialCard(player, card, numOfPlayers, numOfTurns,cardOnTop, deck);
            }
            else {
                alert("Wrong!");
                //wrongSound.play();
                return cardOnTop;
            }
        }
    }

    static removeAndSetTopCard(player, card, deck, cardOnTop) {
        this.removeCardFromPlayersArr(player, card, deck);
        this.setNewcardOnTop(card, cardOnTop, deck);
        if (player.cards.length === 1) {
            player.oneCardLeftCounter++;
        }
    }

    static removeCardFromPlayersArr(player, card, deck) {
        for (let key in player.cards) {
            if (player.cards[key].cardId === card.cardId) {
                player.cards.splice(player.cards.indexOf(player.cards[key]), 1);
                deck[card.cardId].played = true;
                break;
            }
        }
    }

    static setNewcardOnTop(cardToPutOnTop, cardOnTop, deck) {
        deck[cardOnTop.cardId].played = true;
        cardOnTop = Object.assign(cardOnTop, cardToPutOnTop);
    }

    static isSpecialCard(player, card, numOfPlayers, numOfTurns,cardOnTop, deck) {
        if (card.value === "change_colorful" /*&& turnIndex === player.index*/) {
            alert("change Color");
            //showChooseAColorWindow();
            this.changeTurn(player, 1, numOfPlayers, numOfTurns, cardOnTop, deck);
        }
        else if (card.value === "stop") {
            if (player.cards.length === 0) {
                alert("stop the game");
                //stopTheGame();
            }
            else {
                this.changeTurn(player, 2, numOfPlayers, numOfTurns, cardOnTop, deck);
            }
        }
        else if (card.value === "taki") {
            if (turnIndex !== numOfPlayers) {
                this.putAllCardsWithSameColorOfTaki(cardOnTop,player);
                this.checkPlayerWin(player,this.checkTopCard(cardOnTop),numOfPlayers,numOfTurns, cardOnTop, deck);
            }
            else {
                alert("not in taki mode");
                // //if (!openTaki) {
                //     createTakiButton();
                //     openTaki = true;
                // //}//
            }
        }
        else if (card.value === "plus") {
            this.changeTurn(player, numOfPlayers, numOfPlayers, numOfTurns, cardOnTop, deck);
        }
        else {
            this.checkPlayerWin(player, 1, numOfPlayers, numOfTurns, cardOnTop, deck);
        }
    }

    static putAllCardsWithSameColorOfTaki(cardOnTop,player) {
        let SameColorCards = this.getCardsFromRivalArrbByColor(player, cardOnTop.color);
        if (SameColorCards.length > 0) {
            openTaki = true;
            //let takiTime = setInterval(function () { newTimeOut(SameColorCards, takiTime) }, 1000);
        }
        else {
            this.checkPlayerWin(1);
        }
    }

    

    static changeTurn(player, number, numOfPlayers, numOfTurns, cardOnTop, deck) {
        //endTime = timer.getTime();
        //if (!openTaki) {
        if (number !== 2) {
            //setTurnTime(endTime);
            //      rotateArrow();
        }
        else {
            //turnTime.push(0);
        }
        turnIndex = (turnIndex + number) % numOfPlayers;
        setStateInBoardCB('turnIndex', turnIndex);
        if (number === numOfPlayers) {
            numOfTurns++;
        }
        else {
            numOfTurns = + number;
        }
        //startTime = timer.getTime();
        if (turnIndex !== player.turnIndex) {
            //  setTimeout(rivalPlay(player,cardOnTop, deck, numOfPlayers, numOfTurns), 2000);
        }
        //   }
    }

    static checkPlayerWin(player, num, numOfPlayers, numOfTurns, cardOnTop, deck) {
        if (player.cards.length === 0) {
            //setTimeout(stopTheGame, 1000);
            alert("you win");
        }
        else {
            this.changeTurn(player, num, numOfPlayers, numOfTurns, cardOnTop, deck);
        }
    }

    static checkTopCard(cardOnTop) {
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
        return deck[CardIndex];
    }

    static checkStatusOnTableDeckClicked(player, deck, cardOnTop) {
        if (!gameOver) {
            let isPlayerTurn = this.checkPlayerTurn(player);
            if (isPlayerTurn) {
                var hasCardsToUse = this.checkPlayerCards(player,cardOnTop);
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

    static checkPlayerCards(player,cardOnTop) {
        let res = false;
        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i].value == cardOnTop.value || player.cards[i].color == cardOnTop.color || 
                player.cards[i].value == "change_colorful") {
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

    static rivalPlay(player, cardOnTop, deck, numOfPlayers, numOfTurns) {
        // console.log("rival cards are:");
        // for (let key in players[0]) {
        //     console.log(players[0][key]);
        // }
        if (!gameOver) {
            let goodCardFound = false;
    
            let changeColorCards = this.getCardsFromRivalArrbByValue(player, "change_colorful");
    
            if (changeColorCards.length > 0) //change color exists
            {
                this.playWithColorChangeCard(changeColorCards[0], cardOnTop);
            }
            else //change color doesn't exist
            {
                let stopCards = this.getCardsFromRivalArrbByValue(player,"stop");
                if (stopCards.length > 0) {
                    goodCardFound = this.findSpcialCardWithSameColor(stopCards, cardOnTop, numOfPlayers, numOfTurns, deck, player);
                }
                if (!goodCardFound) // stop with the same color wasn't found
                {
                    let takiCards = this.getCardsFromRivalArrbByValue(player,"taki");
    
                    if (takiCards.length > 0) {
                        goodCardFound = this.findSpcialCardWithSameColor(takiCards,cardOnTop, numOfPlayers, numOfTurns, deck, player);
                    }
                    if (!goodCardFound) // taki with the same color wasn't found
                    {
                        var plusCards = this.getCardsFromRivalArrbByValue(player,"plus");
                        if (plusCards.length > 0) {
                            goodCardFound = this.findSpcialCardWithSameColor(plusCards, cardOnTop, numOfPlayers, numOfTurns, deck, player);
                        }
                        if (!goodCardFound) {
                            let sameColorCards = this.getCardsFromRivalArrbByColor(player, cardOnTop.color);
                            if (sameColorCards.length > 0) //a number with the same color exists
                            {
                                this.removeAndSetTopCard(player,sameColorCards[0], deck, cardOnTop);
                                goodCardFound = true;
                                this.checkPlayerWin(player, 1, numOfPlayers,numOfTurns, cardOnTop, deck );
                            }
                            if (!goodCardFound) //a number with the same color doesn't exist
                            {
                                let sameValuecards = this.getCardsFromRivalArrbByValue(player, cardOnTop.value);
                                if (sameValuecards.length > 0) //the same number exists
                                {
                                    this.removeAndSetTopCard(player,sameValuecards[0], deck, cardOnTop);
                                    this.isSpecialCard(player, sameValuecards[0], numOfPlayers, numOfTurns,cardOnTop, deck);
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
    
    static findSpcialCardWithSameColor(cards, cardOnTop, numOfPlayers, numOfTurns, deck, player) {
        let goodCardFound = false;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].color === cardOnTop.color) {
                this.removeAndSetTopCard(cards[i], "rival-cards");
                if (cards[i].value === "stop") {
                    this.checkPlayerWin(player, 2, numOfPlayers, numOfTurns, cardOnTop, deck);
                }
                else if (cards[i].value === "plus") {
                    this.changeTurn(player, numOfPlayers, numOfPlayers, numOfTurns, cardOnTop, deck);
                }
                else if (cards[i].value === "taki") {
                    this.putAllCardsWithSameColorOfTaki(cardOnTop,player);
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

    static playWithColorChangeCard(card, cardOnTop) {
        this.removeAndSetTopCard(card, "rival-cards"); //send right parameters!
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
