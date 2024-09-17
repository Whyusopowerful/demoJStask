//Непосредственно логика программы
function goField(){
    //set the player name
    document.querySelectorAll('.current-player').forEach(name => name.textContent = playerName.value);
    //TOGGLE
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    //add the gamefield
    field.style.display = 'flex';

    // if(bestPlayer.bestPoints >= 5){
    //     bestPlayerStats.textContent = `Best player: ${bestPlayer.bestName} ${bestPlayer.bestPoints} points`;
    // }

    console.log('Game starts! Good luck '+playerName.value);

    //function that calls a spawnFruit function and counting the time
    countdown();
}

function countdown(){
    //display timeleft
    let timer = setInterval(()=>{
        console.log(timeLeft)
        //calculate timeleft
        const minutes = Math.floor(timeLeft/60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? "0"+seconds:seconds;
        if(timeLeft > 0){
            spawnFruits();
        }
        if(timeLeft<=0){
            clearInterval(timer);
            goResult();
        }
        document.querySelector('#timer').textContent = timeLeft === 60 ? '01:00' : `0${minutes}:${seconds}`;
        timeLeft = timeLeft-1;

    },1000);
    
}

function spawnFruits(){
    let fruitsPull = [];
    //creating needed amount of elements
    while(fruitsPull.length<4){
        let fruit = document.createElement('div');
        fruitsPull.push(setFruit(getRandom(0,4), fruit));
    }

    //add elements to gameField
    for(el of fruitsPull) field.append(el);

    //add trap to gameField
    field.append(createTrap());
}

function goMenu(){
    clearField();
    points = 0;
    playerScore.textContent = points;
    startScreen.style.display= 'flex';
    console.log('The menu enters!');
    gameScreen.style.display = 'none';
  
}

function goResult(){
    timeLeft = 0
    clearField();


    resultScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    saveScore();
}

function saveScore(){
    let currentPlayerName = playerName.value;

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


function getRandom(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}



function createTrap(){
    //creating a trap
    let trap = document.createElement('div');
    trap.className = 'ball';

    //positioning trap and set the lifetime
    trap.style.top= getRandom(300,680)+'px';
    trap.style.left = getRandom(480,1400)+'px';
    setInterval(() => trap.remove(), 1000);
    
    //trap logic
    trap.onclick = () =>{
        trap.remove();
        goResult();
    };

    return trap;
}

function setFruit(current, fruit){
    //list of fruits
    let fruits = ['lemon', 'apple', 'plum', 'orange', 'pear'];
    let cost = [10, 10, 5, 15, 15 ];
    //creating 
    //fruit = document.createElement('div');
    fruit.className = fruits[current];
    fruit.value = cost[current];

    //positioning 
    fruit.style.top= getRandom(300,680)+'px';
    fruit.style.left = getRandom(480,1400)+'px';

    //set delete time
    switch(current){
        case 2: setInterval(()=>fruit.remove(), 1500); break;
        default: setInterval(()=>fruit.remove(), 1000); break;
    }

    //fruit logic
    fruit.onclick = () => {
        fruit.remove();
        updateScore(fruit.value);
    }

    return fruit;
}

function updateScore(count){
    playerScore.textContent = parseInt(playerScore.textContent)+count; 
}

let points = 0;
let stats = [];
let players = [];
let timeLeft = 60;
let bestPlayer={};




//Переменные, которые выступают в роли получаетелей всех элементов, к которым хотим обратиться
const startScreen = document.querySelector('.startScreen');
const gameScreen = document.querySelector('.gameScreen');
const resultScreen = document.querySelector('.resultScreen');
const startGame = document.querySelector('#start-game');
const playerName = document.querySelector('#playerName');
const field = document.querySelector('.gameField');
const playerScore = document.querySelector('#playerScore');
const playAgain = document.querySelector('#restartRes');
const clearButton = document.querySelector('#clear');
//const timer = document.querySelector('#timer');
const leaderboardList = document.querySelector('#leaderboard-list');
const bestPlayerStats = document.querySelector('#best-player');
playerScore.textContent = points;

//Прослушка событий
//Навешиваются на кнопки, чтобы вызывать методы.


//checking fill name
document.querySelector('#playerName').addEventListener('input', ()=>{
    startGame.disabled = (playerName.value ==='');
    startGame.onclick = ()=>{
        
        goField();
    } 
})

document.querySelector('#restart').onclick = () =>{
    goMenu();
    document.querySelector('#playerName').value = '';
    startGame.disabled = true;
};
//******

playAgain.addEventListener('click', goReplay);


