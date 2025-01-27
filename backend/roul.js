const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const server2 = new WebSocket.Server({ port: 8082 });
let gameid2 = uuidv4();
let url="http://localhost:3000"


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

async function dealCards() {
    let number = getnumber()
      
    const response = {
        type: 'deal',
        gameId: gameid2,
       number:number
    };


    broadcast2(response);
try{
    let bets =  await fetch('http://localhost:3000/api/roulette/bets', {
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
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                else if (bet.bet === "ODD" && number % 2 === 1) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;


            case 'B':
                if ((bet.bet === 'RED' && [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number)) ||
                    (bet.bet === 'BLACK' && [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].includes(number))) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;
                

                case 'C':
                if (bet.bet =='1-18' && number >= 1 && number <= 18) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                else if(bet.bet=='19-36' && number >= 19 && number <= 36){
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 2, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break;
            case 'D':
                if ((bet.bet=='Column 1' && [1,4,7,10,13,16,19,22,25,28,31,34].includes(number))||(bet.bet=='Column 2' && [2,5,8,11,14,17,20,23,26,29,32,35].includes(number))||(bet.bet=='Column 3' && [3,6,9,12,15,18,21,24,27,30,33,36].includes(number)) ) {

                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 3, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                } 
                break
            case 'E':
                if ((bet.bet=="1st Dozen" && number >= 1 && number <= 12) || (bet.bet=="2nd Dozen" && number >= 13 && number <= 24) || (bet.bet=="3rd Dozen" && number >= 25 && number <= 36)) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 3, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break
            case 'F':
                if ((bet.bet=='1-6' && number >= 1 && number <= 6)||(bet.bet=='7-12' && number >= 7 && number <= 12)||(bet.bet=='13-18' && number >= 13 && number <= 18)||(bet.bet=='19-24' && number >= 19 && number <= 24)||(bet.bet=='25-30' && number >= 25 && number <= 30)||(bet.bet=='31-36' && number >= 31 && number <= 36)) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 6, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break
            case 'G':
                if((bet.bet=='0,1,2,3'&& number >= 0 && number <= 3)||(bet.bet=='1,2,3,4'&& number >= 1 && number <= 4)||(bet.bet=='2,3,4,5' && number >= 2 && number <= 5)||(bet.bet=='3,4,5,6' && number >= 3 && number <= 6)||(bet.bet=='4,5,6,7' && number >= 4 && number <= 7)||(bet.bet=='5,6,7,8' && number >= 5 && number <= 8)||(bet.bet=='6,7,8,9' && number >= 6 && number <= 9)||(bet.bet=='7,8,9,10' && number >= 7 && number <= 10)||(bet.bet=='8,9,10,11' && number >= 8 && number <= 11)||(bet.bet=='9,10,11,12' && number >= 9 && number <= 12)||(bet.bet=='10,11,12,13' && number >= 10 && number <= 13)||(bet.bet=='11,12,13,14' && number >= 11 && number <= 14)||(bet.bet=='12,13,14,15' && number >= 12 && number <= 15)||(bet.bet=='13,14,15,16' && number >= 13 && number <= 16)||(bet.bet=='14,15,16,17' && number >= 14 && number <= 17)||(bet.bet=='15,16,17,18' && number >= 15 && number <= 18)||(bet.bet=='16,17,18,19' && number >= 16 && number <= 19)||(bet.bet=='17,18,19,20' && number >= 17 && number <= 20)||(bet.bet=='18,19,20,21' && number >= 18 && number <= 21)||(bet.bet=='19,20,21,22' && number >= 19 && number <= 22)||(bet.bet=='20,21,22,23' && number >= 20 && number <= 23)||(bet.bet=='21,22,23,24' && number >= 21 && number <= 24)||(bet.bet=='22,23,24,25' && number >= 22 && number <= 25)||(bet.bet=='23,24,25,26' && number >= 23 && number <= 26)||(bet.bet=='24,25,26,27' && number >= 24 && number <= 27)||(bet.bet=='25,26,27,28' && number >= 25 && number <= 28)||(bet.bet=='26,27,28,29' && number >= 26 && number <= 29)||(bet.bet=='27,28,29,30' && number >= 27 && number <= 30)||(bet.bet=='28,29,30,31' && number >= 28 && number <= 31)||(bet.bet=='29,30,31,32' && number >= 29 && number <= 32)||(bet.bet=='30,31,32,33' && number >= 30 && number <= 33)||(bet.bet=='31,32,33,34' && number >= 31 && number <= 34)||(bet.bet=='32,33,34,35' && number >= 32 && number <= 35)||(bet.bet=='33,34,35,36' && number >= 33 && number <= 36)) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 8, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                break
            case 'H':
                if ((bet.bet=='1,2,3'&& number >= 1 && number <= 3)||(bet.bet=='4,5,6' && number >= 4 && number <= 6)||(bet.bet=='7,8,9' && number >= 7 && number <= 9)||(bet.bet=='10,11,12' && number >= 10 && number <= 12)||(bet.bet=='13,14,15' && number >= 13 && number <= 15)||(bet.bet=='16,17,18' && number >= 16 && number <= 18)||(bet.bet=='19,20,21' && number >= 19 && number <= 21)||(bet.bet=='22,23,24' && number >= 22 && number <= 24)||(bet.bet=='25,26,27' && number >= 25 && number <= 27)||(bet.bet=='28,29,30' && number >= 28 && number <= 30)||(bet.bet=='31,32,33' && number >= 31 && number <= 33)||(bet.bet=='34,35,36' && number >= 34 && number <= 36)) {
                    await fetch('http://localhost:3000/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 12, type: 'deposit', remarks: 'Roulette Winnings' })
                    });
                }
                    break
            case 'I':
                if((bet.bet=='0,1'&& number >= 0 && number <= 1)||(bet.bet=='0,2' && number >= 0 && number <= 2)||(bet.bet=='0,3' && number >= 0 && number <= 3)||(bet.bet=='1,2' && number >= 1 && number <= 2)||(bet.bet=='2,3' && number >= 2 && number <= 3)||(bet.bet=='1,4' && number >= 1 && number <= 4)||(bet.bet=='2,5' && number >= 2 && number <= 5)||(bet.bet=='3,6' && number >= 3 && number <= 6)||(bet.bet=='4,5' && number >= 4 && number <= 5)||(bet.bet=='5,6' && number >= 5 && number <= 6)||(bet.bet=='4,7' && number >= 4 && number <= 7)||(bet.bet=='5,8' && number >= 5 && number <= 8)||(bet.bet=='6,9' && number >= 6 && number <= 9)||(bet.bet=='7,8' && number >= 7 && number <= 8)||(bet.bet=='8,9' && number >= 8 && number <= 9)||(bet.bet=='7,10' && number >= 7 && number <= 10)||(bet.bet=='8,11' && number >= 8 && number <= 11)||(bet.bet=='9,12' && number >= 9 && number <= 12)||(bet.bet=='10,11' && number >= 10 && number <= 11)||(bet.bet=='11,12' && number >= 11 && number <= 12)||(bet.bet=='10,13' && number >= 10 && number <= 13)||(bet.bet=='11,14' && number >= 11 && number <= 14)||(bet.bet=='12,15' && number >= 12 && number <= 15)||(bet.bet=='13,14' && number >= 13 && number <= 14)||(bet.bet=='14,15' && number >= 14 && number <= 15)||(bet.bet=='13,16' && number >= 13 && number <= 16)||(bet.bet=='14,17' && number >= 14 && number <= 17)||(bet.bet=='15,18' && number >= 15 && number <= 18)||(bet.bet=='16,17' && number >= 16 && number <= 17)||(bet.bet=='17,18' && number >= 17 && number <= 18)||(bet.bet=='16,19' && number >= 16 && number <= 19)||(bet.bet=='17,20' && number >= 17 && number <= 20)||(bet.bet=='18,21' && number >= 18 && number <= 21)||(bet.bet=='19,20' && number >= 19 && number <= 20)||(bet.bet=='20,21' && number >= 20 && number <= 21)||(bet.bet=='19,22' && number >= 19 && number <= 22)||(bet.bet=='20,23' && number >= 20 && number <= 23)||(bet.bet=='21,24' && number >= 21 && number <= 24)||(bet.bet=='22,23' && number >= 22 && number <= 23)||(bet.bet=='23,24' && number >= 23 && number <= 24)||(bet.bet=='22,25' && number >= 22 && number <= 25)||(bet.bet=='23,26' && number >= 23 && number <= 26)||(bet.bet=='24,27' && number >= 24 && number <= 27)||(bet.bet=='25,26' && number >= 25 && number <= 26)||(bet.bet=='26,27' && number >= 26 && number <= 27)||(bet.bet=='25,28' && number >= 25 && number <= 28)||(bet.bet=='26,29' && number >= 26 && number <= 29)||(bet.bet=='27,30' && number >= 27 && number <= 30)||(bet.bet=='28,29' && number >= 28 && number <= 29)||(bet.bet=='29,30' && number >= 29 && number <= 30)||(bet.bet=='28,31' && number >= 28 && number <= 31)||(bet.bet=='29,32' && number >= 29 && number <= 32)||(bet.bet=='30,33' && number >= 30 && number <= 33)||(bet.bet=='31,32' && number >= 31 && number <= 32)||(bet.bet=='32,33' && number >= 32 && number <= 33)||(bet.bet=='31,34' && number >= 31 && number <= 34)||(bet.bet=='32,35' && number >= 32 && number <= 35)||(bet.bet=='33,36' && number >= 33 && number <= 36))
                     {
                await fetch('http://localhost:3000/api/transaction', { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: bet.userId, amount: bet.betAmount * 18, type: 'deposit', remarks: 'Roulette Winnings' })
                }); 
                }
                    break
            case 'J':
                if (Number(bet.bet) === number) {
                    await fetch('http://localhost:3000/api/transaction', {
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
broadcast2({ type: 'game_start', gameid:gameid2 });
setInterval(dealCards, 30000); // Deal cards every 15 seconds

console.log('WebSocket server1 is running on ws://localhost:8081');
