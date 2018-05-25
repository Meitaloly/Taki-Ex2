const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }
const numOfColors = 4;
const numOfCardsForEachPlayer = 8;


class GameLogic {




    static createCard(color, value, counterId, specialCard) {
        return {
            color: color,
            value: value,
            taken: false,
            played: false,
            specialCard: specialCard,
            cardId: counterId,
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
                index: playerIndex,
                name: `Player ${playerIndex + 1}`,
                cards: [],
                score: 0
            });

            if (playerIndex !== numOfPlayers - 1) {
                players[playerIndex].name += ' (Rival)';
            }

            players[playerIndex].cards = this.shareCards(deck, takenCardsCounter);
        }
        return players;
    }

    static shareCards(deck, takenCardsCounter) {
        const cards = [];
        for (let i = 0; i < numOfCardsForEachPlayer; i++) {
            this.addCardToPlayersArr(cards, deck, takenCardsCounter);
        }
        return cards;
    }

    static addCardToPlayersArr(arrToAddTheCard, deck, takenCardsCounter) {
        console.log(arrToAddTheCard);
        let index;
        do {
            index = Math.floor(Math.random() * deck.length);
        } while (deck[index].taken === true);
        deck[index].taken = true;
        takenCardsCounter++;
        arrToAddTheCard.push(deck[index]);
    }

    static checkCard(player, card) {
        //console.log('checkCard');
        const cardIndex = player.cards.findIndex((cardre)=> cardre.cardId === card.cardId);
        player.cards.splice(cardIndex, 1);
    }


}
export default GameLogic;
