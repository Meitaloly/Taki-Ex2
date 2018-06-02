import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Statistics extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { numOfTurns, players, timer, avgTimeForTurn, avgTimeForTurnPerGame,numOfCardsInDeck } = this.props;
        return (
            <div className="Statistics">
                <div> Cards in deck: {numOfCardsInDeck} </div>
                <div>Number of turns: {numOfTurns}</div>
                <div>Time: {timer}</div>
                <div>The avg of your turns time is: {avgTimeForTurn}</div>
                <div>The avg of your turns time in all games is: {avgTimeForTurnPerGame}</div>
                <div>player {players[0].index} had one card {players[0].oneCardLeftCounter} times </div>
                <div>player {players[1].index} had one card {players[1].oneCardLeftCounter} times </div>
            </div>
        );
    }
}

export default Statistics;