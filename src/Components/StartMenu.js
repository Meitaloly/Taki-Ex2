import React, { Component } from 'react';

class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {playSingleGame, playTournament} = this.props;

        return (
            <div className="StartMenu">
                <button className ="play" onClick = {()=>playSingleGame()} />   
                <button className ="Tournament" onClick = {()=>playTournament()} />
            </div>
        );
    }
}

export default StartMenu;