const WebSocket = require("ws");
const db = require("./../gambling/src/app/db/db1");
const transactdb = require("./../gambling/src/app/db/crashBetsDb2");

const { v4: uuidv4 } = require("uuid");
let clients1 = [];
let clients2 = [];
let clients3 = [];
let clients4 = [];
let clients5 = [];
let clients6 = [];
let clients7=[]
let clients8=[]
let clients9=[]
let clients10=[]
let clients11=[]

let multiplier = 1;
let gameId = 0;
let gameId3 = uuidv4();
let gameid4 = uuidv4();
let gameid5 = uuidv4();
let gameid6=uuidv4()
let gameid7=uuidv4()
let gameid8=uuidv4()
let gameid9=uuidv4()
let gameid10 = uuidv4();


let url = "http://localhost:3000";
let port = 8080;

///////////////////crash

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
  return 0.99 * Math.pow(e / (e - h), 1 / g) + 0.01;
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
  clients1.forEach((client) => {
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

      broadcast({ type: "game_tick", multiplier });
    } else {
      broadcast({ type: "crash", multiplier });
      gameId = Math.random().toString(36).substr(2, 9); // Generate a random game ID
      broadcast({ type: "game_start", gameId });
      clearInterval(intervalId);
      setTimeout(() => startGame(), 10000);
    }
  }

  function startCrashGame() {

    const crashPoint = getResult().toFixed(2);
    multiplier = 1;

    const intervalId = setInterval(() => increase(crashPoint, intervalId), 200);
  }

  startCrashGame(); // Example of a player betting $100
}

startGame();

//////////////card funcs///////////////////

let gameid = uuidv4();
const deck_of_cards = [
  "ace_of_spades.png",
  "2_of_spades.png",
  "3_of_spades.png",
  "4_of_spades.png",
  "5_of_spades.png",
  "6_of_spades.png",
  "7_of_spades.png",
  "8_of_spades.png",
  "9_of_spades.png",
  "10_of_spades.png",
  "jack_of_spades.png",
  "queen_of_spades.png",
  "king_of_spades.png",
  "ace_of_clubs.png",
  "2_of_clubs.png",
  "3_of_clubs.png",
  "4_of_clubs.png",
  "5_of_clubs.png",
  "6_of_clubs.png",
  "7_of_clubs.png",
  "8_of_clubs.png",
  "9_of_clubs.png",
  "10_of_clubs.png",
  "jack_of_clubs.png",
  "queen_of_clubs.png",
  "king_of_clubs.png",
  "ace_of_diamonds.png",
  "2_of_diamonds.png",
  "3_of_diamonds.png",
  "4_of_diamonds.png",
  "5_of_diamonds.png",
  "6_of_diamonds.png",
  "7_of_diamonds.png",
  "8_of_diamonds.png",
  "9_of_diamonds.png",
  "10_of_diamonds.png",
  "jack_of_diamonds.png",
  "queen_of_diamonds.png",
  "king_of_diamonds.png",
  "ace_of_hearts.png",
  "2_of_hearts.png",
  "3_of_hearts.png",
  "4_of_hearts.png",
  "5_of_hearts.png",
  "6_of_hearts.png",
  "7_of_hearts.png",
  "8_of_hearts.png",
  "9_of_hearts.png",
  "10_of_hearts.png",
  "jack_of_hearts.png",
  "queen_of_hearts.png",
  "king_of_hearts.png",
];


let deck32=['ace_of_spades.png', '6_of_spades.png', '7_of_spades.png', '8_of_spades.png', 
    '9_of_spades.png', '10_of_spades.png', 'ace_of_hearts.png', '6_of_hearts.png', 
    '7_of_hearts.png', '8_of_hearts.png', '9_of_hearts.png', '10_of_hearts.png', 
    'ace_of_diamonds.png', '6_of_diamonds.png', '7_of_diamonds.png', '8_of_diamonds.png', 
    '9_of_diamonds.png', '10_of_diamonds.png', 'ace_of_clubs.png', '6_of_clubs.png', 
    '7_of_clubs.png', '8_of_clubs.png', '9_of_clubs.png', '10_of_clubs.png']
   
  

function getRandomCards(deck, num) {
  let shuffledDeck = deck.sort(() => Math.random() - 0.5);
  return shuffledDeck.slice(0, num);
}

function getJokerCard(deck) {
  let shuffledDeck = deck.sort(() => Math.random() - 0.5);
  return shuffledDeck[0]; // Get the rank of the joker card
}

const sik = ["spades", "diamonds", "hearts", "clubs"];
const order = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
  "ace",
];

function val(cards) {
  const values = cards.map((card) => order.indexOf(card.split("_")[0]));
  values.sort((a, b) => a - b);
  return values;
}

function isFlush(cards) {
  const suits = cards.map((card) => card.split("_")[2].split(".")[0]);
  return new Set(suits).size === 1;
}

function isStraight(cards) {
  const order = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
    "ace",
  ];
  const values = cards.map((card) => order.indexOf(card.split("_")[0]));
  values.sort((a, b) => a - b);

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
  return cards.filter((card) => faceCards.has(card.split("_")[0])).length;
}

function isTwoOfAKind(cards) {
  const values = cards.map((card) => 13 - order.indexOf(card.split("_")[0]));
  values.sort((a, b) => a - b);
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] == values[i]) {
      return true;
    }
  }
  return false;
}

function isThreeOfAKind(cards) {
  const values = cards.map((card) => 13 - order.indexOf(card.split("_")[0]));

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] !== values[i]) {
      return false;
    }
  }
  return true;
}

function replaceJoker(cards, joker) {
  let nc = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].split("_")[0] != joker) nc.push(cards[i]);
  }
  if (nc.length == 2)
    if (isThreeOfAKind(nc)) {
      let values = nc.map((card) => card.split("_")[2].split(".")[0]);
      nc.push(
        `${nc[0].split("_")[0]}_of_${
          findDisjointElements(values, sik)[order.length - values.length - 1]
        }.png`
      );
    } else if (isStraightFlush(nc)) {
      const values = nc.map((card) => order.indexOf(card.split("_")[0]));
      values.sort((a, b) => a - b);

      let k = values[values.length - 1] + 1;
      let nextValue = order[k % order.length];
      if (k == 13) nextValue = order[10];

      const suit = nc[0].split("_")[2];
      nc.push(`${nextValue}_of_${suit}`);
    } else if (isStraight(nc)) {
      for (let j = 0; nc.length; j++) {
        if (nc[j].split("_")[2] != sik[j]) {
          const values = nc.map((card) => order.indexOf(card.split("_")[0]));
          values.sort((a, b) => a - b);

          let k = values[values.length - 1] + 1;
          let nextValue = order[k % order.length];
          if (k == 13) nextValue = order[10];

          nc.push(`${nextValue}_of_${sik[j]}.png`);
          break;
        }
      }
    } else if (isFlush(nc)) {
      if (val(nc)[0] == val(nc)[1] - 2) {
        const values = nc.map((card) => order.indexOf(card.split("_")[0]));
        values.sort((a, b) => a - b);

        let k = values[values.length - 1] + 1;
        let nextValue = order[k % order.length];
        if (k == 13) nextValue = order[10];

        const suit = nc[0].split("_")[2];
        nc.push(`${nextValue}_of_${suit}`);
      } else {
        let values = nc.map((card) => card.split("_")[0]);
        nc.push(
          `${
            findDisjointElements(values, order)[
              order.length - values.length - 1
            ]
          }_of_${nc[0].split("_")[2]}`
        );
      }
    } else {
      let values = nc.map((card) => card.split("_")[0]);
      values.sort((a, b) => b - a);
      const highestCard = order[values[0]];

      const suit = nc[0].split("_")[2];
      nc.push(
        `${
          findDisjointElements(values, order)[order.length - values.length - 1]
        }_of_${suit}`
      );
    }
  else nc = cards.map((card) => card);
  return nc;
}

function findDisjointElements(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const disjointElements = [
    ...arr1.filter((item) => !set2.has(item)),
    ...arr2.filter((item) => !set1.has(item)),
  ];

  return disjointElements;
}

function tiebreaker(hands) {
  let tie = hands.map((hand) => {
    const order = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "jack",
      "queen",
      "king",
      "ace",
    ];
    const values = hand.map((card) => order.indexOf(card.split("_")[0]));

    if (new Set(values).length == 1) return 3;
    return Math.max(...values);
  });
  if (new Set(tie).length == 1) return 3;

  return tie.indexOf(Math.max(...tie));
}

function decideWinner(hands, joker) {
  hands = [replaceJoker(hands[0], joker), replaceJoker(hands[1], joker)];
  const handRanks = hands.map((hand) => {
    if (isThreeOfAKind(hand)) return 5;
    else if (isStraightFlush(hand)) return 4;
    else if (isFlush(hand)) return 2;
    else if (isStraight(hand)) return 3;
    else if (isTwoOfAKind(hand)) return 1;

    return 0;
  });
  if (new Set(handRanks).size == 1) {
    if (
      handRanks[0] == 0 ||
      handRanks[0] == 5 ||
      handRanks[0] == 2 ||
      handRanks[0] == 1
    )
      return tiebreaker(hands);
    else return 3;
  } else {
    const maxRank = Math.max(...handRanks);

    return handRanks.indexOf(maxRank);
  }
}


function decideWinner3(hands, joker) {
    hands = [replaceJoker(hands[0], joker), replaceJoker(hands[1], joker),replaceJoker(hands[2], joker)];
    const handRanks = hands.map((hand) => {
      if (isThreeOfAKind(hand)) return 5;
      else if (isStraightFlush(hand)) return 4;
      else if (isFlush(hand)) return 2;
      else if (isStraight(hand)) return 3;
      else if (isTwoOfAKind(hand)) return 1;
  
      return 0;
    });
    if (new Set(handRanks).size == 1) {
      if (
        handRanks[0] == 0 ||
        handRanks[0] == 5 ||
        handRanks[0] == 2 ||
        handRanks[0] == 1
      ){
        let ttt=tiebreaker(hands)
        if (ttt==2)
            return 3
        return ttt
    }
      else return 2;
    } else {
      const maxRank = Math.max(...handRanks);
        if (handRanks.indexOf(maxRank)==2)
            return 3
      return handRanks.indexOf(maxRank);
    }
  }
  


/////////////////joker//////////////

function broadcast3(message) {
  clients4.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function dealCards3() {
  let chosen_cards = getRandomCards(deck_of_cards, 7);
  let size = 3;
  let chunked = chosen_cards.reduce((result, item, index) => {
    if (index % size === 0) {
      result.push([item]);
    } else {
      result[result.length - 1].push(item);
    }
    return result;
  }, []);

  const joker = chosen_cards[2];

  const response = {
    type: "deal",
    gameId: gameId3,
    hands: [chunked[2], chunked[0], chunked[1]],
    joker: joker,
    winningHand: decideWinner(chunked, joker.split("_")[0]),
    isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
    isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
    isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
    faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
  };

  broadcast3(response);
  let bets = await fetch(`${url}/api/poker2/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameid: gameId3 }),
  });
  bets = await bets.json();
  if (bets.length != 0)
    for (const bet of bets) {
     
      if (bet.type === "W" && bet.bet === ["A", "B"][response.winningHand]) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 2,
            type: "deposit",
            remarks: "Poker2 Winnings",
          }),
        });
      } else if (bet.type === "S" && bet.bet === dumdum(response.isStraight)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 4,
            type: "deposit",
            remarks: "Poker2 Winnings",
          }),
        });
      } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 3,
            type: "deposit",
            remarks: "Poker2 Winnings",
          }),
        });
      } else if (
        bet.type === "SF" &&
        bet.bet === dumdum(response.isStraightFlush)
      ) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 8,
            type: "deposit",
            remarks: "Poker2 Winnings",
          }),
        });
      }
    }
  setTimeout(() => {
    gameId3 = uuidv4();
    broadcast3({ type: "game_start", gameid: gameId3 });
  }, 1000);
}

setInterval(dealCards3, 15000); // Deal cards every 15 seconds

/////////////normal//////////////////

function broadcast1(message) {
  clients2.forEach((client) => {
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
    type: "deal",
    gameId: gameid,
    hands: chunked,
    isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
    isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
    isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
    faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
    winningHand: decideWinner(chunked, "joke"),
  };

  function dumdum(d) {
    if (d[0]) return "A";
    else if (d[1]) return "B";
    else return "T";
  }

  broadcast1(response);

  let bets = await fetch(`${url}/api/poker1/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameid: gameid }),
  });
  bets = await bets.json();
  if (bets.length != 0)
    for (const bet of bets) {
     
      if (bet.type === "W" && bet.bet === ["A", "B"][response.winningHand]) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 2,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      } else if (bet.type === "S" && bet.bet === dumdum(response.isStraight)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 4,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 3,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      } else if (
        bet.type === "SF" &&
        bet.bet === dumdum(response.isStraightFlush)
      ) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 8,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      }
    }

  setTimeout(() => {
    gameid = uuidv4();
    broadcast1({ type: "game_start", gameid });
  }, 1000);
}

broadcast1({ type: "game_start", gameid });
setInterval(dealCards, 15000); // Deal cards every 15 seconds

//////////////////
//mufli
function broadcast4(message) {
  clients5.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function dealCards4() {
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
  let win = decideWinner(chunked, "joke");
  if (win == 0) {
    win = 1;
  } else if (win == 1) win = 0;
  const response = {
    type: "deal",
    gameId: gameid,
    hands: chunked,
    isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
    isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
    isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
    faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
    winningHand: win,
  };

  function dumdum(d) {
    if (d[0]) return "A";
    else if (d[1]) return "B";
    else return "T";
  }

  broadcast4(response);

  let bets = await fetch(`${url}/api/poker3/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameid: gameid4 }),
  });
  bets = await bets.json();
  if (bets.length != 0)
    for (const bet of bets) {
     
      if (bet.type === "W" && bet.bet === ["A", "B"][response.winningHand]) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 2,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      } else if (bet.type === "S" && bet.bet === dumdum(response.isStraight)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 4,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 3,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      } else if (
        bet.type === "SF" &&
        bet.bet === dumdum(response.isStraightFlush)
      ) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 8,
            type: "deposit",
            remarks: "Poker1 Winnings",
          }),
        });
      }
    }

  setTimeout(() => {
    gameid4 = uuidv4();
    broadcast1({ type: "game_start", gameid: gameid4 });
  }, 1000);
}

broadcast4({ type: "game_start", gameid: gameid4 });
setInterval(dealCards4, 15000); // Deal cards every 15 seconds

/////////////roulette//////////////

let gameid2 = uuidv4();

function getnumber() {
  return Math.floor(Math.random() * 36);
}

function broadcast2(message) {
  clients3.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function dealCards2() {
  let number = getnumber();

  const response = {
    type: "deal",
    gameId: gameid2,
    number: number,
  };

  broadcast2(response);
  try {
    let bets = await fetch(url + "/api/roulette/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameid: gameid2 }),
    });
    bets = await bets.json();
    if (bets.length != 0)
      for (const bet of bets) {
       
        try {
          switch (bet.type) {
            case "A":
              if (bet.bet === 0) {
              } else if (bet.bet === "EVEN" && number % 2 === 0) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              } else if (bet.bet === "ODD" && number % 2 === 1) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;

            case "B":
              if (
                (bet.bet === "RED" &&
                  [
                    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32,
                    34, 36,
                  ].includes(number)) ||
                (bet.bet === "BLACK" &&
                  [
                    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31,
                    33, 35,
                  ].includes(number))
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;

            case "C":
              if (bet.bet == "1-18" && number >= 1 && number <= 18) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              } else if (bet.bet == "19-36" && number >= 19 && number <= 36) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "D":
              if (
                (bet.bet == "Column 1" &&
                  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(
                    number
                  )) ||
                (bet.bet == "Column 2" &&
                  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(
                    number
                  )) ||
                (bet.bet == "Column 3" &&
                  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(
                    number
                  ))
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 3,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "E":
              if (
                (bet.bet == "1st Dozen" && number >= 1 && number <= 12) ||
                (bet.bet == "2nd Dozen" && number >= 13 && number <= 24) ||
                (bet.bet == "3rd Dozen" && number >= 25 && number <= 36)
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 3,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "F":
              if (
                (bet.bet == "1-6" && number >= 1 && number <= 6) ||
                (bet.bet == "7-12" && number >= 7 && number <= 12) ||
                (bet.bet == "13-18" && number >= 13 && number <= 18) ||
                (bet.bet == "19-24" && number >= 19 && number <= 24) ||
                (bet.bet == "25-30" && number >= 25 && number <= 30) ||
                (bet.bet == "31-36" && number >= 31 && number <= 36)
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 6,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "G":
              if (
                (bet.bet == "0,1,2,3" && number >= 0 && number <= 3) ||
                (bet.bet == "1,2,3,4" && number >= 1 && number <= 4) ||
                (bet.bet == "2,3,4,5" && number >= 2 && number <= 5) ||
                (bet.bet == "3,4,5,6" && number >= 3 && number <= 6) ||
                (bet.bet == "4,5,6,7" && number >= 4 && number <= 7) ||
                (bet.bet == "5,6,7,8" && number >= 5 && number <= 8) ||
                (bet.bet == "6,7,8,9" && number >= 6 && number <= 9) ||
                (bet.bet == "7,8,9,10" && number >= 7 && number <= 10) ||
                (bet.bet == "8,9,10,11" && number >= 8 && number <= 11) ||
                (bet.bet == "9,10,11,12" && number >= 9 && number <= 12) ||
                (bet.bet == "10,11,12,13" && number >= 10 && number <= 13) ||
                (bet.bet == "11,12,13,14" && number >= 11 && number <= 14) ||
                (bet.bet == "12,13,14,15" && number >= 12 && number <= 15) ||
                (bet.bet == "13,14,15,16" && number >= 13 && number <= 16) ||
                (bet.bet == "14,15,16,17" && number >= 14 && number <= 17) ||
                (bet.bet == "15,16,17,18" && number >= 15 && number <= 18) ||
                (bet.bet == "16,17,18,19" && number >= 16 && number <= 19) ||
                (bet.bet == "17,18,19,20" && number >= 17 && number <= 20) ||
                (bet.bet == "18,19,20,21" && number >= 18 && number <= 21) ||
                (bet.bet == "19,20,21,22" && number >= 19 && number <= 22) ||
                (bet.bet == "20,21,22,23" && number >= 20 && number <= 23) ||
                (bet.bet == "21,22,23,24" && number >= 21 && number <= 24) ||
                (bet.bet == "22,23,24,25" && number >= 22 && number <= 25) ||
                (bet.bet == "23,24,25,26" && number >= 23 && number <= 26) ||
                (bet.bet == "24,25,26,27" && number >= 24 && number <= 27) ||
                (bet.bet == "25,26,27,28" && number >= 25 && number <= 28) ||
                (bet.bet == "26,27,28,29" && number >= 26 && number <= 29) ||
                (bet.bet == "27,28,29,30" && number >= 27 && number <= 30) ||
                (bet.bet == "28,29,30,31" && number >= 28 && number <= 31) ||
                (bet.bet == "29,30,31,32" && number >= 29 && number <= 32) ||
                (bet.bet == "30,31,32,33" && number >= 30 && number <= 33) ||
                (bet.bet == "31,32,33,34" && number >= 31 && number <= 34) ||
                (bet.bet == "32,33,34,35" && number >= 32 && number <= 35) ||
                (bet.bet == "33,34,35,36" && number >= 33 && number <= 36)
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 8,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "H":
              if (
                (bet.bet == "1,2,3" && number >= 1 && number <= 3) ||
                (bet.bet == "4,5,6" && number >= 4 && number <= 6) ||
                (bet.bet == "7,8,9" && number >= 7 && number <= 9) ||
                (bet.bet == "10,11,12" && number >= 10 && number <= 12) ||
                (bet.bet == "13,14,15" && number >= 13 && number <= 15) ||
                (bet.bet == "16,17,18" && number >= 16 && number <= 18) ||
                (bet.bet == "19,20,21" && number >= 19 && number <= 21) ||
                (bet.bet == "22,23,24" && number >= 22 && number <= 24) ||
                (bet.bet == "25,26,27" && number >= 25 && number <= 27) ||
                (bet.bet == "28,29,30" && number >= 28 && number <= 30) ||
                (bet.bet == "31,32,33" && number >= 31 && number <= 33) ||
                (bet.bet == "34,35,36" && number >= 34 && number <= 36)
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 12,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "I":
              if (
                (bet.bet == "0,1" && number >= 0 && number <= 1) ||
                (bet.bet == "0,2" && number >= 0 && number <= 2) ||
                (bet.bet == "0,3" && number >= 0 && number <= 3) ||
                (bet.bet == "1,2" && number >= 1 && number <= 2) ||
                (bet.bet == "2,3" && number >= 2 && number <= 3) ||
                (bet.bet == "1,4" && number >= 1 && number <= 4) ||
                (bet.bet == "2,5" && number >= 2 && number <= 5) ||
                (bet.bet == "3,6" && number >= 3 && number <= 6) ||
                (bet.bet == "4,5" && number >= 4 && number <= 5) ||
                (bet.bet == "5,6" && number >= 5 && number <= 6) ||
                (bet.bet == "4,7" && number >= 4 && number <= 7) ||
                (bet.bet == "5,8" && number >= 5 && number <= 8) ||
                (bet.bet == "6,9" && number >= 6 && number <= 9) ||
                (bet.bet == "7,8" && number >= 7 && number <= 8) ||
                (bet.bet == "8,9" && number >= 8 && number <= 9) ||
                (bet.bet == "7,10" && number >= 7 && number <= 10) ||
                (bet.bet == "8,11" && number >= 8 && number <= 11) ||
                (bet.bet == "9,12" && number >= 9 && number <= 12) ||
                (bet.bet == "10,11" && number >= 10 && number <= 11) ||
                (bet.bet == "11,12" && number >= 11 && number <= 12) ||
                (bet.bet == "10,13" && number >= 10 && number <= 13) ||
                (bet.bet == "11,14" && number >= 11 && number <= 14) ||
                (bet.bet == "12,15" && number >= 12 && number <= 15) ||
                (bet.bet == "13,14" && number >= 13 && number <= 14) ||
                (bet.bet == "14,15" && number >= 14 && number <= 15) ||
                (bet.bet == "13,16" && number >= 13 && number <= 16) ||
                (bet.bet == "14,17" && number >= 14 && number <= 17) ||
                (bet.bet == "15,18" && number >= 15 && number <= 18) ||
                (bet.bet == "16,17" && number >= 16 && number <= 17) ||
                (bet.bet == "17,18" && number >= 17 && number <= 18) ||
                (bet.bet == "16,19" && number >= 16 && number <= 19) ||
                (bet.bet == "17,20" && number >= 17 && number <= 20) ||
                (bet.bet == "18,21" && number >= 18 && number <= 21) ||
                (bet.bet == "19,20" && number >= 19 && number <= 20) ||
                (bet.bet == "20,21" && number >= 20 && number <= 21) ||
                (bet.bet == "19,22" && number >= 19 && number <= 22) ||
                (bet.bet == "20,23" && number >= 20 && number <= 23) ||
                (bet.bet == "21,24" && number >= 21 && number <= 24) ||
                (bet.bet == "22,23" && number >= 22 && number <= 23) ||
                (bet.bet == "23,24" && number >= 23 && number <= 24) ||
                (bet.bet == "22,25" && number >= 22 && number <= 25) ||
                (bet.bet == "23,26" && number >= 23 && number <= 26) ||
                (bet.bet == "24,27" && number >= 24 && number <= 27) ||
                (bet.bet == "25,26" && number >= 25 && number <= 26) ||
                (bet.bet == "26,27" && number >= 26 && number <= 27) ||
                (bet.bet == "25,28" && number >= 25 && number <= 28) ||
                (bet.bet == "26,29" && number >= 26 && number <= 29) ||
                (bet.bet == "27,30" && number >= 27 && number <= 30) ||
                (bet.bet == "28,29" && number >= 28 && number <= 29) ||
                (bet.bet == "29,30" && number >= 29 && number <= 30) ||
                (bet.bet == "28,31" && number >= 28 && number <= 31) ||
                (bet.bet == "29,32" && number >= 29 && number <= 32) ||
                (bet.bet == "30,33" && number >= 30 && number <= 33) ||
                (bet.bet == "31,32" && number >= 31 && number <= 32) ||
                (bet.bet == "32,33" && number >= 32 && number <= 33) ||
                (bet.bet == "31,34" && number >= 31 && number <= 34) ||
                (bet.bet == "32,35" && number >= 32 && number <= 35) ||
                (bet.bet == "33,36" && number >= 33 && number <= 36)
              ) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 18,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
            case "J":
              if (Number(bet.bet) === number) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 36,
                    type: "deposit",
                    remarks: "Roulette Winnings",
                  }),
                });
              }
              break;
          }
        } catch (e) {
          console.log(e);
        }
      }
  } catch (e) {}

  setTimeout(() => {
    gameid2 = uuidv4();
    broadcast2({ type: "game_start", gameid2 });
  }, 1000);
}

gameid2 = uuidv4();

setInterval(dealCards2, 30000); // Deal cards every 15 seconds4

/////////////////baccarat//////////

const cardValues = {
  ace: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 0,
  jack: 0,
  queen: 0,
  king: 0,
};

function calculateHandValue(hand) {
  return hand.reduce((sum, card) => {
    const cardValue = card.split("_")[0];
    return (sum + cardValues[cardValue]) % 10;
  }, 0);
}

function baccarat(cards) {
  const playerHand = cards[0];
  const bankerHand = cards[1];
  let winner = 3;
  let playerValue = calculateHandValue([playerHand[0], playerHand[1]]);
  let pl = [playerHand[0], playerHand[1]];
  let bankerValue = calculateHandValue([bankerHand[0], bankerHand[1]]);
  let bl = [bankerHand[0], bankerHand[1]];
  if (
    playerValue == 8 ||
    playerValue == 9 ||
    playerValue == 8 ||
    playerValue == 9
  ) {
    if (playerValue == 8 || playerValue == 9) winner = 0;
    else if (playerValue == 8 || playerValue == 9) winner = 1;
  } else {
    if (playerValue <= 5) {
      playerValue = calculateHandValue(playerHand);
      pl.push(playerHand[2]);
    }
    if (bankerValue <= 2) {
      bankerValue = calculateHandValue(bankerHand);
      bl.push(bankerHand[2]);
    } else if (bankerValue <= 2) {
      bankerValue = calculateHandValue(bankerHand);
      bl.push(bankerHand[2]);
    } else if (bankerValue == 3) {
      if (calculateHandValue([playerHand[2]]) != 8) {
        bankerValue = calculateHandValue(bankerHand);
        bl.push(bankerHand[2]);
      }
    } else if (bankerValue == 4) {
      if (
        findDisjointElements(
          [calculateHandValue([playerHand[2]])],
          [2, 3, 4, 5, 6, 7]
        ).length == 5
      ) {
        bankerValue = calculateHandValue(bankerHand);
        bl.push(bankerHand[2]);
      }
    } else if (bankerValue == 5) {
      if (
        findDisjointElements(
          [calculateHandValue([playerHand[2]])],
          [4, 5, 6, 7]
        ).length == 3
      ) {
        bl.push(bankerHand[2]);
        bankerValue = calculateHandValue(bankerHand);
      }
    } else if (bankerValue == 6) {
      if (
        findDisjointElements([calculateHandValue([playerHand[2]])], [6, 7])
          .length == 1
      ) {
        bl.push(bankerHand[2]);
        bankerValue = calculateHandValue(bankerHand);
      }
    } else if (bankerValue == 7) {
    } else {
      bl.push(bankerHand[2]);

      bankerValue = calculateHandValue(bankerHand);
    }

    winner = Math.abs(9 - playerValue) > Math.abs(9 - bankerValue) ? 0 : 1;
    if (playerValue == bankerValue) {
      winner = 3;
    }
  }

  return {
    pl,
    bl,
    winner: winner,
  };
}

function broadcast5(message) {
  clients6.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function dealCards5() {
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

  let win = baccarat(chunked);

  const response = {
    type: "deal",
    gameId: gameid5,
    hands: [win.pl, win.bl],
    isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
    isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
    isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
    faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
    winningHand: win.winner,
  };

  function dumdum(d) {
    if (d[0]) return "A";
    else if (d[1]) return "B";
    else return "T";
  }

  broadcast5(response);

  let bets = await fetch(`${url}/api/poker4/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameid: gameid5 }),
  });
  bets = await bets.json();
  if (bets.length != 0)
    for (const bet of bets) {
     
      if (
        bet.type === "W" &&
        bet.bet === ["A", "B", "", "C"][response.winningHand]
      ) {
        if (bet.bet === "C") {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 8,
              type: "deposit",
              remarks: "Baccarat Winnings",
            }),
          });
        } else if (bet.type === "W" && bet.bet === "C") {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 2,
              type: "deposit",
              remarks: "Baccarat Winnings",
            }),
          });
        }
      } else if (bet.type === "S" && bet.bet === dumdum(response.isStraight)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 4,
            type: "deposit",
            remarks: "Baccarat Winnings",
          }),
        });
      } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 3,
            type: "deposit",
            remarks: "Baccarat Winnings",
          }),
        });
      } else if (
        bet.type === "SF" &&
        bet.bet === dumdum(response.isStraightFlush)
      ) {
        await fetch(`${url}/api/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: bet.userId,
            amount: bet.betAmount * 8,
            type: "deposit",
            remarks: "Baccarat Winnings",
          }),
        });
      }
    }

  setTimeout(() => {
    gameid5 = uuidv4();
    broadcast5({ type: "game_start", gameid: gameid5 });
  }, 1000);
}

broadcast5({ type: "game_start", gameid: gameid5 });
setInterval(dealCards5, 15000); // Deal cards every 15 seconds

//////////////////



/////////////////baccaratS6//////////


  
  function baccarat6(cards) {
    const playerHand = cards[0];
    const bankerHand = cards[1];
    let winner = 3;
    let playerValue = calculateHandValue([playerHand[0], playerHand[1]]);
    let pl = [playerHand[0], playerHand[1]];
    let bankerValue = calculateHandValue([bankerHand[0], bankerHand[1]]);
    let bl = [bankerHand[0], bankerHand[1]];
    if (
      playerValue == 8 ||
      playerValue == 9 ||
      playerValue == 8 ||
      playerValue == 9
    ) {
      if (playerValue == 8 || playerValue == 9) winner = 0;
      else if (playerValue == 8 || playerValue == 9) winner = 1;
    } else {
      if (playerValue <= 5) {
        playerValue = calculateHandValue(playerHand);
        pl.push(playerHand[2]);
      }
      if (bankerValue <= 2) {
        bankerValue = calculateHandValue(bankerHand);
        bl.push(bankerHand[2]);
      } else if (bankerValue <= 2) {
        bankerValue = calculateHandValue(bankerHand);
        bl.push(bankerHand[2]);
      } else if (bankerValue == 3) {
        if (calculateHandValue([playerHand[2]]) != 8) {
          bankerValue = calculateHandValue(bankerHand);
          bl.push(bankerHand[2]);
        }
      } else if (bankerValue == 4) {
        if (
          findDisjointElements(
            [calculateHandValue([playerHand[2]])],
            [2, 3, 4, 5, 6, 7]
          ).length == 5
        ) {
          bankerValue = calculateHandValue(bankerHand);
          bl.push(bankerHand[2]);
        }
      } else if (bankerValue == 5) {
        if (
          findDisjointElements(
            [calculateHandValue([playerHand[2]])],
            [4, 5, 6, 7]
          ).length == 3
        ) {
          bl.push(bankerHand[2]);
          bankerValue = calculateHandValue(bankerHand);
        }
      } else if (bankerValue == 6) {
        if (
          findDisjointElements([calculateHandValue([playerHand[2]])], [6, 7])
            .length == 1
        ) {
          bl.push(bankerHand[2]);
          bankerValue = calculateHandValue(bankerHand);
        }
      } else if (bankerValue == 7) {
      } else {
        bl.push(bankerHand[2]);
  
        bankerValue = calculateHandValue(bankerHand);
      }
      if (playerValue==6){
        winner=4
      }
      else if (bankerValue==6){
        winner=5
      }
      else
      winner = Math.abs(9 - playerValue) > Math.abs(9 - bankerValue) ? 0 : 1;
      if ((playerValue == bankerValue)) {
        winner = 3;
      }
    }
  
    return {
      pl,
      bl,
      winner: winner,
    };
  }
  
  function broadcast6(message) {
    clients7.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  async function dealCards6() {
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
  
    let win = baccarat6(chunked);
  
    const response = {
      type: "deal",
      gameId: gameid6,
      hands: [win.pl, win.bl],
      isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
      isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
      isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
      faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
      winningHand: win.winner,
    };
  
    function dumdum(d) {
      if (d[0]) return "A";
      else if (d[1]) return "B";
      else return "T";
    }
  
    broadcast6(response);
  
    let bets = await fetch(`${url}/api/poker5/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameid: gameid6 }),
    });
    bets = await bets.json();
    if (bets.length != 0)
      for (const bet of bets) {
       
        if (
          bet.type === "W" &&
          bet.bet === ["A", "B", "", "C"][response.winningHand]
        ) {
          if (bet.bet === "C") {
            await fetch(`${url}/api/transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: bet.userId,
                amount: bet.betAmount * 8,
                type: "deposit",
                remarks: "Baccarat S6 Winnings",
              }),
            });
          } else if (bet.type === "W" && bet.bet === "C") {
            await fetch(`${url}/api/transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: bet.userId,
                amount: bet.betAmount * 2,
                type: "deposit",
                remarks: "Baccarat S6 Winnings",
              }),
            });
          }
        } else if (bet.type === "S" &&  bet.bet === ["A", "B", "", "C","D","E"][response.winningHand]) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 3,
              type: "deposit",
              remarks: "Baccarat S6 Winnings",
            }),
          });
        } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 3,
              type: "deposit",
              remarks: "Baccarat S6 Winnings",
            }),
          });
        } else if (
          bet.type === "SF" &&
          bet.bet === dumdum(response.isStraightFlush)
        ) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 8,
              type: "deposit",
              remarks: "Baccarat S6 Winnings",
            }),
          });
        }
      }
  
    setTimeout(() => {
      gameid6 = uuidv4();
      broadcast6({ type: "game_start", gameid: gameid6 });
    }, 1000);
  }
  
  broadcast6({ type: "game_start", gameid: gameid6 });
  setInterval(dealCards6, 15000); // Deal cards every 15 seconds
  
  //////////////////

/////////////////baccarat32//////////


  function broadcast7(message) {
    clients6.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  async function dealCards7() {
    let chosen_cards = getRandomCards(deck32, 6);
    let size = 3;
    let chunked = chosen_cards.reduce((result, item, index) => {
      if (index % size === 0) {
        result.push([item]);
      } else {
        result[result.length - 1].push(item);
      }
      return result;
    }, []);
  
    let win = baccarat(chunked);
  
    const response = {
      type: "deal",
      gameId: gameid,
      hands: [win.pl, win.bl],
      isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
      isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
      isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
      faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
      winningHand: win.winner,
    };
  
    function dumdum(d) {
      if (d[0]) return "A";
      else if (d[1]) return "B";
      else return "T";
    }
  
    broadcast7(response);
  
    let bets = await fetch(`${url}/api/poker6/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameid: gameid7 }),
    });
    bets = await bets.json();
    if (bets.length != 0)
      for (const bet of bets) {
       
        if (
          bet.type === "W" &&
          bet.bet === ["A", "B", "", "C"][response.winningHand]
        ) {
          if (bet.bet === "C") {
            await fetch(`${url}/api/transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: bet.userId,
                amount: bet.betAmount * 8,
                type: "deposit",
                remarks: "Baccarat 32 Winnings",
              }),
            });
          } else if (bet.type === "W" && bet.bet === "C") {
            await fetch(`${url}/api/transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: bet.userId,
                amount: bet.betAmount * 2,
                type: "deposit",
                remarks: "Baccarat 32 Winnings",
              }),
            });
          }
        } else if (bet.type === "S" && bet.bet === dumdum(response.isStraight)) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 4,
              type: "deposit",
              remarks: "Baccarat 32 Winnings",
            }),
          });
        } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 3,
              type: "deposit",
              remarks: "Baccarat 32 Winnings",
            }),
          });
        } else if (
          bet.type === "SF" &&
          bet.bet === dumdum(response.isStraightFlush)
        ) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 8,
              type: "deposit",
              remarks: "Baccarat 32 Winnings",
            }),
          });
        }
      }
  
    setTimeout(() => {
      gameid7 = uuidv4();
      broadcast7({ type: "game_start", gameid: gameid7 });
    }, 1000);
  }
  
  broadcast7({ type: "game_start", gameid: gameid7 });
  setInterval(dealCards7, 15000); // Deal cards every 15 seconds
  
  //////////////////


/////////////////baccaratS6//////////


  
function baccarats6(cards) {
    const playerHand = cards[0];
    const bankerHand = cards[1];
    let winner = 3;
    let playerValue = calculateHandValue([playerHand[0], playerHand[1]]);
    let pl = [playerHand[0], playerHand[1]];
    let bankerValue = calculateHandValue([bankerHand[0], bankerHand[1]]);
    let bl = [bankerHand[0], bankerHand[1]];
    if (
      playerValue == 8 ||
      playerValue == 9 ||
      playerValue == 8 ||
      playerValue == 9
    ) {
      if (playerValue == 8 || playerValue == 9) winner = 0;
      else if (playerValue == 8 || playerValue == 9) winner = 1;
    } else {
      if (playerValue <= 5) {
        playerValue = calculateHandValue(playerHand);
        pl.push(playerHand[2]);
      }
      if (bankerValue <= 2) {
        bankerValue = calculateHandValue(bankerHand);
        bl.push(bankerHand[2]);
      } else if (bankerValue <= 2) {
        bankerValue = calculateHandValue(bankerHand);
        bl.push(bankerHand[2]);
      } else if (bankerValue == 3) {
        if (calculateHandValue([playerHand[2]]) != 8) {
          bankerValue = calculateHandValue(bankerHand);
          bl.push(bankerHand[2]);
        }
      } else if (bankerValue == 4) {
        if (
          findDisjointElements(
            [calculateHandValue([playerHand[2]])],
            [2, 3, 4, 5, 6, 7]
          ).length == 5
        ) {
          bankerValue = calculateHandValue(bankerHand);
          bl.push(bankerHand[2]);
        }
      } else if (bankerValue == 5) {
        if (
          findDisjointElements(
            [calculateHandValue([playerHand[2]])],
            [4, 5, 6, 7]
          ).length == 3
        ) {
          bl.push(bankerHand[2]);
          bankerValue = calculateHandValue(bankerHand);
        }
      } else if (bankerValue == 6) {
        if (
          findDisjointElements([calculateHandValue([playerHand[2]])], [6, 7])
            .length == 1
        ) {
          bl.push(bankerHand[2]);
          bankerValue = calculateHandValue(bankerHand);
        }
      } else if (bankerValue == 7) {
      } else {
        bl.push(bankerHand[2]);
  
        bankerValue = calculateHandValue(bankerHand);
      }
      if (bankerValue==6){
        winner=5
      }
      else
      winner = Math.abs(9 - playerValue) > Math.abs(9 - bankerValue) ? 0 : 1;
      if ((playerValue == bankerValue!=6)) {
        winner = 3;
      }
    }
  
    return {
      pl,
      bl,
      winner: winner,
    };
  }
  
  function broadcast8(message) {
    clients7.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  async function dealCards8() {
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
  
    let win = baccarats6(chunked);
  
    const response = {
      type: "deal",
      gameId: gameid8,
      hands: [win.pl, win.bl],
      isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
      isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
      isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
      faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
      winningHand: win.winner,
    };
  
    function dumdum(d) {
      if (d[0]) return "A";
      else if (d[1]) return "B";
      else return "T";
    }
  
    broadcast8(response);
  
    let bets = await fetch(`${url}/api/poker7/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameid: gameid8 }),
    });
    bets = await bets.json();
    if (bets.length != 0)
      for (const bet of bets) {
       
        if (
          bet.type === "W" &&
          bet.bet === ["A", "B", "", "C"][response.winningHand]
        ) {
          if (bet.bet === "C") {
            await fetch(`${url}/api/transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: bet.userId,
                amount: bet.betAmount * 8,
                type: "deposit",
                remarks: "Baccarat std6 Winnings",
              }),
            });
          } else if (bet.type === "W" && bet.bet === "C") {
            await fetch(`${url}/api/transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: bet.userId,
                amount: bet.betAmount * 2,
                type: "deposit",
                remarks: "Baccarat std6 Winnings",
              }),
            });
          }
        } else if (bet.type === "S" &&  bet.bet === ["A", "B", "", "C","D","E"][response.winningHand]) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 3,
              type: "deposit",
              remarks: "Baccarat std6 Winnings",
            }),
          });
        } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 3,
              type: "deposit",
              remarks: "Baccarat std6 Winnings",
            }),
          });
        } else if (
          bet.type === "SF" &&
          bet.bet === dumdum(response.isStraightFlush)
        ) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 8,
              type: "deposit",
              remarks: "Baccarat std6 Winnings",
            }),
          });
        }
      }
  
    setTimeout(() => {
      gameid8 = uuidv4();
      broadcast6({ type: "game_start", gameid: gameid8 });
    }, 1000);
  }
  
  broadcast8({ type: "game_start", gameid: gameid6 });
  setInterval(dealCards8, 15000); // Deal cards every 15 seconds
  
  //////////////////


/////////////DTL//////////////////

function broadcast9(message) {
    clients10.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  async function dealCards9() {
    let chosen_cards = getRandomCards(deck_of_cards, 9);
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
      type: "deal",
      gameid: gameid,
      hands: chunked,
      isFlush: [isFlush(chunked[0]), isFlush(chunked[1])],
      isStraight: [isStraight(chunked[0]), isStraight(chunked[1])],
      isStraightFlush: [isStraightFlush(chunked[0]), isStraightFlush(chunked[1])],
      faceCardsCount: [countFaceCards(chunked[0]), countFaceCards(chunked[1])],
      winningHand: decideWinner3(chunked, "joke"),
    };
  
    function dumdum(d) {
      if (d[0]) return "A";
      else if (d[1]) return "B";
      else return "T";
    }
  
    broadcast9(response);
  
    let bets = await fetch(`${url}/api/poker8/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameid: gameid9 }),
    });
    bets = await bets.json();
    if (bets.length != 0)
      for (const bet of bets) {
       
        if (bet.type === "W" && bet.bet === ["A", "B",'','C'][response.winningHand]) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 2,
              type: "deposit",
              remarks: "DTL Winnings",
            }),
          });
        } else if (bet.type === "S" && bet.bet === dumdum(response.isStraight)) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 4,
              type: "deposit",
              remarks: "DTL Winnings",
            }),
          });
        } else if (bet.type === "F" && bet.bet === dumdum(response.isFlush)) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 3,
              type: "deposit",
              remarks: "DTL Winnings",
            }),
          });
        } else if (
          bet.type === "SF" &&
          bet.bet === dumdum(response.isStraightFlush)
        ) {
          await fetch(`${url}/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: bet.userId,
              amount: bet.betAmount * 8,
              type: "deposit",
              remarks: "DTL Winnings",
            }),
          });
        }
      }
  
    setTimeout(() => {
      gameid9 = uuidv4();
      broadcast9({ type: "game_start", gameid:gameid9 });
    }, 1000);
  }
  
  broadcast9({ type: "game_start", gameid:gameid9 });
  setInterval(dealCards9, 15000); // Deal cards every 15 seconds
  
  //////////////////



/////////////toss//////////////



function getnumber1() {
  return Math.floor(Math.random() * 2);
}

function broadcast10(message) {
  clients11.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function dealCards10() {
  let number = getnumber1();

  const response = {
    type: "deal",
    gameid: gameid10,
    number: number,
  };

  broadcast10(response);
  try {
    let bets = await fetch(url + "/api/toss/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameid: gameid10 }),
    });
    bets = await bets.json();
    console.log(bets);
    if (bets.length != 0)
      for (const bet of bets) {
        console.log(bet);
        try {
          switch (bet.type) {
            case "W":
               if (bet.bet === "A" && number === 0) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "HEADS & TAILS Winnings",
                  }),
                });
                
              } else if (bet.bet === "B" && number === 1) {
                await fetch(url + "/api/transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: bet.userId,
                    amount: bet.betAmount * 2,
                    type: "deposit",
                    remarks: "HEADS & TAILS Winnings",
                  }),
                });
              }
              break;

            }
        } catch (e) {
          console.log(e);
        }
      }
  } catch (e) {}

  setTimeout(() => {
    gameid10 = uuidv4();
    broadcast10({ type: "game_start", gameid:gameid10 });
  }, 1000);
}


setInterval(dealCards10, 30000); // Dea
///////







//////////////////////////////websocket////////////////////////////////////////////////////

const express = require("express");

const http = require("http");

// Create an Express app
const app = express();

// Create an HTTP server that will handle WebSocket connections
const server = http.createServer(app);
let url1 = require("url");
// Initialize WebSocket server with the HTTP server
const wss = new WebSocket.Server({ server });

// Define a simple broadcast mechanism for different query parameters (subdomain)
wss.on("connection", (ws, req) => {
  // Extract the query parameters from the URL
  const queryParams = url1.parse(req.url, true).query;
  const subdomain = queryParams.subdomain || "default"; // Default to 'default' if no subdomain is provided

  console.log(`Connection from subdomain: ${subdomain}`);

  // Define an interval that sends a message every 10 seconds

  // Send a different message based on the subdomain query parameter
  let message = "";

  if (subdomain === "crash") {
    clients1.push(ws);
    broadcast({ type: "game_start", gameId });
  } else if (subdomain === "poker1") {
    clients2.push(ws);
    broadcast1({ type: "game_start", gameid });
  } else if (subdomain === "roulette") {
    clients3.push(ws);
    broadcast2({ type: "game_start", gameid: gameid2 });
  } else if (subdomain === "poker2") {
    clients4.push(ws);
    broadcast3({ type: "game_start", gameid: gameId3 });
  } else if (subdomain === "poker3") {
    clients5.push(ws);
    broadcast4({ type: "game_start", gameid: gameid4 });
  } else if (subdomain === "poker4") {
    clients6.push(ws);
    broadcast5({ type: "game_start", gameid: gameid5 });
  }
  else if (subdomain === "poker5") {
    clients7.push(ws);
    broadcast6({ type: "game_start", gameid: gameid6 });
  }
  else if (subdomain === "poker6") {
    clients8.push(ws);
    broadcast7({ type: "game_start", gameid: gameid7 });
  }
  else if (subdomain === "poker7") {
    clients9.push(ws);
    broadcast8({ type: "game_start", gameid: gameid8 });
  }
  else if (subdomain === "poker8") {
    clients10.push(ws);
    broadcast9({ type: "game_start", gameid: gameid9 });
  }
  else if (subdomain === "toss") {
    clients11.push(ws);
    broadcast10({ type: "game_start", gameid: gameid10 });
  }
  // Send the message to the client

  // Listen for messages from the client
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    if (data.type === "cashout") {
      // Handle bet logic

      const res1 = await fetch(url+"/api/auth/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token, gameid: data.gameId }),
      });
      const data1 = await res1.json();

      bet = data1.bet;
     
      const res2 = await fetch(url+"/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: data.userId,
          amount: bet * multiplier,
          type: "deposit",
          remarks: "Crash Winnings",
        }),
      });
      await res2.json().then((data) => {
        broadcast({ type: "balance", balance: data.balance });
      });

      // Select all players from crashBetsDb2 who have the same game ID
      const players = await transactdb.crashBetsDb
        .prepare("SELECT * FROM crashBets WHERE gameId = ?")
        .all(data.gameId);
      players.forEach(async (player) => {
        const winnings = player.betAmount * multiplier;
        await db.updateOne(
          { userId: player.userId },
          { $inc: { balance: winnings } }
        );

      });
    }
  });

  // Handle connection close (clear the interval)
  ws.on("close", () => {
    if (subdomain === "crash") {
      clients1 = clients1.filter((client) => client.ws !== ws);
    } else if (subdomain === "poker1") {
      clients2 = clients2.filter((client) => client.ws !== ws);
    } else if (subdomain === "roulette") {
      clients3 = clients3.filter((client) => client.ws !== ws);
    } else if (subdomain === "poker2") {
      clients4 = clients4.filter((client) => client.ws !== ws);
    } else if (subdomain === "poker3") {
      clients5 = clients5.filter((client) => client.ws !== ws);
    } else if (subdomain === "poker4") {
      clients6 = clients6.filter((client) => client.ws !== ws);
    }
    else if (subdomain === "poker5") {
        clients7 = clients7.filter((client) => client.ws !== ws);
      }
      else if (subdomain === "poker6") {
        clients8 = clients8.filter((client) => client.ws !== ws);
      }
      else if (subdomain === "poker7") {
        clients9 = clients9.filter((client) => client.ws !== ws);
      }
      else if (subdomain === "poker8") {
        clients10 = clients10.filter((client) => client.ws !== ws);
      }
      else if (subdomain === "toss") {
        clients11 = clients11.filter((client) => client.ws !== ws);
      }
    console.log(`Connection closed for subdomain: ${subdomain}`);
  });

  // Optionally handle errors
  ws.on("error", (error) => {
    console.log(`Error with WebSocket connection: ${error.message}`);
  });
});

// Start the HTTP server to listen for requests
server.listen(port, () => {
  console.log("Server is running on ws://localhost:8080");
});
