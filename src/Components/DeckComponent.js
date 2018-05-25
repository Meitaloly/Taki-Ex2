import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GameLogic from '../Logic/GameLogic';
//import CardComponent from './CardComponent';

const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }

class DeckComponent extends Component {
    constructor(props) {
        super(props);
        this.setFunctionsInClass = this.setFunctionsInClass.bind(this);
        this.deck = this.createDeck();
        // this.gameLogic = new GameLogic();
        // this.deckLength = this.gameLogic.getDeckLength();
    }

    setFunctionsInClass() {
        this.createDeck = this.createDeck.bind(this);
    }
    
    render() {
        return (
            <div>
                length of deck is: {this.deck.length}
            </div>
        );
    }
}

export default DeckComponent;