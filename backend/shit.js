
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
    console.log(nc)
    return 
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