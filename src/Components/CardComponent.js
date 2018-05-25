import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class CardComponent extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { card, checkCard, playerIndex } = this.props;

        return (
            <div>
                <img src={card.imgSourceFront} onClick={() => checkCard(card, playerIndex)} />
                {/* {isValid ? <img src={card.imgSourceFront} /> : <div>} */}
            </div>
        );
    }
}

export default CardComponent;