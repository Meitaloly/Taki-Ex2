import React, { Component } from 'react';
import '../App.css';

class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { playSingleGame, playTournament } = this.props;
        let { toHide } = this.props;

        return (
            <div className="StartMenu" >
                <div className="logoContainer" hidden={toHide}>
                    <img className="takiLogo" src="./images/takiLogo.jpg"/>
                </div>
                <div className="startMenuButtons">
                    <button className="play" onClick={() => playSingleGame()}>
                        PLAY SINGLE GAME
                </button>
                    <button className="Tournament" onClick={() => playTournament()}>
                        PLAY TOURNAMENT
                </button>
                </div>
            </div>
        );
    }
}

export default StartMenu;