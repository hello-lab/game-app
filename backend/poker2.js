const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const server1 = new WebSocket.Server({ port: 8081 });
let gameid = uuidv4();
let url="http://localhost:3000"
const deck_of_cards = [
    "ace_of_spades.png", "2_of_spades.png", "3_of_spades.png", "4_of_spades.png", "5_of_spades.png", "6_of_spades.png", "7_of_spades.png", "8_of_spades.png", "9_of_spades.png", "10_of_spades.png", "jack_of_spades2.png", "queen_of_spades2.png", "king_of_spades2.png",
    "ace_of_clubs.png", "2_of_clubs.png", "3_of_clubs.png", "4_of_clubs.png", "5_of_clubs.png", "6_of_clubs.png", "7_of_clubs.png", "8_of_clubs.png", "9_of_clubs.png", "10_of_clubs.png", "jack_of_clubs2.png", "queen_of_clubs2.png", "king_of_clubs2.png",
    "ace_of_diamonds.png", "2_of_diamonds.png", "3_of_diamonds.png", "4_of_diamonds.png", "5_of_diamonds.png", "6_of_diamonds.png", "7_of_diamonds.png", "8_of_diamonds.png", "9_of_diamonds.png", "10_of_diamonds.png", "jack_of_diamonds2.png", "queen_of_diamonds2.png", "king_of_diamonds2.png",
];

function getRandomCards(deck, num) {
    let shuffledDeck = deck.sort(() => Math.random() - 0.5);
    return shuffledDeck.slice(0, num);
}

function isFlush(cards) {
    const suits = cards.map(card => card.split('_')[2].split('.')[0]);
    return new Set(suits).size === 1;
}

function isStraight(cards) {
    const order = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    const values = cards.map(card => order.indexOf(card.split('_')[0])).sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] !== values[i] + 1) {
            return false;
        }
    }
    return true;
}

function isStraightFlush(cards) {
    return isFlush(cards) && isStraight(cards);
}

function countFaceCards(cards) {
    const faceCards = new Set(["jack", "queen", "king", "ace"]);
    return cards.filter(card => faceCards.has(card.split('_')[0])).length;
}

function decideWinner(hands) {
    const handRanks = hands.map(hand => {
        if (isStraightFlush(hand)) return 4;
        if (isFlush(hand)) return 3;
        if (isStraight(hand)) return 2;
        if (countFaceCards(hand) > 0) return 1;
        return 0;
    });
    
    const maxRank = Math.max(...handRanks);
    return handRanks.indexOf(maxRank);
}

function broadcast1(message) {
    server1.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

async function dealCards() {
    let chosen_cards = getRandomCards(deck_of_cards, 6);
    let size = 3;
    let chunked = chosen_cards.reduce((result, item, index) => {
        if (index % size === 0) {
            result.push([item]);
        } else {
            result[result.length - 1].push(item);
        }
        return result;
    }, []);
      
    const response = {
        type: 'deal',
        gameId: gameid,
        hands: chunked,
        isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
        isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
        isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
        faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
        winningHand: decideWinner(chunked)
    };

function dumdum(d){
    if (d[0])
        return "A"
    else if (d[1])
        return "B"
    else
        return "T"
}


    broadcast1(response);

    let bets =  await fetch('url/api/poker1/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({gameid:gameid}) })
    bets = await bets.json()
    console.log(bets)
    if (bets.length!=0) 
    for (const bet of bets) {
        console.log(bet)
        if (bet.type === 'W' && bet.bet === ['A',"B"][response.winningHand]) {
            await fetch('url/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
        else if (bet.type === 'S' && bet.bet === dumdum(response.isStraight)) {
            await fetch('url/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 4, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
        else if (bet.type === 'F' && bet.bet === dumdum(response.isFlush)) {
            await fetch('url/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 3, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
        else if (bet.type === 'SF' && bet.bet === dumdum(response.isStraightFlush)) {
            await fetch('url/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 8, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
    }


    console.log(response);
    console.log(gameid)
    setTimeout(() =>{ 
        gameid = uuidv4()
        broadcast1({ type: 'game_start', gameid })
}, 1000);
  

}

server1.on('connection', (ws) => {
    console.log('Client connected');
    broadcast1({ type: 'game_start', gameid });
});
gameid=uuidv4()
broadcast1({ type: 'game_start', gameid });
setInterval(dealCards, 15000); // Deal cards every 15 seconds

console.log('WebSocket server1 is running on ws://localhost:8081');
