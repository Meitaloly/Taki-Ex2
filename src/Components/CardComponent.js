import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class CardComponent extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { card, checkCard, playerIndex, isOpenCard, isInDeck, checkStatusOnTableDeckClicked } = this.props;

        return (
            <div>
                {/* <img src={card.imgSourceFront} onClick={() => checkCard(card, playerIndex)} /> */}
                {isOpenCard ? <img className="card" src={card.imgSourceFront} onClick={isInDeck ? null : () => checkCard(card, playerIndex)} />
                    : <img src={card.imgSourceBack} className="card" onClick={isInDeck ? () => checkStatusOnTableDeckClicked() : null} />}

            </div>
        );
    }
}

export default CardComponent;