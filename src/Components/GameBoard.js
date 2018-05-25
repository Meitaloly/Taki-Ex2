import React, { Component } from 'react';
import GameLogic from '../Logic/GameLogic';
import PlayerComponent from './PlayerComponent';

const numberOfPlayer = 2;

const initialState = {
    deck: [],
    players: [],
    takenCardsCounter: 0,
}

class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;

        this.checkCard = this.checkCard.bind(this);
    }

    componentWillMount() {
        let { takenCardsCounter } = this.state;

        const deck = GameLogic.createDeck();
        const players = GameLogic.shareCardsToPlayers(numberOfPlayer, deck, takenCardsCounter);

        this.setState({
            deck,
            players,
            takenCardsCounter
        })

        console.log(this.state);
    }

    checkCard(card, playerIndex) {
        const {players} = this.state;
        //console.log(card, playerIndex);
        GameLogic.checkCard(players[playerIndex], card);

        this.setState({
            players
        })
    }
    // receiveCard = (card, player) => {
    //     let cards = this.state[player].push(card);
    //     this.setState({ [player]: cards });
    // };

    // render() {
    //     <PlayerCards cards={cards} />
    // }

    render() {
        const { players } = this.state;

        return (
            <div>
                {players.map(player => (
                    <PlayerComponent key={player.index} checkCard={this.checkCard} player={player} />
                ))}
            </div>
        );
    }
}

export default GameBoard;