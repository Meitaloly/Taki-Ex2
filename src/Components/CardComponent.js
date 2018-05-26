import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class CardComponent extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { card, checkCard, playerIndex ,isOpenCard } = this.props;

        return (
            <div>
                {/* <img src={card.imgSourceFront} onClick={() => checkCard(card, playerIndex)} /> */}
                {isOpenCard ? <img src={card.imgSourceFront} onClick={() => checkCard(card, playerIndex)} /> : <img src={card.imgSourceBack} />}
            </div>
        );
    }
}

export default CardComponent;