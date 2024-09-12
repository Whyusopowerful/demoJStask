
//Непосредственно логика программы
function goField(){
    let playerName = place.value;

    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    document.querySelector('#playerName').textContent = playerName;
    
    field.style.display = 'flex';

    if(bestPlayer.bestPoints >= 5){
        bestPlayerStats.textContent = `Best player: ${bestPlayer.bestName} ${bestPlayer.bestPoints} points`;
    }

    

    console.log('Game starts! Goodluck '+playerName);


    playTime = setInterval(() =>{
        countdown();
        if(timeLeft === -2){
            goResult();
        }
    },1000)
    spawnItems = setInterval(() =>{//придумать, как доделать логику отключения выполнения функции
        // spawn();
        for(let i = 0; i<4; i++){
            spawnFruits();
        }
        
    },1000);   
}

function goMenu(){
    clearField();
    stopSpawn();
    clearTimer();
    points = 0;
    playerScore.textContent = points;
    startScreen.style.display= 'flex';
    console.log('The menu enters!');
    gameScreen.style.display = 'none';
  
}

function goResult(){

    clearField();
    stopSpawn();
    clearTimer();
    
    

    resultScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    saveScore();
}

function saveScore(){
    let currentPlayerName = place.value;

    stats.push(points);
    players.push(currentPlayerName);

    for(let i = 0; i<stats.length; i++){
        if(points >= stats[i]){
            stats.splice(i,0,points);
            players.splice(i,0,currentPlayerName);
            break;
        }
    }

    for(let i = 0; i<stats.length; i++){
        if(points === stats[i]){
            stats.splice(i-1,1);
            players.splice(i-1,1);
            break;
        }
    }
    

    console.log(`its size: ${stats.length}`);

    bestPlayer.bestName = players[0];
    bestPlayer.bestPoints = stats[0];

    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('stats', JSON.stringify(stats));

   
    
    addToLeaderboard();

    
}

function addToLeaderboard(){
    
    players = JSON.parse(localStorage.getItem('players')) || [];
    stats = JSON.parse(localStorage.getItem('stats')) || [];
    clearStats();
    for(let i = 0; i<10; i++){
        if(i>stats.length-1){
            break;
        }
        let li = document.createElement('li');
        leaderboardList.append(li);
        li.textContent = players[i] + ' ' + stats[i];
    }
}

    


function goReplay(){
    points = 0;
    playerScore.textContent = points;
    startScreen.style.display = 'flex';
    resultScreen.style.display = 'none';
}

function clearField(){
    field.querySelectorAll('div').forEach(elem => elem.remove());
}

function clearStats(){
    leaderboardList.querySelectorAll('li').forEach(el => el.remove());
}



function countdown(){
    const minutes = Math.floor(timeLeft/60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0"+seconds:seconds;
    timer.textContent = `0${minutes}:${seconds}`
    timeLeft--;
}

function clearTimer(){
    clearInterval(playTime);
    timer.textContent = '01:00';
    timeLeft = 60;    
}

function stopSpawn(){
    clearInterval(spawnItems);
}


function getRandom(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// function spawn(){
//     let ball = document.createElement('div');

//     ball.className = 'ball';

//     ball.style.top = getRandom(300,680)+'px';
//     ball.style.left = getRandom(480,1400)+'px';

    
//     field.append(ball);

    
//     ball.addEventListener('click', (ev) =>{
//         ev.target.remove();
//         goResult();
//     })

//     setInterval(() => ball.remove(),1000);
    
// }



function spawnFruits(){

    let fruitsPull = [];
    let fruit = document.createElement('div');

    while(fruitsPull.length<4){
        //creating 
        
        let current = getRandom(0,4);
        fruit.className = fruits[current];
        fruit.setAttribute('value', cost[current]); 

        //positioning and push element into gamefield
        fruit.style.top= getRandom(300,680)+'px';
        fruit.style.left = getRandom(480,1400)+'px';
        // field.append(fruit);
        fruitsPull.push(fruit);
    }
    

    //creating a trap
    let trap = document.createElement('div');
    trap.className = 'ball';

    //positioning and push trap into gamefield
    trap.style.top= getRandom(300,680)+'px';
    trap.style.left = getRandom(480,1400)+'px';
    field.append(trap);
    
    //trap logic
    trap.onclick = () =>{
        trap.remove();
        goResult();
    };


    fruit.addEventListener('click', (ev) =>{
        ev.target.remove();
        points+=parseInt(ev.target.getAttribute('value'));
        playerScore.textContent = points;
    });

    switch(current){
        case 2: setInterval(()=>fruit.remove(), 1500); break;
        default: setInterval(()=>{fruit.remove(); trap.remove()}, 1000); break;
    }
    
}



let points = 0;
let fruits = ['lemon', 'apple', 'plum', 'orange', 'pear'];
let cost = [10, 10, 5, 15, 15 ];
let timeLeft = 60;
let spawnItems;
let playTime;
let stats = [];
let players = [];

let bestPlayer={};




//Переменные, которые выступают в роли получаетелей всех элементов, к которым хотим обратиться
const startScreen = document.querySelector('.startScreen');
const gameScreen = document.querySelector('.gameScreen');
const resultScreen = document.querySelector('.resultScreen');
const startGame = document.querySelector('#start-game');

const field = document.querySelector('.gameField');
const playerScore = document.querySelector('#playerScore');

const playAgain = document.querySelector('#restartRes');
const clearButton = document.querySelector('#clear');
const timer = document.querySelector('#timer');
const leaderboardList = document.querySelector('#leaderboard-list');
const bestPlayerStats = document.querySelector('#best-player');
playerScore.textContent = points;

//Прослушка событий
//Навешиваются на кнопки, чтобы вызывать методы.


//*****
const place = document.querySelector('#place');

place.addEventListener('input', ()=>{
    startGame.disabled = (place.value ==='');
    startGame.onclick = goField;
})

document.querySelector('#restart').onclick = () =>{
    goMenu();
    place.value = '';
    startGame.disabled = true;
};
//******

playAgain.addEventListener('click', goReplay);


