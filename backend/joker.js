const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const server = new WebSocket.Server({ port: 8083 });
let gameId = uuidv4();
const deck_of_cards = [
    "ace_of_spades.png", "2_of_spades.png", "3_of_spades.png", "4_of_spades.png", "5_of_spades.png", "6_of_spades.png", "7_of_spades.png", "8_of_spades.png", "9_of_spades.png", "10_of_spades.png", "jack_of_spades.png", "queen_of_spades.png", "king_of_spades.png",
    "ace_of_clubs.png", "2_of_clubs.png", "3_of_clubs.png", "4_of_clubs.png", "5_of_clubs.png", "6_of_clubs.png", "7_of_clubs.png", "8_of_clubs.png", "9_of_clubs.png", "10_of_clubs.png", "jack_of_clubs.png", "queen_of_clubs.png", "king_of_clubs.png",
    "ace_of_diamonds.png", "2_of_diamonds.png", "3_of_diamonds.png", "4_of_diamonds.png", "5_of_diamonds.png", "6_of_diamonds.png", "7_of_diamonds.png", "8_of_diamonds.png", "9_of_diamonds.png", "10_of_diamonds.png", "jack_of_diamonds.png", "queen_of_diamonds.png", "king_of_diamonds.png",
    "ace_of_hearts.png", "2_of_hearts.png", "3_of_hearts.png", "4_of_hearts.png", "5_of_hearts.png", "6_of_hearts.png", "7_of_hearts.png", "8_of_hearts.png", "9_of_hearts.png", "10_of_hearts.png", "jack_of_hearts.png", "queen_of_hearts.png", "king_of_hearts.png"
];

function getRandomCards(deck, num) {
    let shuffledDeck = deck.sort(() => Math.random() - 0.5);
    return shuffledDeck.slice(0, num);
}

function getJokerCard(deck) {
    let shuffledDeck = deck.sort(() => Math.random() - 0.5);
    return shuffledDeck[0].split('_')[0]; // Get the rank of the joker card
}


const sik=['spades','diamonds','hearts','clubs']
const order = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];


function val(cards){
    const values = cards.map(card => order.indexOf(card.split('_')[0]));
    values.sort((a, b) => a - b);  
    return values
}


function isFlush(cards) {
    const suits = cards.map(card => card.split('_')[2].split('.')[0]);
    return new Set(suits).size === 1;
}

function isStraight(cards) {
    const order = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    const values = cards.map(card => order.indexOf(card.split('_')[0]));
    values.sort((a, b) => a - b);  
    console.log(values)
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


function isTwoOfAKind(cards) {
    const values = cards.map(card => 13-order.indexOf(card.split('_')[0]));
    values.sort((a, b) => a - b);  
    
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] == values[i]) {
            return true;
        }
    }
    return false;
}

function isThreeOfAKind(cards) {
    const values = cards.map(card => 13-order.indexOf(card.split('_')[0]));
     
    
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] !== values[i] ) {
            return false;
        }
    }
    return true;
}




function replaceJoker(cards, joker) {

    let nc=[]
    for (let i=0;i<cards.length;i++){
if(cards[i].split('_')[0]!=joker)
    nc.push(cards[i])
   
    }
    if (nc)
    if(isThreeOfAKind(nc)){
                let values = nc.map(card => (card.split('_')[2].split('.')[0]));
                console.log(values)
                nc.push(`${nc[0].split('_')[0]}_of_${findDisjointElements(values,sik)[order.length-values.length-1]}.png`)

    }
    else if (isStraightFlush(nc)){
       
        const values = nc.map(card => order.indexOf(card.split('_')[0]));
        values.sort((a, b) => a - b);
        
        let k=(values[values.length - 1] + 1)
        console.log(k)
        let nextValue=order[k % order.length];
        if (k==13)
             nextValue=order[10]
       
        const suit = nc[0].split('_')[2];
        nc.push(`${nextValue}_of_${suit}`);
    }
    else if (isStraight(nc)){
        for(let j =0;nc.length;j++){
            if(nc[j].split('_')[2]!=sik[j]){

                const values = nc.map(card => order.indexOf(card.split('_')[0]));
        values.sort((a, b) => a - b);
        
        let k=(values[values.length - 1] + 1)
        console.log(k)
        let nextValue=order[k % order.length];
        if (k==13)
             nextValue=order[10]
       
        
                nc.push(`${nextValue}_of_${sik[j]}.png`)
            break}
        }
    }
    else if (isFlush(nc)){
        console.log(val(nc),val(nc)[1])
        if(val(nc)[0]==val(nc)[1]-2)
        {
            const values = nc.map(card => order.indexOf(card.split('_')[0]));
        values.sort((a, b) => a - b);
        
        let k=(values[values.length - 1] + 1)
        console.log(k,'k')
        let nextValue=order[k % order.length];
        if (k==13)
             nextValue=order[10]
       
        const suit = nc[0].split('_')[2];
        nc.push(`${nextValue}_of_${suit}`);
        
        }
        else{
        let values = nc.map(card => (card.split('_')[0]));
                console.log(values,'ff')
                nc.push(`${findDisjointElements(values,order)[order.length-values.length-1]}_of_${nc[0].split('_')[2]}`)
}

    }
    else{
        let values = nc.map(card => (card.split('_')[0]));
        values.sort((a, b) => b - a);
        const highestCard = order[values[0]];

        const suit = nc[0].split('_')[2];
        nc.push(`${findDisjointElements(values,order)[order.length-values.length-1]}_of_${suit}`);

    }
    else
    nc=cards.map(card => (card));
    console.log(nc)
    return(nc) 
}

function findDisjointElements(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const disjointElements = [
        ...arr1.filter(item => !set2.has(item)),
        ...arr2.filter(item => !set1.has(item))
    ];

    return disjointElements;
}



replaceJoker(
    [ 'king_of_spades.png', 'jack_of_spades.png', '6_of_hearts.png' ]
  ,'6')

function tiebreaker(hands){
let tie=hands.map((hand => {
    const order = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    const values = hand.map(card => order.indexOf(card.split('_')[0]));
    
    console.log(values)
    return (Math.max(...values))
}))

console.log(tie)
return tie.indexOf(Math.max(...tie))
}

function decideWinner(hands,joker) {
     hands=[replaceJoker(hands[0],joker),replaceJoker(hands[1],joker)]
    const handRanks = hands.map(hand => {
        if (isThreeOfAKind(hand)) return 5;
        else if (isStraightFlush(hand)) return 4;
        else if (isFlush(hand)) return 2;
        else if (isStraight(hand)) return 3;
        else if(isTwoOfAKind(hand)) return 1
        
        return 0;
    });
    console.log('handranks',handRanks)
    if (new Set(handRanks).size==1){
        if(handRanks[0]==0||handRanks[0]==5||handRanks[0]==2||handRanks[0]==1)
        return tiebreaker(hands)
        

    }
    else{const maxRank = Math.max(...handRanks);
    
    return handRanks.indexOf(maxRank);}
}





function broadcast3(message) {
    server.clients.forEach(client => {
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

    const joker = getJokerCard(deck_of_cards);

    const response = {
        type: 'deal',
        gameId: gameId,
        hands: chunked,
        joker: joker,
        winningHand: decideWinner(chunked, joker)
    };
    
    broadcast3(response);

    console.log(response);
    console.log(gameId);
    setTimeout(() => {
        gameId = uuidv4();
        broadcast3({ type: 'game_start', gameId });
    }, 1000);
}

server.on('connection', (ws) => {
    console.log('Client connected');
    broadcast3({ type: 'game_start', gameId });
});

setInterval(dealCards,1000) // Deal cards every 15 seconds

console.log('WebSocket server is running on ws://localhost:8083');
