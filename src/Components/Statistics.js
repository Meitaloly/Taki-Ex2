import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Statistics extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let {numOfTurns, players, timer, avgTimeForTurn,avgTimeForTurnPerGame} = this.props;
        return (
            <div className= "Statistics">
                <div>numOfturn: {numOfTurns}</div>
                <div>timer: {timer}</div>
                <div> avgTimeForTurn: {avgTimeForTurn}</div>
                <div> avgTimeForTurnPerGame: {avgTimeForTurnPerGame}</div>
                <div> player {players[0].index} reached to one card {players[0].oneCardLeftCounter} times </div>
                <div> player {players[1].index} reached to one card {players[1].oneCardLeftCounter} times </div>
            </div>
        );
    }
}

export default Statistics;