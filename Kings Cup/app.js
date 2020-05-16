var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));
serv.listen(2000);

console.log('Server Running.......')

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
var letsGoFlag = 1;
var startFlag = 0;
var newCardFlag = 0;
var playerArray;
var playerObj;
var cardStackCount = 0;
var currIndex = 0;
var UpdateTurnFlag =1;
var WhosTurn = 0;
var circleBreaker = "";

playerArray = [];
cardArray = [];
deck = [];

var LossCount = 52;
var isGameOver = 0;
var Loser = "";
var closeToPop = 0;
var circleBroke = 0;

class Player {
    constructor(id) {
      this.id = id;
      //BOOL
      this.isTurn = 0;
    }
  }

  class Card {
    constructor(name, image,suit,value) {
        this.name = name;
        this.image = image;
        this.suit = suit; // 1 for Spade 2 for club 3 for heart 4 for diamond
        this.value = value; //Ace = 6 , king = 5 ....

        //BOOL
        this.inDeck = 1; 
        this.isUsed = 0;
    }


}


function cardSetup(){

       
    //SPADES
    cardArray[0] = new Card("Ace of Spades"  ,"client/Assets/JPEG/AS.jpg",1, "Waterfall");
    cardArray[1] = new Card("King of Spades" ,"client/Assets/JPEG/KS.jpg",1, "Make a Rule");
    cardArray[3] = new Card("Queen of Spades","client/Assets/JPEG/QS.jpg",1, "Question Master");
    cardArray[2] = new Card("Jack of Spades" ,"client/Assets/JPEG/JS.jpg",1, "Never Have I Ever ...");
    cardArray[4] = new Card("Ten of Spades"  ,"client/Assets/JPEG/10S.jpg",1,"Categories");
    cardArray[5] = new Card("Nine of Spades" ,"client/Assets/JPEG/9S.jpg",1, "Rhyme");
    cardArray[6] = new Card("Eight of Spades" ,"client/Assets/JPEG/8S.jpg",1,"Mate");
    cardArray[7] = new Card("Seven of Spades" ,"client/Assets/JPEG/7S.jpg",1,"Heaven");
    cardArray[8] = new Card("Six of Spades"   ,"client/Assets/JPEG/6S.jpg",1,"Thumb Master");
    cardArray[9] = new Card("Five of Spades"  ,"client/Assets/JPEG/5S.jpg",1,"Social");
    cardArray[10] = new Card("Four of Spades" ,"client/Assets/JPEG/4S.jpg",1,"Give 2 Take 2");
    cardArray[11] = new Card("Three of Spades","client/Assets/JPEG/3S.jpg",1,"Me (Take a drink!)");
    cardArray[12] = new Card("Two of Spades"  ,"client/Assets/JPEG/2S.jpg",1,"You (Give a drink)");

    //CLUBS
    cardArray[13] = new Card("Ace of Clubs"  ,"client/Assets/JPEG/AC.jpg",2, "Waterfall");
    cardArray[14] = new Card("King of Clubs" ,"client/Assets/JPEG/KC.jpg",2, "Make a Rule");
    cardArray[15] = new Card("Queen of Clubs","client/Assets/JPEG/QC.jpg",2, "Question Master");
    cardArray[16] = new Card("Jack of Clubs","client/Assets/JPEG/JC.jpg",2, "Never Have I Ever ...");
    cardArray[17] = new Card("Ten of Clubs"  ,"client/Assets/JPEG/10C.jpg",2,"Categories");
    cardArray[18] = new Card("Nine of Clubs" ,"client/Assets/JPEG/9C.jpg",2, "Rhyme");
    cardArray[19] = new Card("Eight of Clubs" ,"client/Assets/JPEG/8C.jpg",2,"Mate");
    cardArray[20] = new Card("Seven of Clubs" ,"client/Assets/JPEG/7C.jpg",2,"Heaven");
    cardArray[21] = new Card("Six of Clubs"   ,"client/Assets/JPEG/6C.jpg",2,"Thumb Master");
    cardArray[22] = new Card("Five of Clubs"  ,"client/Assets/JPEG/5C.jpg",2,"Social");
    cardArray[23] = new Card("Four of Clubs"  ,"client/Assets/JPEG/4C.jpg",2,"Give 2 Take 2");
    cardArray[24] = new Card("Three of Clubs" ,"client/Assets/JPEG/3C.jpg",2,"Me (Take a drink!)");
    cardArray[25] = new Card("Two of Clubs"   ,"client/Assets/JPEG/2C.jpg",2,"You (Give a drink)");

    //HEARTS
    cardArray[26] = new Card("Ace of Hearts"  ,"client/Assets/JPEG/AH.jpg",3, "Waterfall");
    cardArray[27] = new Card("King of Hearts" ,"client/Assets/JPEG/KH.jpg",3, "Make a Rule");
    cardArray[28] = new Card("Jack of Hearts" ,"client/Assets/JPEG/JH.jpg",3, "Never Have I Ever ...");
    cardArray[29] = new Card("Queen of Hearts","client/Assets/JPEG/QH.jpg",3, "Question Master");
    cardArray[30] = new Card("Ten of Hearts"  ,"client/Assets/JPEG/10H.jpg",3,"Categories");
    cardArray[31] = new Card("Nine of Hearts" ,"client/Assets/JPEG/9H.jpg",3, "Rhyme");
    cardArray[32] = new Card("Eight of Hearts" ,"client/Assets/JPEG/8H.jpg",3,"Mate");
    cardArray[33] = new Card("Seven of Hearts" ,"client/Assets/JPEG/7H.jpg",3,"Heaven");
    cardArray[34] = new Card("Six of Hearts"   ,"client/Assets/JPEG/6H.jpg",3,"Thumb Master");
    cardArray[35] = new Card("Five of Hearts"  ,"client/Assets/JPEG/5H.jpg",3,"Social");
    cardArray[36] = new Card("Four of Hearts"  ,"client/Assets/JPEG/4H.jpg",3,"Give 2 Take 2");
    cardArray[37] = new Card("Three of Hearts" ,"client/Assets/JPEG/3H.jpg",3,"Me (Take a drink!)");
    cardArray[38] = new Card("Two of Hearts"   ,"client/Assets/JPEG/2H.jpg",3,"You (Give a drink)");

    //DIAMONDS
    cardArray[39] = new Card("Ace of Diamonds"  ,"client/Assets/JPEG/AD.jpg", 4,"Waterfall");
    cardArray[40] = new Card("King of Diamonds" ,"client/Assets/JPEG/KD.jpg", 4,"Make a Rule");
    cardArray[41] = new Card("Jack of Diamonds" ,"client/Assets/JPEG/JD.jpg", 4,"Never Have I Ever ...");
    cardArray[42] = new Card("Queen of Diamonds","client/Assets/JPEG/QD.jpg", 4,"Question Master");
    cardArray[43] = new Card("Ten of Diamonds"  ,"client/Assets/JPEG/10D.jpg",4,"Categories");
    cardArray[44] = new Card("Nine of Diamonds" ,"client/Assets/JPEG/9D.jpg", 4,"Rhyme");
    cardArray[45] = new Card("Eight of Diamonds" ,"client/Assets/JPEG/8D.jpg",4,"Mate");
    cardArray[46] = new Card("Seven of Diamonds" ,"client/Assets/JPEG/7D.jpg",4,"Heaven");
    cardArray[47] = new Card("Six of Diamonds"   ,"client/Assets/JPEG/6D.jpg",4,"Thumb Master");
    cardArray[48] = new Card("Five of Diamonds"  ,"client/Assets/JPEG/5D.jpg",4,"Social");
    cardArray[49] = new Card("Four of Diamonds"  ,"client/Assets/JPEG/4D.jpg",4,"Give 2 Take 2");
    cardArray[50] = new Card("Three of Diamonds" ,"client/Assets/JPEG/3D.jpg",4,"Me (Take a drink!)");
    cardArray[51] = new Card("Two of Diamonds"   ,"client/Assets/JPEG/2D.jpg",4,"You (Give a drink)");




    if ((cardArray.length) != 52)
    {
        console.log("Error setting up cards");
    }

}

function shuffleDeck(cards)
{
    usedIndex = [];
    deck = [];
    var openIndex;
    var cardIndex;
    var UnopenIndexFlag;

    for (var i in cards)
    {
        openIndex = 0;
        UnopenIndexFlag = 0;
        cardIndex = Math.floor(Math.random() * 52) + 0;

        while(openIndex == 0)
        {
            for (var j in usedIndex)
            {
                if (cardIndex == usedIndex[j])
                {
                    UnopenIndexFlag = 1;
                }
            }
            if (!UnopenIndexFlag)
            {
                openIndex = 1; 
            }
            else
            {
                cardIndex = Math.floor(Math.random() * 52) + 0;
                UnopenIndexFlag = 0;
            }
        } 
        deck[cardIndex] = cards[i];
        usedIndex.push(cardIndex);
    }

    if (deck.length != 52){

        console.log("Error in shuffle!");
        console.log(deck);
        console.log("Error in shuffle!");
    }
    else 
    {
        //console.log(deck);
    }

}


function assignTurn(players)
{
    players[0].isTurn = 1

    // set loss number 
    LossCount =  cardIndex = Math.floor(Math.random() * 20) + 25;
    console.log(LossCount);
}


function evaluateLoss(name)
{   
    if (cardStackCount >= LossCount)
    {
        isGameOver = 1;
        Loser = name;
        newCardFlag = -1;
    }
    if ((cardStackCount + 10) >= LossCount)
    {
        closeToPop = 2;
        return;
    }
    if ((cardStackCount + 20) >= LossCount)
    {
        closeToPop = 1;
    }

    if (((cardStackCount + 15) >= LossCount) && (!circleBroke))
    {
        closeToPop = 15;
        circleBroke = 1;
        if (circleBreaker == "")
        {
            circleBreaker = name;
            console.log('Circle Broke' + circleBreaker);
        }
     
    }

}



io.sockets.on('connection',function(socket){
    console.log('socket connection');

    socket.id = Math.random();
    socket.player = 0;
    SOCKET_LIST[socket.id] = socket;
    socket.connected = 1;

    console.log('socket connection id' + socket.id);

    socket.emit('SockInfo',{data: socket.id});


    socket.on('connectMe', function(player){
        console.log('Data recieved from client' + player.name + player.id );

        playerObj = new Player(player.name);
        playerArray.push(playerObj);


        for (var i in SOCKET_LIST){

            var socket = SOCKET_LIST[i];
            if (socket.id == player.id)
            { 
                socket.player = playerObj;
            }
    
        }       
     
    });

    socket.emit('ServerMsg',{data: " here is The Server"});

    socket.on('call',function(call){
          
        if (call.call){
            currIndex = (currIndex + 1) % 52;
          
            var index = 0;
            for (var j in playerArray)
            {   
                if (playerArray[j].isTurn ){ 
                    playerArray[j].isTurn = 0;
                    index = j; 
                }
            }
            index++;
            if (index > (playerArray.length - 1))
            {
                index = 0;
            }
            playerArray[index].isTurn = 1;
        }
        
        cardStackCount += call.count;
        console.log("Card Count" + cardStackCount);
        evaluateLoss( call.name);
        newCardFlag = 0;
        UpdateTurnFlag = 1;
    });


    socket.on('draw',function(dataVar){
          
        newCardFlag = 1;
    });

});




setInterval(function(){
    for (var i in SOCKET_LIST){

        var socket = SOCKET_LIST[i];

        if (socket.connected)
        {
            socket.emit('Start',{name:socket.player.id});
        }

        /*
        if (socket.disconnected)
        {
            for (var l in playerArray)
            {
                if (socket.player.id == playerArray[l].id)
                {
                    console.log("SOCKET DISCONNECTED" + playerArray[l].id);
                    playerArray.splice(l,1);

                }
            }
        }
*/
        if (socket.player.isTurn && UpdateTurnFlag){
            WhosTurn = socket.player.id;
            socket.emit('Pass_Call',{data:0});
            UpdateTurnFlag = 0;
            
        }
        

        if (playerArray.length > 1  && letsGoFlag){
            
            letsGoFlag = 0;

            cardSetup();
            shuffleDeck(cardArray);
            assignTurn(playerArray) ;  
           
            startFlag = 1;
            
            //socket.emit('UpdateCard',{data:deck[currIndex]});     
           
        }

        if (playerArray.length > 1 && startFlag)
        {
            //console.log("Updating Card with the " + deck[currIndex].name + deck[currIndex].value  ) ;
            if (newCardFlag)
            {
                socket.emit('UpdateCard',{data:deck[currIndex].image, card:deck[currIndex].name,desc:deck[currIndex].value, count:closeToPop, turn:WhosTurn, breaker:circleBreaker });
            }
            if (newCardFlag == 0)
            {
                socket.emit('UpdateCard',{data:"client/Assets/JPEG/Green_back.jpg", card:"?????", desc:"?????", count:closeToPop, turn:WhosTurn, breaker:circleBreaker});
            }

        }

        

        if (isGameOver)
        {
            socket.emit('Loser',{name:Loser});

        }
        


    }



},1000/23);