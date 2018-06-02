import React, { Component } from 'react';
import CardComponent from './CardComponent';

class PlayerComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { player, checkCard } = this.props;
        let {cardMarginLeft} = this.props;

        return (
            <div className={`player${player.index}`} >
                <div>{player.name}</div>
                <div className="playerCardsContainer">
                    {player.cards.map(card => (
                        <CardComponent key={card.cardId} checkCard={checkCard} playerIndex={player.index} card={card} isOpenCard={player.showCards} isInDeck={false} cardMarginLeft={cardMarginLeft} />
                    ))}
                </div>
            </div>
        );
    }
}
export default PlayerComponent;
