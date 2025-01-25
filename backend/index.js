const WebSocket = require('ws');
const db = require('./../gambling/src/app/db/db1');
const transactdb = require('./../gambling/src/app/db/crashBetsDb2');
const server = new WebSocket.Server({ port: 8080 });
let clients = [];
let multiplier = 1;
let gameId = 0;

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

