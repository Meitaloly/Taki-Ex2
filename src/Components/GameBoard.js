import React, { Component } from 'react';
import GameLogic from '../Logic/GameLogic';
import PlayerComponent from './PlayerComponent';
import TableDeck from './TableDeck';
import Statistics from './Statistics';
import StartMenu from './StartMenu';
import TournamentData from './TournamentData';

const numberOfPlayer = 2;

const initialState = {
    deck: [],
    players: [],
    takenCardsCounter: 0,
    cardOnTop: null,
    turnIndex: numberOfPlayer,
    numOfTurns: 0,
    changeColorWindowIsOpen: false,
    ImDoneIsHidden: true,
    timer: "",
    avgTimeForTurn: 0,
    transformArrow: 0,
    endGameControllerIsHidden: true,
    cardMarginLeft: [0, 0],
    avgTimeForTurnPerGame: "",
    is3Game: false,
    gameNum: 0,
    StartMenuButoonsClicked: false,
    tournamentIsDone: false,
    winnerIndex: null
}


class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.checkCard = this.checkCard.bind(this);
        this.setNewStateCb = this.setNewStateCb.bind(this);
        this.previousMove = this.previousMove.bind(this);
        this.nextMove = this.nextMove.bind(this);
        this.newGame = this.newGame.bind(this);
        this.playSingleGame = this.playSingleGame.bind(this);
        this.playTournament = this.playTournament.bind(this);
        this.checkStatusOnTableDeckClicked = this.checkStatusOnTableDeckClicked.bind(this);
        GameLogic.setCbFucntions(this.setNewStateCb, this.addTakenCardCounter);
        this.write = 0;

    }

    playSingleGame() {
        this.newGame();
        this.setNewStateCb("StartMenuButoonsClicked", true, false);
        this.setNewStateCb("is3Game", false, false);
        this.setNewStateCb("tournamentIsDone", false, false);
    }

    playTournament() {
        this.newGame();
        this.setNewStateCb("StartMenuButoonsClicked", true, false);
        this.setNewStateCb("is3Game", true, false);
        GameLogic.setTournament();
        this.setNewStateCb("gameNum", 1, false);
        this.setNewStateCb("tournamentIsDone", false, false);

    }

    saveGameMove(toUpdateMove) {
        toUpdateMove && GameLogic.addMove(this.state);
    }

    previousMove() {
        const currentState = GameLogic.getPrev();
        this.setState(currentState);
    }

    nextMove() {
        const currentState = GameLogic.getNext();
        this.setState(currentState);
    }

    newGame() {
        GameLogic.newGame();
        this.setState(initialState);
        GameLogic.setAvgPerGame();
        const deck = GameLogic.createDeck();
        const players = GameLogic.shareCardsToPlayers(numberOfPlayer, deck);
        const cardOnTop = GameLogic.drawOpeningCard(deck);
        GameLogic.gameTimer();
        GameLogic.resizeCards();


        this.setState(() => {
            return {
                deck,
                players,
                cardOnTop
            };
        });
    }

    setNewStateCb(key, value, toUpdateMove = true) {
        this.setState(() => {
            return {
                [key]: value
            };
        }, this.saveGameMove(toUpdateMove));
    }

    checkCard(card, playerIndex) {
        console.log(this.state.turnIndex);
        const { players, deck } = this.state;
        GameLogic.checkCard(playerIndex, card, numberOfPlayer, deck);

        this.setState(() => {
            return {
                deck,
                players
            };
        });
    }


    checkStatusOnTableDeckClicked() {
        const { players, deck, cardOnTop } = this.state;
        GameLogic.checkStatusOnTableDeckClicked(players[numberOfPlayer - 1], deck, cardOnTop);
        this.setState(() => {
            return {
                deck
            };
        });
    }

    render() {
        const { playSingleGame, playTournament, players, cardOnTop, deck } = this.state;
        let { winnerIndex, tournamentIsDone, StartMenuButoonsClicked, gameNum, is3Game, numOfTurns, timer, avgTimeForTurn, avgTimeForTurnPerGame, transformArrow, endGameControllerIsHidden, cardMarginLeft, takenCardsCounter } = this.state;

        return (
            //players.length > 0 && (
            <div className="boardContainer">
                <div hidden={this.state.StartMenuButoonsClicked}>
                    <StartMenu playSingleGame={this.playSingleGame} playTournament={this.playTournament} />
                </div>
                {players.length > 0 ?
                    <div>
                        {is3Game ? <TournamentData gameNum={gameNum} players={players} /> : null}
                        <PlayerComponent checkCard={this.checkCard} player={players[0]} numberOfPlayer={numberOfPlayer} cardMarginLeft={cardMarginLeft[0]} />
                        <div className="middleDiv">
                            <div className="tableInfo">
                                <div>
                                    <img className="arrowImage" alt="arrow" style={{ transform: `rotate(${transformArrow}deg)` }} id="arrow" src="images/new_arrow.png" />
                                </div>
                                <TableDeck cardOnTop={cardOnTop} checkStatusOnTableDeckClicked={this.checkStatusOnTableDeckClicked} />
                                <button className="ImDoneButton" hidden={this.state.ImDoneIsHidden} onClick={() => GameLogic.onImDoneButtonClicked(players[numberOfPlayer - 1], numberOfPlayer, deck)}>I'm done</button>
                                <Statistics numOfTurns={numOfTurns} timer={timer} avgTimeForTurn={avgTimeForTurn} players={players} avgTimeForTurnPerGame={avgTimeForTurnPerGame} numOfCardsInDeck={deck.length - takenCardsCounter} />
                            </div>
                        </div>
                        <PlayerComponent checkCard={this.checkCard} player={players[1]} numberOfPlayer={numberOfPlayer} cardMarginLeft={cardMarginLeft[1]} />

                        <div className="colorWindowContainer" hidden={!this.state.changeColorWindowIsOpen}>
                            <div className="colorWindow">
                                <button className="blue" onClick={() => GameLogic.colorChangedInWindow("blue", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                                <button className="red" onClick={() => GameLogic.colorChangedInWindow("red", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                                <button className="yellow" onClick={() => GameLogic.colorChangedInWindow("yellow", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                                <button className="green" onClick={() => GameLogic.colorChangedInWindow("green", deck, players[numberOfPlayer - 1], numberOfPlayer)}></button>
                            </div>
                        </div>

                        <div className="tournamentWinner" hidden={!tournamentIsDone}>
                            <div className="data">
                                <div className="Winner">The Winner Is: player {winnerIndex + 1}</div>
                                <TournamentData gameNum={gameNum} players={players} />
                                <Statistics numOfTurns={numOfTurns} timer={timer} avgTimeForTurn={avgTimeForTurn} players={players} avgTimeForTurnPerGame={avgTimeForTurnPerGame} numOfCardsInDeck={deck.length - takenCardsCounter} />
                                <StartMenu playSingleGame={this.playSingleGame} playTournament={this.playTournament} />
                            </div>
                        </div>

                        <div className="endGameController" hidden={(endGameControllerIsHidden && !GameLogic.isGameOver()) || is3Game}>
                            <div className="replay btn-group">
                                <button className="button" onClick={this.previousMove}>◄Previous</button>
                                <button className="button" onClick={() => { players.length = 0; this.setNewStateCb("StartMenuButoonsClicked", false) }}>Back To Menu</button>
                                <button className="button" onClick={this.nextMove}>Next►</button>
                            </div>
                        </div>
                    </div> : null}
            </div>//)
        );
    }
}

export default GameBoard;