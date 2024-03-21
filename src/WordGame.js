import './WordGame.css';
import React, {useEffect, useRef, useState} from 'react';
import TypeWriter from './util/TypeWriter';
import PromptUser from './util/PromptUser';
import UserStats from './util/UserStats';
import GameState from './util/GameState';

function WordGame(props) {
  
  let secretWord = props.secretWord;
  let gameKey = props.gameKey;
  let info = `Welcome to Dingle — a word guessing game. Each valid guess will be compared to the secret word to see how many letters they have in common. For example, comparing guess ('simple') to a secret word ('scolds') would yield 2 similar letters. You have unlimited guesses. The secret word in this section is ${secretWord.length} letters long. Enjoy...`; // INTRO INFO
  // const secretWord = sixletterwords[today - initDay]; // PUZZLE NUMBER

  const [state, setState] = useState(GameState.INTRO);
  const [guesses, setGuesses] = useState([]);
  const [response, setResponse] = useState([]);
  const [gameFlow, setGameFlow] = useState([]);
  const [showIntro, setShowIntro] = useState(false);
  const introFunction = useRef(() => {setState(GameState.GUESS)});

  useEffect(() => {
    if (!props.ready) {return;}
    switch (state) {
      case GameState.INTRO: // GENERATE HTML ON START
        const dict = JSON.parse(localStorage[gameKey]);
        // console.log(dict);
        // setGuesses([]);
        // setGameFlow([]);
        // introFunction.current = () => {setState(GameState.GUESS)}

        if (dict.guesses.length == 0) { // NEW SESSION (kinda) <-- ISSUE HERE WITH CALLING INTRO FUNCTION
          break;
        }

        // RETURNING TODAY
        setShowIntro(true);
        introFunction.current = () => {};
        resumeGameFlow();

        break;
      case GameState.GUESS: // GENERATE USER PROMPT
        setGameFlow(prev => [...prev, <PromptUser key={prev.length} onEnter={checkUserGuess}></PromptUser>]);
        break;
      case GameState.RESPONSE: // GENERATE RESPONSE TO USER'S GUESS
        let responseText;
        let className;
        const word = guesses.slice(-1)[0].toLowerCase();

        if (response.length == 1) { // WORD IS VALID
          className = "validResponse";
          const similarities = compareWord(word);
          responseText = `Valid ENTRY -- ${similarities} letter(s) in common`;

          const dict = JSON.parse(localStorage[gameKey]);
          const generalStats = JSON.parse(localStorage['userStatsGeneral']);
          const history = dict.history;

          dict.guesses.push(word);
          dict.totalGuesses += 1;
          generalStats.totalGuesses += 1;
          if (dict.guesses.length == 1) {
            dict.gamesPlayed += 1;
            generalStats.gamesPlayed += 1;
          }

          history[dict.guesses.length] = {word: word, similarities: similarities, isWin: false}

          // console.log(dict);

          dict.history = history;
          localStorage[gameKey] = JSON.stringify(dict) // UPDATE LOCALSTORAGE WITH HISTORY AND GUESSES
          localStorage['userStatsGeneral'] = JSON.stringify(generalStats) // UPDATE LOCALSTORAGE WITH GUESSES
          
          if (word == secretWord) { // WORD IS CORRECT
            history[dict.guesses.length].isWin = true; // UPDATE HISTORY AGAIN ON WINNING WORD
            dict.history = history;
            localStorage[gameKey] = JSON.stringify(dict)
            setState(GameState.WON);
            break;
          }
        }
        else { // WORD IS INVALID
          className = "invalidResponse";
          switch (response[1]) {
            case "length":
              responseText = `Invalid ENTRY -- Guess should be 4+ letters`;
              break;
            case "guessed":
              responseText = `Invalid ENTRY -- Guess should be new word`;
              break;
            case "nonexistent":
              responseText = `Invalid ENTRY -- Guess should be a word`;
              break;
            default:
          }
        }

        setGameFlow(prev => [...prev, <TypeWriter key={prev.length} className={className} text={responseText} onFinish={() => {setState(GameState.GUESS)}}></TypeWriter>]);
        scrollToBottom();
        break;
      case GameState.WON:
        winGame();
        scrollToBottom();
        break;
      default:
        break;
    }

  }, [state, props.ready]);

  const checkUserGuess = async (word) => {
    // console.log(word)
    if (guesses.includes(word)) {// -- INVALID GUESS: ALREADY GUESSED
      // console.log('WORD WAS NOT VALID');
      setResponse([false, "guessed"]);
      // return false;
    } else if (await checkWord(word)) { // -- VALID GUESS or INVALID GUESS: WORD NOT APPROPRIATE LENGTH
      if (word.length >= 4) {
        // console.log('WORD WAS VALID');
        setResponse([true]);
      } else {
        // console.log('WORD WAS INVALID'); 
        setResponse([false, "length"]);
      }
    } else { // -- INVALID GUESS: WORD DOES NOT EXIST
      // console.log('WORD WAS NOT VALID')
      setResponse([false, "nonexistent"]);
    }
    setGuesses(prev => [...prev, word]);
    setState(GameState.RESPONSE);
  }  

  const checkWord = async (word) => {
    try {
      const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);  
      return (await response.ok);
    } catch (e) {
        return false;
    }
  }

  const compareWord = (word) => {
    const guessSet = new Set(word);
    const secretSet = new Set(secretWord);

    let counter = 0;
    for (const letter of guessSet) {
      if (secretSet.has(letter)) {
        counter += 1;
      }
    }

    return counter;
  }

  const winGame = () => { // CORRECT THIS
    const dict = JSON.parse(localStorage[gameKey]); // UPDATE SPECIFIC GAME
    dict.wins += 1;
    dict.average = (dict.totalGuesses/dict.gamesPlayed).toFixed(2);
    dict.currentStreak += 1;
    dict.longestStreak = Math.max(dict.currentStreak, dict.longestStreak);
    dict.bestGame = dict.bestGame == null ? dict.guesses.length : Math.min(dict.guesses.length, dict.bestGame);
    dict.todayWin = true;
    localStorage[gameKey] = JSON.stringify(dict);
    
    const generalStats = JSON.parse(localStorage['userStatsGeneral']); // UPDATE GENERAL STATS
    const statsFive = JSON.parse(localStorage['userStatsFive']);
    const statsSix = JSON.parse(localStorage['userStatsSix']);
    const statsSeven = JSON.parse(localStorage['userStatsSeven']);
    
    generalStats.average = (generalStats.totalGuesses/generalStats.gamesPlayed).toFixed(2);
    
    if (statsFive.todayWin && statsSix.todayWin && statsSeven.todayWin) {
      generalStats.wins += 1;
      generalStats.currentStreak += 1;
    }
    generalStats.longestStreak = Math.max(generalStats.currentStreak, generalStats.longestStreak);
    
    if (statsFive.bestGame == null) {statsFive.bestGame = Infinity;}
    if (statsSix.bestGame == null) {statsSix.bestGame = Infinity;}
    if (statsSeven.bestGame == null) {statsSeven.bestGame = Infinity;}
    if (generalStats.bestGame == null) {generalStats.bestGame = Infinity;}
    generalStats.bestGame = Math.min(statsFive.bestGame, statsSix.bestGame, statsSeven.bestGame, generalStats.bestGame)
    
    localStorage['userStatsGeneral'] = JSON.stringify(generalStats);


    const winText = `Congratulations!!!! You Won!!!! It took you ${dict.guesses.length} tries!!!!`;

    props.onWin();
    setGameFlow(prev => [...prev, <TypeWriter key={prev.length} className={"winResponse"} text={winText}></TypeWriter>])
    setTimeout(() => {
      setGameFlow(prev => [...prev, <UserStats key={prev.length} storage={dict} generalStorage={generalStats} wordLength={props.secretWord.length}></UserStats>])
    }, 750);
  }

  const resumeGameFlow = () => {
    const dict = JSON.parse(localStorage[gameKey]);
    const history = dict.history;
    const keys = Object.keys(history).sort((a, b) => {return a - b;});
    setGuesses(prev => [...prev, ...dict.guesses])

    const gameFlowArray = [];
    let nextState = GameState.GUESS;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      gameFlowArray.push(<PromptUser key={dict.guesses.length + gameFlowArray.length} userGuess={history[key].word}></PromptUser>);
      if (!history[key].isWin) {
        const validResponseText = `VALID ENTRY -- ${history[key].similarities} LETTER(S) IN COMMON`
        gameFlowArray.push(<TypeWriter key={dict.guesses.length + gameFlowArray.length} className={"validResponse"} showImmediately={true} text={validResponseText}></TypeWriter>)
      } else {
        const winText = `Congratulations!!!! You Won!!!! It took you ${key} tries!!!!`;
        const generalStats = JSON.parse(localStorage['userStatsGeneral']);
        props.onWin();
        gameFlowArray.push(<TypeWriter key={dict.guesses.length + gameFlowArray.length} className={"winResponse"} showImmediately={true} text={winText}></TypeWriter>)
        gameFlowArray.push(<UserStats key={dict.guesses.length + gameFlowArray.length} showImmediately={true} storage={dict} generalStorage={generalStats} wordLength={props.secretWord.length}></UserStats>)
        nextState = "";
      }
    }

    setGameFlow(prev => [...prev, ...gameFlowArray]);
    setState(nextState);
  }

  const scrollToBottom = () => {
    const content = document.querySelector('.terminal');
    content.scrollTop = content.scrollHeight;
  }

  return (
    <div className='terminal'>
        <main>
          <TypeWriter text={info} showImmediately={showIntro} onFinish={introFunction.current}></TypeWriter>
          {gameFlow.map((prompt, index) => (
            <React.Fragment key={index}>{prompt}</React.Fragment>
          ))}
        </main>
    </div>
  );
}

export default WordGame;