const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }
const numOfColors = 4;
const numOfCardsForEachPlayer = 8;
let setStateInBoard;


class GameLogic {

    static setCbFucntions(cbFunction)
    {
        setStateInBoard = cbFunction;
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

    static shareCardsToPlayers(numOfPlayers, deck, takenCardsCounter) {
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
            players[playerIndex].cards = this.shareCards(deck, takenCardsCounter);
        }
        return players;
    }

    static shareCards(deck, takenCardsCounter) {
        const cards = [];
        for (let i = 0; i < numOfCardsForEachPlayer; i++) {
            this.addCardToPlayersArr(cards, deck, takenCardsCounter);
            takenCardsCounter++;
        }
        return cards;
    }

    static addCardToPlayersArr(arrToAddTheCard, deck, takenCardsCounter) {
        console.log(arrToAddTheCard);
        let cardIndex;
        do {
            cardIndex = Math.floor(Math.random() * deck.length);
        } while (deck[cardIndex].taken === true);
        deck[cardIndex].taken = true;
        setStateInBoard('takenCardsCounter', takenCardsCounter+1);
        //takenCardsCounter++;
        arrToAddTheCard.push(deck[cardIndex]);
    }

    static checkCard(player, card, cardOntop, numOfPlayers, turnIndex, deck, numOfTurns) {
        let turnsData;
        if (player.index === turnIndex) {
            // // if (openTaki) {
            //     if (turnIndex === player.index) {
            //         if (card.color === cardOntop.color) {
            //             removeAndSetTopCard(card, elemntClassName);
            //         }
            //         else
            //         {
            //             wrongSound.play();
            //         }
            //     }
            // // }
            // else {
            if (card.color === cardOntop.color || card.value === cardOntop.value || card.value === "change_colorful") {
                this.removeAndSetTopCard(player, card, deck, cardOntop);
                turnsData = this.isSpecialCard(player, card, numOfPlayers, turnIndex, numOfTurns);
            }
            else {
                alert("Wrong!");
                //wrongSound.play();
                return cardOntop;
            }
        }
        return turnsData;
    }

    static removeAndSetTopCard(player, card, deck, cardOnTop) {
        this.removeCardFromPlayersArr(player, card, deck);
        this.setNewCardOnTop(card, cardOnTop, deck);
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

    static setNewCardOnTop(cardToPutOnTop, cardOnTop, deck) {
        deck[cardOnTop.cardId].played = true;
        cardOnTop = Object.assign(cardOnTop, cardToPutOnTop);
    }

    static isSpecialCard(player, card, numOfPlayers, turnIndex, numOfTurns) {
        if (card.value === "change_colorful" /*&& turnIndex === player.index*/) {
            alert("change Color");
            //showChooseAColorWindow();
            this.changeTurn(player, 1, turnIndex, numOfPlayers, numOfTurns);
        }
        else if (card.value === "stop") {
            if (player.cards.length === 0) {
                alert("stop the game");
                //stopTheGame();
            }
            else {
                this.changeTurn(player, 2, turnIndex, numOfPlayers, numOfTurns);
            }
        }
        else if (card.value === "taki") {
            if (turnIndex !== numOfPlayers) {
                // putAllCardsWithSameColorOfTaki();
                // checkPlayerWin(checkTopCard());
            }
            else {
                alert("not in taki mode");
                // //if (!openTaki) {
                //     createTakiButton();
                //     openTaki = true;
                // //}
            }
        }
        else if (card.value === "plus") {
             this.changeTurn(player, numOfPlayers, turnIndex, numOfPlayers, numOfTurns);
        }
        else {
            this.checkPlayerWin(player, 1, turnIndex, numOfPlayers, numOfTurns);
        }
    }

    static changeTurn(player, number, turnIndex, numOfPlayers, numOfTurns) {
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
        if (number === numOfPlayers) {
            numOfTurns++;
        }
        else {
            numOfTurns =+ number;
        }
        //startTime = timer.getTime();
        if (turnIndex !== player) {
            //  setTimeout(rivalPlay, 2000);
        }
        //   }
    }

    static checkPlayerWin(player, num, turnIndex, numOfPlayers, numOfTurns) {
        if (player.cards.length === 0) {
            //setTimeout(stopTheGame, 1000);
        }
        else {
            this.changeTurn(player, num, turnIndex, numOfPlayers, numOfTurns);
        }        
    }

    static drawOpeningCard(deck, takenCardsCounter) {
        let CardIndex;
        do {
            CardIndex = Math.floor(Math.random() * deck.length);
        } while (deck[CardIndex].taken || deck[CardIndex].specialCard);
        deck[CardIndex].taken = true;
        takenCardsCounter++;
        return deck[CardIndex];
    }
}
export default GameLogic;
