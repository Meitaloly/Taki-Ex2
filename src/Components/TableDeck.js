import React, { Component } from 'react';
// import GameLogic from '../Logic/GameLogic';
import CardComponent from './CardComponent';

class TableDeck extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { cardOnTop, checkStatusOnTableDeckClicked } = this.props;

        return (
            <div>
                <div> deck: </div>
                
                <CardComponent card={cardOnTop} isOpenCard = {false} isInDeck = {true} checkStatusOnTableDeckClicked ={checkStatusOnTableDeckClicked} />
                <CardComponent card={cardOnTop} isOpenCard = {true} isInDeck = {true} checkStatusOnTableDeckClicked = {checkStatusOnTableDeckClicked}/>
            </div>
        );
    }
}

export default TableDeck;