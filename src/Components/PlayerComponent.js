import React, { Component } from 'react';
import CardComponent from './CardComponent';

class PlayerComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { player, checkCard } = this.props;

        return (
            <div>
                {player.name}
                {player.cards.map(card => (
                    <CardComponent key={card.cardId} checkCard={checkCard} playerIndex={player.index} card={card} />
                ))}
            </div>
        );
    }
}
export default PlayerComponent;
// class Board extends React.Component {
//     constructor() {
//         this.state = {
//             player1: [{}],
//             player2: [{}]
//         }
//     }

//     receiveCard = (card, player) => {
//         let cards = this.state[player].push(card);
//         this.setState({ [player]: cards });
//     };

//     render() {
//         <PlayerCards cards={cards} />
//     }
// }