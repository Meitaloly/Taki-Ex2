import React, { Component } from 'react';
import GameLogic from '../Logic/GameLogic';
import PlayerComponent from './PlayerComponent';
import TableDeck from './TableDeck';

const numberOfPlayer = 2;

const initialState = {
    deck: [],
    players: [],
    takenCardsCounter: 0,
    cardOnTop: null,
    turnIndex: numberOfPlayer,
    numOfTurns: 0
}

class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.checkCard = this.checkCard.bind(this);
        this.setNewStateCb = this.setNewStateCb.bind(this);
    }

    componentWillMount() {
        let { takenCardsCounter, turnIndex } = this.state;
        GameLogic.setCbFucntions(this.setNewStateCb);
        const deck = GameLogic.createDeck();
        const players = GameLogic.shareCardsToPlayers(numberOfPlayer, deck, takenCardsCounter);
        const cardOnTop = GameLogic.drawOpeningCard(deck, takenCardsCounter);

        console.log(takenCardsCounter);
        this.setState({
            deck,
            players,
            //takenCardsCounter,
            cardOnTop,
            turnIndex,
        })
    }

    setNewStateCb(key,value){
        this.setState({
            key:value
        });
    }

    checkCard(card, playerIndex) {
        const { players, deck } = this.state;
        let { cardOnTop, turnIndex, numOfTurns } = this.state;
        GameLogic.checkCard(players[playerIndex - 1], card, cardOnTop, numberOfPlayer, turnIndex, deck, numOfTurns);

        console.log(cardOnTop);
        this.setState({
            deck,
            players,
            cardOnTop,
            turnIndex,
            numOfTurns
        })
    }

    render() {
        const { players, cardOnTop } = this.state;

        return (
            <div>
                {players.map(player => (
                    <PlayerComponent key={player.index} checkCard={this.checkCard} player={player} numberOfPlayer={numberOfPlayer} />
                ))}
                <TableDeck cardOnTop={cardOnTop} />
            </div>
        );
    }
}

export default GameBoard;