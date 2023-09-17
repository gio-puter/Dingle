import { sixletterwords } from "./sixletterwords.js";

window.isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase()); // BOOLEAN — MOBILE
let timeoutID = 0;
const length = 6; // LENGTH OF SECRET WORD
const guesses = []; // GUESS ARRAY
const now = Date.now();
const today = Math.floor(now / 86400000);
const initDay = 19513;
const secretWord = sixletterwords[today - initDay]; // PUZZLE NUMBER
const info = "Welcome to Dingle — a word guessing game. Each guess must be a 6-letter word that will be compared against the secret word to see how many common letters they have. For example, a guess ('ponies') against a secret word ('scolds') would yield 2 similar letters. You have unlimited guesses. Enjoy..."; // INTRO INFO
const storage = localStorage;
let inPlay = false;
/* STORE
    DICTIONARY {
        LONG-TERM
            gamesPlayed: int (0)
            lastPlay: int (today)
            wins: int (0)
            best_game: int (N/A)
            average: int (N/A)
            streak: int (0)
            longest_streak: int (0)
            totalGuesses: int (0)
        SHORT-TERM
            todayWin: bool (false)
            guesses: array ([])
            html: <main> <main> (N/A)
            lines: int (0)
    }
    
    hasPlayed: bool (false)
*/

// INITIALIZE WEBPAGE
export function init() {


  //    1. If Has Played Today, 
  //    2. If Has Played, But Not Today,
  //    3. If Has Not Played

  if (storage['hasPlayed']) { // HAS PLAYED
    const dict = JSON.parse(storage['userStats']);

    if (dict.lastPlay == today) { // TODAY, PRESENT SAVED GAME PROGRESS
      // console.log(dict);
      document.getElementsByTagName('main')[0].innerHTML = dict.html;
      guesses.push(...dict.guesses);
    } else { // NOT TODAY, ADJUST STORAGE AND PRESENT GAME BEGINNING
      dict.gamesPlayed += 1;
      if (dict.lastPlay != today - 1 || !dict.todayWin) {
        dict.streak = 0;
      }
      dict.lastPlay = today;
      dict.todayWin = false;
      dict.guesses = [];
      dict.lines = 0;
      dict.html = `<div class="info">${info}</div><div class="userInput"><span class="userArrow">&gt;&gt;&nbsp;</span><span class="answer"></span><span class="cursor">«◊»</span></div>`;

      storage['userStats'] = JSON.stringify(dict);

      // CREATE DIV INFO INTRO
      createDivInfo();
    }
  } else { // NEVER PLAYED BEFORE, CREATE STORAGE AND PRESENT GAME BEGINNING
    storage['hasPlayed'] = true;
    const dict = {
      gamesPlayed: 1,
      lastPlay: today,
      todayWin: false,
      wins: 0,
      best_game: 'N/A',
      average: 'N/A',
      streak: 0,
      longest_streak: 0,
      guesses: [],
      totalGuesses: 0,
      lines: 0,
      html: `<div class="info">${info}</div><div class="userInput"><span class="userArrow">&gt;&gt;&nbsp;</span><span class="answer"></span><span class="cursor">«◊»</span></div>`,
    }

    storage['userStats'] = JSON.stringify(dict);

    // CREATE DIV INFO INTRO
    createDivInfo();
  }
}

function createDivInfo() {
  let div = document.createElement('div');
  div.className = 'info'

  let spanText = document.createElement('span');
  let spanCursor = document.createElement('span');
  spanCursor.className = 'cursor';
  spanCursor.textContent = "«◊»";

  div.appendChild(spanText);
  div.appendChild(spanCursor);

  document.getElementsByTagName('main')[0].appendChild(div);

  let i = 0;
  let speed = 75;

  // TYPEWRITE INFO
  function typeWriter() {
    if (i < info.length) { // START TYPEWRITE
      spanText.textContent += info.charAt(i);
      i++;
      timeoutID = setTimeout(typeWriter, speed);
    } else { // END TYPEWRITE, PROMPT USER
      document.getElementsByClassName('cursor')[0].remove();
      userPrompt();
      if (window.isMobile) { // ADD TYPE INPUT FOR MOBILE USERS
        let div = document.createElement('div');
        div.className = 'mobileCompatibility'

        let divBox = document.createElement('div');
        divBox.className = 'inputBox';
        divBox.textContent = "[ Tap Here to Type ]";
        let inputArea = document.createElement('input');
        inputArea.className = 'inputArea';
        inputArea.setAttribute('placeholder', 'Click Here to Type');
        inputArea.setAttribute('type', 'text');

        div.appendChild(divBox);
        div.appendChild(inputArea);

        document.getElementsByTagName('main')[0].appendChild(div);


        const dict = JSON.parse(storage['userStats']);
        dict.html = document.getElementsByTagName('main')[0].innerHTML;
        storage['userStats'] = JSON.stringify(dict);
      }
    }
  }

  typeWriter();
}

// SKIP INFO INTRO
export function stopInfo() {
  // STOP TYPEWRITE
  clearTimeout(timeoutID);
  timeoutID = 0;
  document.getElementsByClassName('info')[0].textContent = info;

  // PROMPT USER
  userPrompt();
  // ADD TYPE INPUT FOR MOBILE USERS
  if (window.isMobile) {
    let div = document.createElement('div');
    div.className = 'mobileCompatibility'

    let divBox = document.createElement('div');
    divBox.className = 'inputBox';
    divBox.textContent = "[ Tap Here to Type ]";
    let inputArea = document.createElement('input');
    inputArea.className = 'inputArea';
    inputArea.setAttribute('placeholder', 'Click Here to Type');
    inputArea.setAttribute('type', 'text');

    div.appendChild(divBox);
    div.appendChild(inputArea);

    document.getElementsByTagName('main')[0].appendChild(div);

    const dict = JSON.parse(storage['userStats']);
    dict.html = document.getElementsByTagName('main')[0].innerHTML;
    storage['userStats'] = JSON.stringify(dict);
  }
}

// CHECK IF INPUT IS VALID AND DO APPROPRIATE ACTION
export function checkInput(word, input) {

  //    console.log(input);

  //    console.log("INPLAY:", inPlay);

  let validChar = (input.replace(/\s+/g, '').length === 1);

  if (input === 'Backspace') { // BACKSPACED
    console.log("Is backspaced");
    return [0, wordBackspaced(word)];
  } else if (input === 'Enter' && word.replace(/\s+/g, '') != "") { // ENTERED
    console.log("Is entered");
    wordEntered(word.toLowerCase());
    return [1, word];
  } else if (validChar) { // LETTER
    return [0, word + input];
  } else { // EXTRANEOUS INPUT
    return [0, word];
  }

}

// INPUT = BACKSPACE
function wordBackspaced(word) {
  return word.substring(0, word.length - 1);
}

// INPUT = ENTER
async function wordEntered(word) {
  // REMOVE CURSOR IF EXISTS
  if (document.getElementsByClassName('cursor')[0]) {
    document.getElementsByClassName('cursor')[0].remove();
  }

  //    console.log("inPlay:", inPlay);

  // INTERACT WITH ENTERED WORD
  if (word === secretWord) { // ACTION — WIN RESPONSE
    guesses.push(word);
    winResponse(word);
  } else {
    //        console.log("inPlaySecond:", inPlay);
    if (guesses.includes(word)) { // ACTION — ERROR — ALREADY GUESSED
      retryResponse(word, "Already guessed");
    } else if (await checkWord(word)) { // ACTION — WORD EXISTS
      if (validWord(word)) { // ACTION — GUESS HAS VALID LENGTH
        guesses.push(word);
        let numSimilar = compareWord(word);
        guessResponse(word, numSimilar);
      } else { // ACTION - ERROR — INAPPROPRIATE LENGTH
        retryResponse(word, `Needs to be ${length} letters long`);
      }
    } else { // ACTION - ERROR — INVALID GUESS
      retryResponse(word, "Needs to be an actual word");
    }
  }

  inPlay = false;

}

// RETRY w/ ERROR RESPONSE
function retryResponse(word, error) { // vary response based on reason why invalid
  // CREATE DIV RESPONSE
  let div = document.createElement('div');
  div.className = 'retryResponse'

  let spanArrow = document.createElement('span');
  spanArrow.textContent = ">>\u00A0";
  let spanText = document.createElement('span');
  let spanCursor = document.createElement('span');
  spanCursor.className = 'cursor';
  spanCursor.textContent = "«◊»";

  div.appendChild(spanArrow);
  div.appendChild(spanText);
  div.appendChild(spanCursor);

  // ADJUSTMENTS IN MAIN
  if (window.isMobile) { // IF ON MOBILE, INSERT BEFORE TYPE INPUT
    let mobile = document.getElementsByClassName('mobileCompatibility')[0];
    document.getElementsByTagName('main')[0].insertBefore(div, mobile);
    mobile.children[1].value = "";
  } else { // IF NOT, CAN JUST ADD TO END
    document.getElementsByTagName('main')[0].appendChild(div);
  }

  let i = 0;
  let response = "Invalid guess." + " " + error;
  let speed = 75;

  // TYPEWRITE RETRY RESPONSE
  function typeWriter() {
    if (i < response.length) { // START TYPEWRITE
      spanText.textContent += response.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else { // END TYPEWRITE, REMOVE CURSOR + USER PROMPT
      document.getElementsByClassName('cursor')[0].remove();
      userPrompt();

      // UPDATE STORAGE HTML
      const dict = JSON.parse(storage['userStats']);
      dict.html = document.getElementsByTagName('main')[0].innerHTML;
      dict.lines += 1;
      storage['userStats'] = JSON.stringify(dict);
    }
  }

  typeWriter();
}

// VALID GUESS RESPONSE
function guessResponse(word, numSimilar) {
  // HANDLE STORAGE
  const dict = JSON.parse(storage['userStats']);
  dict.guesses.push(word);
  // console.log(dict.html)
  storage['userStats'] = JSON.stringify(dict);

  // CREATE DIV RESPONSE
  let div = document.createElement('div');
  div.className = 'guessResponse'

  let spanArrow = document.createElement('span');
  spanArrow.textContent = ">>\u00A0";
  let spanText = document.createElement('span');
  let spanCursor = document.createElement('span');
  spanCursor.className = 'cursor';
  spanCursor.textContent = "«◊»";

  div.appendChild(spanArrow);
  div.appendChild(spanText);
  div.appendChild(spanCursor);

  // ADJUSTMENTS IN MAIN
  if (window.isMobile) { // IF ON MOBILE, INSERT DIV BEFORE TYPE INPUT
    let mobile = document.getElementsByClassName('mobileCompatibility')[0];
    document.getElementsByTagName('main')[0].insertBefore(div, mobile);
    mobile.children[1].value = "";
  } else { // IF NOT, CAN JUST ADD DIV TO END
    document.getElementsByTagName('main')[0].appendChild(div);
  }

  let i = 0;
  let response = `Similar letters: ${numSimilar}`;
  let speed = 75;

  // TYPEWRITE RETRY RESPONSE
  function typeWriter() {
    if (i < response.length) { // START TYPEWRITE
      spanText.textContent += response.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else { // END TYPEWRITE, REMOVE CURSOR + USER PROMPT
      document.getElementsByClassName('cursor')[0].remove();
      userPrompt();
      // UPDATE STORAGE HTML
      const dict = JSON.parse(storage['userStats']);
      dict.html = document.getElementsByTagName('main')[0].innerHTML;
      dict.lines += 1;
      // console.log(dict.html)
      storage['userStats'] = JSON.stringify(dict);
    }
  }

  typeWriter();

}

// WIN RESPONSE
function winResponse(word) {
  // HANDLE STORAGE
  const dict = JSON.parse(storage['userStats']);
  // console.log(dict);
  dict.todayWin = true;
  dict.guesses.push(word);
  dict.wins += 1;
  dict.streak += 1;
  dict.lines += 1;
  dict.totalGuesses += dict.guesses.length;
  dict.average = (dict.totalGuesses / dict.wins).toFixed(2);

  if (dict.best_game == 'N/A' || dict.guesses.length < dict.best_game) {
    dict.best_game = dict.guesses.length;
  }
  if (dict.streak > dict.longest_streak) {
    dict.longest_streak = dict.streak;
  }

  dict.html = document.getElementsByTagName('main')[0].innerHTML.substr(0, document.getElementsByTagName('main')[0].innerHTML.indexOf('<span class="cursor"')) + `<div class="winResponse"><span>&gt;&gt;&nbsp;</span><span>Congratulations!!!! You Won!!!! It took you ${guesses.length} tries!!!!</span></div>`;
  storage['userStats'] = JSON.stringify(dict);

  storage['userStats'] = JSON.stringify(dict);

  // CREATE DIV RESPONSE
  let div = document.createElement('div');
  div.className = 'winResponse'

  let spanArrow = document.createElement('span');
  spanArrow.textContent = ">>\u00A0";
  let spanText = document.createElement('span');
  let spanCursor = document.createElement('span');
  spanCursor.className = 'cursor';
  spanCursor.textContent = "«◊»";

  div.appendChild(spanArrow);
  div.appendChild(spanText);
  div.appendChild(spanCursor);

  // ADJUSTMENTS IN MAIN
  if (window.isMobile) { // IF ON MOBILE, REMOVE TYPE INPUT
    document.getElementsByClassName('mobileCompatibility')[0].remove();
  }
  // ADD DIV TO END
  document.getElementsByTagName('main')[0].appendChild(div);

  let i = 0;
  let response = `Congratulations!!!! You Won!!!! It took you ${guesses.length} tries!!!!`;
  let speed = 75;

  // TYPEWRITE WIN RESPONSE
  function typeWriter() {
    if (i < response.length) { // START TYPEWRITE
      spanText.textContent += response.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else { // END TYPEWRITE, REMOVE CURSOR
      document.getElementsByClassName('cursor')[0].remove();
      // UPDATE STORAGE HTML
      const dict = JSON.parse(storage['userStats']);
      dict.html = document.getElementsByTagName('main')[0].innerHTML;
      storage['userStats'] = JSON.stringify(dict);
    }
  }

  typeWriter();
  showUserStats();
}

function showUserStats() {
  let divLine = document.createElement('div');

  let horizontalLine = document.createElement('hr');
  horizontalLine.className = 'break';
  divLine.appendChild(horizontalLine);

  document.getElementsByTagName('main')[0].appendChild(divLine);

  let i = 0;
  let barSpeed = 25;

  function stepBar() {
    if (i < 100) {
      horizontalLine.setAttribute('width', `${i}%`);
      i++;
      setTimeout(stepBar, barSpeed);
    }
  }

  stepBar();

  // ——————————————————————————————————————   ——————————————————————————————————————  ——————————————————————————————————————

  const dict = JSON.parse(storage['userStats']);

  let divStats = document.createElement('div');
  divStats.className = 'showUserStats';
  let br0 = document.createElement('br');
  let br1 = document.createElement('br');
  let br2 = document.createElement('br');
  let br3 = document.createElement('br');
  let br4 = document.createElement('br');
  let br5 = document.createElement('br');
  let br6 = document.createElement('br');
  let br7 = document.createElement('br');

  let statGamesPlayed = document.createElement('span');
  statGamesPlayed.textContent = "\u00A0\u00A0\u00A0";
  let statGP = `Games Played: ${dict.gamesPlayed}`;

  let statWins = document.createElement('span');
  statWins.textContent = "\u00A0\u00A0\u00A0";
  let statWs = `Wins: ${dict.wins}`;

  let statTotalGuesses = document.createElement('span');
  statTotalGuesses.textContent = "\u00A0\u00A0\u00A0";
  let statTG = `Total Guesses: ${dict.totalGuesses}`;

  let statBestGame = document.createElement('span');
  statBestGame.textContent = "\u00A0\u00A0\u00A0";
  let statBG = `Best Game: ${dict.best_game}`;

  let statAverage = document.createElement('span');
  statAverage.textContent = "\u00A0\u00A0\u00A0";
  let statAvg = `Average: ${dict.average}`;

  let statCurrentStreak = document.createElement('span');
  statCurrentStreak.textContent = "\u00A0\u00A0\u00A0";
  let statCS = `Current Streak: ${dict.streak}`;

  let statLongestStreak = document.createElement('span');
  statLongestStreak.textContent = "\u00A0\u00A0\u00A0";
  let statLS = `Longest Streak: ${dict.longest_streak}`;

  divStats.appendChild(br0);
  divStats.appendChild(statGamesPlayed);
  divStats.appendChild(br1);
  divStats.appendChild(statWins);
  divStats.appendChild(br2);
  divStats.appendChild(statTotalGuesses);
  divStats.appendChild(br3);
  divStats.appendChild(statBestGame);
  divStats.appendChild(br4);
  divStats.appendChild(statAverage);
  divStats.appendChild(br5);
  divStats.appendChild(statCurrentStreak);
  divStats.appendChild(br6);
  divStats.appendChild(statLongestStreak);
  divStats.appendChild(br7);

  document.getElementsByTagName('main')[0].appendChild(divStats);

  let j = 0;
  let typeSpeed = 100;

  function typeWriter() {
    if (j < 20) {
      statGamesPlayed.textContent += statGP.charAt(j);
      statWins.textContent += statWs.charAt(j);
      statTotalGuesses.textContent += statTG.charAt(j);
      statBestGame.textContent += statBG.charAt(j);
      statAverage.textContent += statAvg.charAt(j);
      statCurrentStreak.textContent += statCS.charAt(j);
      statLongestStreak.textContent += statLS.charAt(j);
      j++;
      setTimeout(typeWriter, typeSpeed);
    }
  }

  typeWriter();
}

// USER PROMPT
function userPrompt() {
  // CREATE DIV PROMPT
  let div = document.createElement('div');
  div.className = 'userInput'

  let spanArrow = document.createElement('span');
  spanArrow.textContent = ">>\u00A0";
  spanArrow.className = 'userArrow';
  let spanText = document.createElement('span');
  spanText.className = 'answer';
  let spanCursor = document.createElement('span');
  spanCursor.className = 'cursor';
  spanCursor.textContent = "«◊»";

  div.appendChild(spanArrow);
  div.appendChild(spanText);
  div.appendChild(spanCursor);

  if (window.isMobile) { // IF MOBILE, ADD DIV BEFORE TYPE INPUT
    let mobile = document.getElementsByClassName('mobileCompatibility')[0];
    document.getElementsByTagName('main')[0].insertBefore(div, mobile);
  } else { // IF NOT, CAN JUST ADD DIV 
    document.getElementsByTagName('main')[0].appendChild(div);
  }
}

// COMPARE WORD TO SECRET WORD
function compareWord(word) {
  let count = 0;
  let arr = [];
  // 26 LETTERS
  for (let i = 0; i < 26; i++) {
    arr.push(0);
  }
  // BINARY OCCURENCE OF LETTERS IN GUESSED WORD
  for (let i = 0; i < word.length; i++) {
    arr[word.charCodeAt(i) - 97] = 1;
  }
  // COUNT SIMILARITIES BETWEEN BOTH WORDS
  for (let i = 0; i < secretWord.length; i++) {
    if (arr[secretWord.charCodeAt(i) - 97] === 1) {
      count += arr[secretWord.charCodeAt(i) - 97];
      arr[secretWord.charCodeAt(i) - 97] += 1;
    }
  }

  return count;
}

// CHECK IF GUESSED WORD EXISTS
async function checkWord(word) {
  // FETCH URL
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
  const response = await fetch(url);
  // CHECK IF URL EXISTS
  try {
    return (await response.ok);
  } catch (e) {
    return false;
  }
}

// CHECK IF GUESSED WORD HAS APPROPRIATE LENGTH
function validWord(word) {
  return (word.length === secretWord.length);
}






//
//export class WordGame {
//    constructor(canvas, keyMap) {
//
//        // save canvas and keyMap as members
//        this.canvas = canvas;
//        this.keyMap = keyMap;
//        
//        // set size of canvas
//        canvas.width = 240;
//        canvas.height = 240;
//        
//        // save canvas context as member
//        this.ctx = canvas.getContext('2d'); 
//
//        // Set up the box (bouncing around the screen)
//        this.box = new Box();
//        this.box.xVel = 2; // units: pixels per frame
//        this.box.yVel = 2;
//        this.box.minX = 150;
//        this.box.width = 20;
//        this.box.height = 20;
//
//        // Set up the obstacle (paddle on the left side)
//        this.obstacle = new Box();
//        this.obstacle = new Box();
//        this.obstacle.minX = 15;
//        this.obstacle.minY = 40;
//        this.obstacle.width = 10;
//        this.obstacle.height = 100;
//        this.obstacle.color = [255, 255, 255];       
//        
//        // Set up the CPU's paddle
//        this.cpuPaddle = new Box();
//        this.cpuPaddle.minX = 240-25;
//        this.cpuPaddle.minY = 40;
//        this.cpuPaddle.width = 10;
//        this.cpuPaddle.height = 100;
//        this.cpuPaddle.color = [0, 0, 255];
//        
//        // prevDraw is a member variable used for throttling framerate
//        this.prevDraw = 0;
//        
//        // state variables
//        this.gameOver = false;
//        this.paused = false;
//                
//    }
//    
//    mainLoop() {
//        // Compute the FPS
//        // First get #milliseconds since previous draw
//        const elapsed = performance.now() - this.prevDraw;
//
//        if (elapsed < 1000/60) {
//            return;
//        }
//        // 1000 seconds = elapsed * fps. So fps = 1000/elapsed
//        const fps = 1000 / elapsed;
//        // Write the FPS in a <p> element.
//        document.getElementById('fps').innerHTML = fps;
//        
//        this.update();
//        this.draw();
//    }
//    
//    update() {
//        // Update the obstacle using keyboard info
//        if (this.keyMap['ArrowUp']) {
//            this.obstacle.minY -= 3;
//            if (this.obstacle.minY < 0) {
//                this.obstacle.minY = 0;
//            }
//        }
//        if (this.keyMap['ArrowDown']) {
//            this.obstacle.minY += 3;
//            if (this.obstacle.minY + this.obstacle.height > this.canvas.height) {
//                this.obstacle.minY = this.canvas.height - this.obstacle.height;
//            }
//        }
//        
//        if (this.keyMap['p'] && !this.gameOver) {
//            this.paused = !this.paused;
//        }
//        
//        if (this.paused) {
//            return;
//        }
//        
//        // CPU moves their paddle using AI (tries to match midpoints)
//        const midPtPaddle = this.cpuPaddle.minY + this.cpuPaddle.height/2;
//        const midPtBall = this.box.minY + this.box.height/2;
//        if (midPtPaddle < midPtBall) {
//            this.cpuPaddle.minY += 0.5;
//        }
//        if (midPtPaddle > midPtBall) {
//            this.cpuPaddle.minY -= 0.5;
//        }
//
//        // Update the box (move, bounce, etc. according to box.xVel and box.yVel)
//        const obstacles = [this.obstacle, this.cpuPaddle];
//        
//        const topEdge = new Box();
//        topEdge.minX = 0;
//        topEdge.minY = -10;
//        topEdge.width = this.canvas.width;
//        topEdge.height = 10;
//        obstacles.push(topEdge);
//        
//        const bottomEdge = new Box();
//        bottomEdge.minX = 0;
//        bottomEdge.minY = this.canvas.height;
//        bottomEdge.width = this.canvas.width;
//        bottomEdge.height = 10;
//        obstacles.push(bottomEdge);
//        
//        this.box.update(obstacles);
//        
//        
//        // Check for winning
//        if (this.box.minX + this.box.width < 0) {
//            // Ball too far left -> I lost
//            this.gameOver = true;
//            this.winner = 2;
//
//        }
//        if (this.box.minX > this.canvas.width) {
//            // Ball too far right -> I won
//            this.gameOver = true;
//            this.winner = 1;
//        }
//    }
//    
//    draw() {
//        // clear background
//        this.ctx.fillStyle = "rgb(10, 10, 10)";
//        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);        
//        
//        if (this.paused) {
//            this.ctx.font = "50px serif";
//            this.ctx.textAlign = "center";            
//            this.ctx.fillStyle = "rgb(255,0,0)";
//            this.ctx.fillText("PAUSED", this.canvas.width/2, this.canvas.height/2);
//        }
//
//        // potentially draw victory text
//        if (this.gameOver) {
//            let x = "You lose";
//            if (this.winner == 1) {
//                x = "You win";
//            }
//            this.ctx.font = "50px serif";
//            this.ctx.textAlign = "center";
//            this.ctx.fillStyle = 'rgb(255,255,255)';
//            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)            
//        }
//        
//        // Draw the box
//        this.box.draw(this.ctx);
//        this.obstacle.draw(this.ctx);
//        this.cpuPaddle.draw(this.ctx);
//
//        // Save the value of performance.now() for FPS calculation
//        this.prevDraw = performance.now();
//    }
//}
//
//class Box {
//    constructor() {
//        this.minX = 10;
//        this.minY = 30;
//        this.width = 20;
//        this.height = 20;
//        this.xVel = 1;
//        this.yVel = 1;  
//        this.color = [255, 0, 0];
//    }
//
//    randomizeColor() {
//        this.color[0] = Math.round(Math.random()*255);
//        this.color[1] = Math.round(Math.random()*255);
//        this.color[2] = Math.round(Math.random()*255);
//    }
//    
//    intersects(box2) {
//        // the x-intervals
//        const xi1 = [this.minX, this.minX + this.width];
//        const xi2 = [box2.minX, box2.minX + box2.width];
//        
//        if (!intervalsOverlap(xi1, xi2)) {
//            return false;
//        }
//        
//        const yi1 = [this.minY, this.minY + this.height];
//        const yi2 = [box2.minY, box2.minY + box2.height];
//        
//        return intervalsOverlap(yi1, yi2);
//    }
//
//    update(obstacles) {
//        // move x and y
//
//        // move x
//        this.minX += this.xVel;
//
//        for (const o of obstacles) {
//            if (this.intersects(o)) {
//                // undo the step that caused the collision
//                this.minX -= this.xVel;
//                
//                // reverse xVel to bounce
//                this.xVel *= -1;
//                
//                this.randomizeColor();
//            }
//        }
//
//        // move y
//        this.minY += this.yVel;
//
//        for (const o of obstacles) {
//            if (this.intersects(o)) {
//                // undo the step that caused the collision
//                this.minY -= this.yVel;
//                
//                // reverse yVel to bounce
//                this.yVel *= -1;
//                
//                this.randomizeColor();
//            }   
//        }
//    }
//
//    draw(ctx) {
//        const [r,g,b] = this.color;
//        ctx.fillStyle = `rgb(${r},${g},${b})`;
//        ctx.fillRect(this.minX, this.minY, this.width, this.height);                
//    }
//
//}
//
//function intervalsOverlap(int1, int2) {
//    const [a,b] = int1;
//    const [c,d] = int2;
//    if (a > c) {
//        return intervalsOverlap(int2, int1);
//    }
//    return (b > c);
//}
