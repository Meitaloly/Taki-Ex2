import React, { Component } from 'react';


class Statistics extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { numOfTurns, players, timer, avgTimeForTurn, avgTimeForTurnPerGame, numOfCardsInDeck } = this.props;
        return (
            <div className="Statistics">
                <div className="leftData">
                    <div>Time: {timer}</div>
                    <div>Cards in deck: {numOfCardsInDeck} </div>
                    <div>Number of turns: {numOfTurns}</div>
                </div>
                <div className="rightData">
                    <div>Avg of turns time: {avgTimeForTurn}</div>
                    <div>Avg of turns time in all games: {avgTimeForTurnPerGame}</div>
                    <div>Player {players[0].index} had one card {players[0].oneCardLeftCounter} times </div>
                    <div>Player {players[1].index} had one card {players[1].oneCardLeftCounter} times </div>
                </div>
            </div>
        );
    }
}

export default Statistics;