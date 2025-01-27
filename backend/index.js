const WebSocket = require('ws');
const db = require('./../gambling/src/app/db/db1');
const transactdb = require('./../gambling/src/app/db/crashBetsDb2');

let clients = [];
let multiplier = 1;
let gameId = 0;
let url="http://localhost:3000"
let port1=8080
let port2=8081
let port3=8082
const server = new WebSocket.Server({ port: port1 });

// Create table for crash game bets
transactdb.crashBetsDb.exec(`
    CREATE TABLE IF NOT EXISTS crashBets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        gameId TEXT,
        betAmount REAL,
        multiplier REAL,
        cashedOut INTEGER DEFAULT 0
    )
`);

function getResult(e = 2 ** 52, div = 33, g = 0.5) {
    /**
     * Returns a valid multiplier based on 3 inputed parameters
     * @param {number} e - Extreme Value. Defaults to 2 ** 52.
     * @param {number} div - Initial Crash Rate. Defaults to 33.
     * @param {number} g - Growth Rate. Defaults to 1.
     * @returns {number} A multiplier value based on the crash equation
     */
    e = Math.floor(e);
    const h = Math.floor(Math.random() * e);
    g = checkg(g);
    div = checkdiv(div);
    if (h % div === 0) {
        return 1;
    }
    return 0.99 * (Math.pow(e / (e - h), 1 / g)) + 0.01;
}

// Error checking growth value (Helper Function)
function checkg(g) {
    g = Math.round(g * 10) / 10;
    if (g === 0) {
        return 1;
    }
    return g;
}

// Error checking multiplier value (Helper Function)
function checkm(m) {
    if (m < 1) {
        return 1;
    }
    return Math.round(m * 100) / 100;
}

// Error checking initial fail-rate value (Helper Function)
function checkdiv(div) {
    if (div < 1) {
        return 33;
    }
    return Math.round(div * 100) / 100;
}

function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
function startGame() {
    // Server-side simulation for crash game with house edge
    function increase(crashPoint, intervalId) {
        if (multiplier < crashPoint) {
            multiplier += 0.02 * multiplier;
            multiplier = Math.floor(multiplier * 100) / 100; // Truncate to two decimal places
            console.log(multiplier);
            broadcast({ type: 'game_tick', multiplier });
        } else {
            broadcast({ type: 'crash', multiplier });
            console.log('Game ended', gameId);
            gameId = Math.random().toString(36).substr(2, 9); // Generate a random game ID
            broadcast({ type: 'game_start', gameId });
            clearInterval(intervalId);
            setTimeout(() => startGame(), 10000);
        }
    }

    function startCrashGame() {
        console.log('Game started');
       
        const crashPoint = getResult().toFixed(2);
        multiplier = 1;
        
        const intervalId = setInterval(() => increase(crashPoint, intervalId), 200);
    }


    startCrashGame(); // Example of a player betting $100
}


server.on('connection', (ws) => {
    clients.push(ws);

    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        console.log(data);
        if (data.type === 'cashout') {
            // Handle bet logic
            console.log('cashout at ', multiplier);
            console.log(data.token,data.gameId)
            const res1 = await fetch('http://localhost:3000/api/auth/bets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token:data.token,gameid:data.gameId })
            });
            console.log(res1);
            const data1 = await res1.json();

            bet=data1.bet;
            console.log(bet)
            const res2 = await fetch('http://localhost:3000/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: data.userId, amount: bet*multiplier, type: 'deposit',remarks:'Crash Winnings' })

            });
            await res2.json().then((data) => {broadcast({ type: 'balance', balance:data.balance });})
            
            // Select all players from crashBetsDb2 who have the same game ID
            const players = await transactdb.crashBetsDb.prepare('SELECT * FROM crashBets WHERE gameId = ?').all(data.gameId);
            players.forEach(async (player) => {
                const winnings = player.betAmount * multiplier;
                await db.updateOne({ userId: player.userId }, { $inc: { balance: winnings } });
                console.log(`Updated balance for user ${player.userId} with winnings: ${winnings}`);
            });
        }
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

startGame();

console.log('WebSocket server is running on ws://localhost:8080');

const { v4: uuidv4 } = require('uuid');

const server1 = new WebSocket.Server({ port: port2 });
let gameid = uuidv4();

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

    let bets =  await fetch(`${url}/api/poker1/bets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({gameid:gameid}) })
    bets = await bets.json()
    console.log(bets)
    if (bets.length!=0) 
    for (const bet of bets) {
        console.log(bet)
        if (bet.type === 'W' && bet.bet === ['A',"B"][response.winningHand]) {
            await fetch(`${url}/api/poker1/bets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
        else if (bet.type === 'S' && bet.bet === dumdum(response.isStraight)) {
            await fetch(`${url}/api/poker1/bets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 4, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
        else if (bet.type === 'F' && bet.bet === dumdum(response.isFlush)) {
            await fetch(`${url}/api/poker1/bets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 3, type: 'deposit', remarks: 'Poker Winnings' })
            });
        }
        else if (bet.type === 'SF' && bet.bet === dumdum(response.isStraightFlush)) {
            await fetch(`${url}/api/poker1/bets`, {
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


const server2 = new WebSocket.Server({ port: port3 });
let gameid2 = uuidv4();



function getnumber() {
   return Math.floor(Math.random() * 37) ;
}

function broadcast2(message) {
    server2.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

async function dealCards2() {
    let number = getnumber()
      
    const response = {
        type: 'deal',
        gameId: gameid2,
       number:number
    };


    broadcast2(response);
try{
    let bets =  await fetch(url,'/api/roulette/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({gameid:gameid2}) })
    bets = await bets.json()
    console.log(bets)
    if (bets.length!=0) 
    for (const bet of bets) {
        console.log(bet)
     try {
        switch (bet.type) {
            case 'A':
                if (bet.bet === 0) {
                   
                }
                else if (bet.bet === "EVEN" && number % 2 === 0) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                else if (bet.bet === "ODD" && number % 2 === 1) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;


            case 'B':
                if ((bet.bet === 'RED' && [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number)) ||
                    (bet.bet === 'BLACK' && [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].includes(number))) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;
                

                case 'C':
                if (bet.bet =='1-18' && number >= 1 && number <= 18) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                else if(bet.bet=='19-36' && number >= 19 && number <= 36){
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;
            case 'D':
                if ((bet.bet=='Column 1' && [1,4,7,10,13,16,19,22,25,28,31,34].includes(number))||(bet.bet=='Column 2' && [2,5,8,11,14,17,20,23,26,29,32,35].includes(number))||(bet.bet=='Column 3' && [3,6,9,12,15,18,21,24,27,30,33,36].includes(number)) ) {

                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 3, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                } 
                break
            case 'E':
                if ((bet.bet=="1st Dozen" && number >= 1 && number <= 12) || (bet.bet=="2nd Dozen" && number >= 13 && number <= 24) || (bet.bet=="3rd Dozen" && number >= 25 && number <= 36)) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 3, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break
            case 'F':
                if ((bet.bet=='1-6' && number >= 1 && number <= 6)||(bet.bet=='7-12' && number >= 7 && number <= 12)||(bet.bet=='13-18' && number >= 13 && number <= 18)||(bet.bet=='19-24' && number >= 19 && number <= 24)||(bet.bet=='25-30' && number >= 25 && number <= 30)||(bet.bet=='31-36' && number >= 31 && number <= 36)) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 6, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break
            case 'G':
                if((bet.bet=='0,1,2,3'&& number >= 0 && number <= 3)||(bet.bet=='1,2,3,4'&& number >= 1 && number <= 4)||(bet.bet=='2,3,4,5' && number >= 2 && number <= 5)||(bet.bet=='3,4,5,6' && number >= 3 && number <= 6)||(bet.bet=='4,5,6,7' && number >= 4 && number <= 7)||(bet.bet=='5,6,7,8' && number >= 5 && number <= 8)||(bet.bet=='6,7,8,9' && number >= 6 && number <= 9)||(bet.bet=='7,8,9,10' && number >= 7 && number <= 10)||(bet.bet=='8,9,10,11' && number >= 8 && number <= 11)||(bet.bet=='9,10,11,12' && number >= 9 && number <= 12)||(bet.bet=='10,11,12,13' && number >= 10 && number <= 13)||(bet.bet=='11,12,13,14' && number >= 11 && number <= 14)||(bet.bet=='12,13,14,15' && number >= 12 && number <= 15)||(bet.bet=='13,14,15,16' && number >= 13 && number <= 16)||(bet.bet=='14,15,16,17' && number >= 14 && number <= 17)||(bet.bet=='15,16,17,18' && number >= 15 && number <= 18)||(bet.bet=='16,17,18,19' && number >= 16 && number <= 19)||(bet.bet=='17,18,19,20' && number >= 17 && number <= 20)||(bet.bet=='18,19,20,21' && number >= 18 && number <= 21)||(bet.bet=='19,20,21,22' && number >= 19 && number <= 22)||(bet.bet=='20,21,22,23' && number >= 20 && number <= 23)||(bet.bet=='21,22,23,24' && number >= 21 && number <= 24)||(bet.bet=='22,23,24,25' && number >= 22 && number <= 25)||(bet.bet=='23,24,25,26' && number >= 23 && number <= 26)||(bet.bet=='24,25,26,27' && number >= 24 && number <= 27)||(bet.bet=='25,26,27,28' && number >= 25 && number <= 28)||(bet.bet=='26,27,28,29' && number >= 26 && number <= 29)||(bet.bet=='27,28,29,30' && number >= 27 && number <= 30)||(bet.bet=='28,29,30,31' && number >= 28 && number <= 31)||(bet.bet=='29,30,31,32' && number >= 29 && number <= 32)||(bet.bet=='30,31,32,33' && number >= 30 && number <= 33)||(bet.bet=='31,32,33,34' && number >= 31 && number <= 34)||(bet.bet=='32,33,34,35' && number >= 32 && number <= 35)||(bet.bet=='33,34,35,36' && number >= 33 && number <= 36)) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 8, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break
            case 'H':
                if ((bet.bet=='1,2,3'&& number >= 1 && number <= 3)||(bet.bet=='4,5,6' && number >= 4 && number <= 6)||(bet.bet=='7,8,9' && number >= 7 && number <= 9)||(bet.bet=='10,11,12' && number >= 10 && number <= 12)||(bet.bet=='13,14,15' && number >= 13 && number <= 15)||(bet.bet=='16,17,18' && number >= 16 && number <= 18)||(bet.bet=='19,20,21' && number >= 19 && number <= 21)||(bet.bet=='22,23,24' && number >= 22 && number <= 24)||(bet.bet=='25,26,27' && number >= 25 && number <= 27)||(bet.bet=='28,29,30' && number >= 28 && number <= 30)||(bet.bet=='31,32,33' && number >= 31 && number <= 33)||(bet.bet=='34,35,36' && number >= 34 && number <= 36)) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 12, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                    break
            case 'I':
                if((bet.bet=='0,1'&& number >= 0 && number <= 1)||(bet.bet=='0,2' && number >= 0 && number <= 2)||(bet.bet=='0,3' && number >= 0 && number <= 3)||(bet.bet=='1,2' && number >= 1 && number <= 2)||(bet.bet=='2,3' && number >= 2 && number <= 3)||(bet.bet=='1,4' && number >= 1 && number <= 4)||(bet.bet=='2,5' && number >= 2 && number <= 5)||(bet.bet=='3,6' && number >= 3 && number <= 6)||(bet.bet=='4,5' && number >= 4 && number <= 5)||(bet.bet=='5,6' && number >= 5 && number <= 6)||(bet.bet=='4,7' && number >= 4 && number <= 7)||(bet.bet=='5,8' && number >= 5 && number <= 8)||(bet.bet=='6,9' && number >= 6 && number <= 9)||(bet.bet=='7,8' && number >= 7 && number <= 8)||(bet.bet=='8,9' && number >= 8 && number <= 9)||(bet.bet=='7,10' && number >= 7 && number <= 10)||(bet.bet=='8,11' && number >= 8 && number <= 11)||(bet.bet=='9,12' && number >= 9 && number <= 12)||(bet.bet=='10,11' && number >= 10 && number <= 11)||(bet.bet=='11,12' && number >= 11 && number <= 12)||(bet.bet=='10,13' && number >= 10 && number <= 13)||(bet.bet=='11,14' && number >= 11 && number <= 14)||(bet.bet=='12,15' && number >= 12 && number <= 15)||(bet.bet=='13,14' && number >= 13 && number <= 14)||(bet.bet=='14,15' && number >= 14 && number <= 15)||(bet.bet=='13,16' && number >= 13 && number <= 16)||(bet.bet=='14,17' && number >= 14 && number <= 17)||(bet.bet=='15,18' && number >= 15 && number <= 18)||(bet.bet=='16,17' && number >= 16 && number <= 17)||(bet.bet=='17,18' && number >= 17 && number <= 18)||(bet.bet=='16,19' && number >= 16 && number <= 19)||(bet.bet=='17,20' && number >= 17 && number <= 20)||(bet.bet=='18,21' && number >= 18 && number <= 21)||(bet.bet=='19,20' && number >= 19 && number <= 20)||(bet.bet=='20,21' && number >= 20 && number <= 21)||(bet.bet=='19,22' && number >= 19 && number <= 22)||(bet.bet=='20,23' && number >= 20 && number <= 23)||(bet.bet=='21,24' && number >= 21 && number <= 24)||(bet.bet=='22,23' && number >= 22 && number <= 23)||(bet.bet=='23,24' && number >= 23 && number <= 24)||(bet.bet=='22,25' && number >= 22 && number <= 25)||(bet.bet=='23,26' && number >= 23 && number <= 26)||(bet.bet=='24,27' && number >= 24 && number <= 27)||(bet.bet=='25,26' && number >= 25 && number <= 26)||(bet.bet=='26,27' && number >= 26 && number <= 27)||(bet.bet=='25,28' && number >= 25 && number <= 28)||(bet.bet=='26,29' && number >= 26 && number <= 29)||(bet.bet=='27,30' && number >= 27 && number <= 30)||(bet.bet=='28,29' && number >= 28 && number <= 29)||(bet.bet=='29,30' && number >= 29 && number <= 30)||(bet.bet=='28,31' && number >= 28 && number <= 31)||(bet.bet=='29,32' && number >= 29 && number <= 32)||(bet.bet=='30,33' && number >= 30 && number <= 33)||(bet.bet=='31,32' && number >= 31 && number <= 32)||(bet.bet=='32,33' && number >= 32 && number <= 33)||(bet.bet=='31,34' && number >= 31 && number <= 34)||(bet.bet=='32,35' && number >= 32 && number <= 35)||(bet.bet=='33,36' && number >= 33 && number <= 36))
                     {
                await fetch(url,'/api/transaction', { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 18, type: 'deposit', remarks: 'Roulette Winnings' })
                }); 
                }
                    break
            case 'J':
                if (Number(bet.bet) === number) {
                    await fetch(url,'/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 36, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;
            


        }
        
    }
    catch(e){console.log(e)}

     
    }}

catch(e){}
    console.log(response);
    console.log(gameid2)
    setTimeout(() =>{ 
        gameid2 = uuidv4()
        broadcast2({ type: 'game_start', gameid2 })
}, 1000);
  

}

server2.on('connection', (ws) => {
    console.log('Client connected');
    broadcast2({ type: 'game_start', gameid:gameid2 });
});
gameid2=uuidv4()

setInterval(dealCards2, 30000); // Deal cards every 15 seconds

console.log('WebSocket server1 is running on ws://localhost:8081');
