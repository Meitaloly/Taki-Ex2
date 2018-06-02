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
            <div className="tableDeck">
                <div className="tableDeckCardsContainer">
                    <CardComponent className="card" card={cardOnTop} isOpenCard={false} isInDeck={true} checkStatusOnTableDeckClicked={checkStatusOnTableDeckClicked} />
                    <CardComponent className="card" card={cardOnTop} isOpenCard={true} isInDeck={true} checkStatusOnTableDeckClicked={checkStatusOnTableDeckClicked} />
                </div>
            </div>
        );
    }
}

export default TableDeck;