import React, { Component } from 'react';
// import GameLogic from '../Logic/GameLogic';
import CardComponent from './CardComponent';

class TableDeck extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { cardOnTop } = this.props;

        return (
            <div>
                <div> deck: </div>
                
                <CardComponent card={cardOnTop} isOpenCard = {false} />
                <CardComponent card={cardOnTop}  isOpenCard = {true} />
            </div>
        );
    }
}

export default TableDeck;