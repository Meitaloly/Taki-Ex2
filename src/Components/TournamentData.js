import React, { Component } from 'react';

class TournamentData extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { players } = this.props;
        let { gameNum } = this.props;

        return (
            <div className="TournamentData">
                <div className="numberOfGame">
                    Game: {gameNum} / 3
                </div>
                <div className="PlayersScore">
                    <div className = "player1Score"> player 1's (Rival) score: {players[0].score}</div>
                    <div className = "player2Score"> player 2's score: {players[1].score}</div>
                </div>

            </div>
        );
    }
}

export default TournamentData;