import React, { Component } from 'react';
import GameLogic from '../Logic/GameLogic';
import PlayerComponent from './PlayerComponent';
import TableDeck from './TableDeck';
import Statistics from './Statistics';

const numberOfPlayer = 2;

const initialState = {
    deck: [],
    players: [],
    takenCardsCounter: 0,
    cardOnTop: null,
    turnIndex: numberOfPlayer,
    numOfTurns: 0,
    gameMove: [],
    changeColorWindowIsOpen: false,
    ImDoneIsHidden: true,
    timer: "",
    avgTimeForTurn: 0,
    avgTimeForTurnPerGame: "",
    transformArrow: 0
}


class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.checkCard = this.checkCard.bind(this);
        this.setNewStateCb = this.setNewStateCb.bind(this);
        this.checkStatusOnTableDeckClicked = this.checkStatusOnTableDeckClicked.bind(this);
        GameLogic.setCbFucntions(this.setNewStateCb, this.addTakenCardCounter);
        this.write = 0;
        //this.colorChangedInModal = this.colorChangedInModal.bind(this);
    }


    // colorChangedInModal(color) {
    //     const {deck} =this.state;

    //     GameLogic.setColorToTopCard(color,deck);
    //     this.setState({
    //         modalIsOpen: false 
    //     });
    // }

    componentDidMount() {
        const deck = GameLogic.createDeck();
        const players = GameLogic.shareCardsToPlayers(numberOfPlayer, deck);
        const cardOnTop = GameLogic.drawOpeningCard(deck);
        GameLogic.gameTimer();

        this.setState(() => {
            return {
                deck,
                players,
                cardOnTop
            };
        }), () => {
            this.saveGameMove();
        };
    }

    saveGameMove() {
        const currentState = this.state;
        delete currentState.gameMove;
        let gameMove = [];
        gameMove.push(currentState);

        this.setState(() => {
            return {
                gameMove
            };
        });
    }

    setNewStateCb(key, value) {
        this.setState(() => {
            return {
                [key]: value
            };
        });
    }

    checkCard(card, playerIndex) {
        console.log(this.state.turnIndex);
        const { players, deck } = this.state;
        let { numOfTurns } = this.state;
        //GameLogic.checkCard(players[playerIndex - 1], card, numberOfPlayer, deck);
        GameLogic.checkCard(playerIndex, card, numberOfPlayer, deck);

        this.setState(() => {
            return {
                deck,
                players,
            };
        });
    }


    checkStatusOnTableDeckClicked() {
        const { players, deck, cardOnTop } = this.state;
        GameLogic.checkStatusOnTableDeckClicked(players[numberOfPlayer - 1], deck, cardOnTop);
        this.setState(() => {
            return {
                deck,
            };
        }, () => {
            this.saveGameMove();
        });
    }

    render() {
        const { players, cardOnTop, deck } = this.state;
        let { numOfTurns, timer, avgTimeForTurn, avgTimeForTurnPerGame, transformArrow} = this.state;

        return (
            players.length > 0 && (<div className="boardContainer">
                {players.map(player => (
                    <PlayerComponent key={player.index} checkCard={this.checkCard} player={player} numberOfPlayer={numberOfPlayer} />
                ))}
                <TableDeck cardOnTop={cardOnTop} checkStatusOnTableDeckClicked={this.checkStatusOnTableDeckClicked} />
                <img className="arrowImage" style={{ transform: `rotate(${transformArrow}deg)` }} id="arrow" src="images/new_arrow.png" />
                <button className="ImDoneButton" hidden={this.state.ImDoneIsHidden} onClick={() => GameLogic.onImDoneButtonClicked(players[numberOfPlayer - 1], numberOfPlayer, deck)}>I'm done</button>
                <div className="colorWindow" hidden={!this.state.changeColorWindowIsOpen}>
                    <button className="blue" onClick={() => GameLogic.colorChangedInWindow("blue", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                    <button className="red" onClick={() => GameLogic.colorChangedInWindow("red", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                    <button className="yellow" onClick={() => GameLogic.colorChangedInWindow("yellow", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                    <button className="green" onClick={() => GameLogic.colorChangedInWindow("green", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                </div>
                <Statistics numOfTurns={numOfTurns} timer={timer} avgTimeForTurn={avgTimeForTurn} players={players} avgTimeForTurnPerGame={avgTimeForTurnPerGame} />
            </div>)
        );
    }
}

export default GameBoard;