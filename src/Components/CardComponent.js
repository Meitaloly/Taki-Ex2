import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class CardComponent extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { card, checkCard, playerIndex, isOpenCard, isInDeck, checkStatusOnTableDeckClicked } = this.props;

        return (
            <div className = "card">
                {/* <img src={card.imgSourceFront} onClick={() => checkCard(card, playerIndex)} /> */}
                {isOpenCard ? <img src={card.imgSourceFront} onClick={isInDeck ? null : () => checkCard(card, playerIndex)} />
                    : <img src={card.imgSourceBack} onClick={isInDeck ? () => checkStatusOnTableDeckClicked() : null} />}

            </div>
        );
    }
}

export default CardComponent;