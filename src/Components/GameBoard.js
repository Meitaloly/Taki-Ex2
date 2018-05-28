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
    numOfTurns: 0,
    gameMove: []
}

class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.checkCard = this.checkCard.bind(this);
        this.setNewStateCb = this.setNewStateCb.bind(this);
        this.checkStatusOnTableDeckClicked = this.checkStatusOnTableDeckClicked.bind(this);
        GameLogic.setCbFucntions(this.setNewStateCb, this.addTakenCardCounter);
    }

    componentDidMount() {
        const deck = GameLogic.createDeck();
        const players = GameLogic.shareCardsToPlayers(numberOfPlayer, deck);
        const cardOnTop = GameLogic.drawOpeningCard(deck);

        this.setState({
            deck,
            players,
            cardOnTop
        }, () => {
            this.saveGameMove();
        })
    }

    saveGameMove() {
        const currentState = this.state;
        delete currentState.gameMove;
        let gameMove = [];
        gameMove.push(currentState);

        this.setState({
            gameMove
        })
    }

    setNewStateCb(key, value) {
        this.setState({
            [key]: value
        });
    }

    checkCard(card, playerIndex) {
        console.log(this.state.turnIndex);
        const { players, deck } = this.state;
        let { cardOnTop, numOfTurns } = this.state;
        GameLogic.checkCard(players[playerIndex - 1], card, numberOfPlayer, deck);
        
        console.log(cardOnTop);
        this.setState({
            deck,
            players,
            numOfTurns
        })
    }

    checkStatusOnTableDeckClicked(){
        const { players, deck, cardOnTop } = this.state;
        GameLogic.checkStatusOnTableDeckClicked(players[numberOfPlayer - 1],deck, cardOnTop);
        this.setState({
            deck,
        }, () => {
            this.saveGameMove();
        })
    }

    render() {
        const { players, cardOnTop } = this.state;

        return (
            players.length > 0 && (<div>
                {players.map(player => (
                    <PlayerComponent key={player.index} checkCard={this.checkCard} player={player} numberOfPlayer={numberOfPlayer} />
                ))}
                <TableDeck cardOnTop={cardOnTop} checkStatusOnTableDeckClicked = {this.checkStatusOnTableDeckClicked}/>
            </div>)
        );
    }
}

export default GameBoard;