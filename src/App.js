import React, { useEffect, useState } from "react";
import "./App.css";
import DraggableTextbox from './util/DraggableTextbox';
import NavBar from './util/NavBar';
import WordGame from "./WordGame";
import { fiveletterwords } from "./words/fiveletterwords";
import { sixletterwords } from "./words/sixletterwords";
import { sevenletterwords } from "./words/sevenletterwords";

function App() {

    const now = Date.now();
    const today = Math.floor((now - 2 * 3600000) / 86400000);
    const initDay = 19791;
    const index = today - initDay;

    const fiveSecret = fiveletterwords[index % fiveletterwords.length];
    const sixSecret = sixletterwords[index % sixletterwords.length];
    const sevenSecret = sevenletterwords[index % sevenletterwords.length];

    const [showNote, setShowNote] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [activeGame, setActiveGame] = useState(5);

    const [fiveWon, setFiveWon] = useState("");
    const [sixWon, setSixWon] = useState("");
    const [sevenWon, setSevenWon] = useState("");


    useEffect(() => {
        console.log(fiveSecret);
        console.log(sixSecret);
        console.log(sevenSecret);
        if (localStorage.hasPlayed) { // RESET ALL STATS OF PREV. VERSION
            localStorage.clear();
        }

        if (!localStorage.playedBefore) { // IF HAS NEVER PLAYED BEFORE
            const userStatsGeneral = {
                gamesPlayed: 0,
                wins: 0,
                totalGuesses: 0,
                bestGame: Infinity,
                average: Infinity,
                currentStreak: 0,
                longestStreak: 0,
            }

            const userStatsFive = {
                guesses: [],
                gamesPlayed: 0,
                wins: 0,
                totalGuesses: 0,
                bestGame: Infinity,
                average: Infinity,
                currentStreak: 0,
                longestStreak: 0,
                todayWin: false,
                history: {},
            };

            const userStatsSix = {
                guesses: [],
                gamesPlayed: 0,
                wins: 0,
                totalGuesses: 0,
                bestGame: Infinity,
                average: Infinity,
                currentStreak: 0,
                longestStreak: 0,
                todayWin: false,
                history: {},
            };
            
            const userStatsSeven = {
                guesses: [],
                gamesPlayed: 0,
                wins: 0,
                totalGuesses: 0,
                bestGame: Infinity,
                average: Infinity,
                currentStreak: 0,
                longestStreak: 0,
                todayWin: false,
                history: {},
            };

            localStorage.lastPlay = today;
            localStorage.playedBefore = true;
            localStorage.userStatsGeneral = JSON.stringify(userStatsGeneral);
            localStorage.userStatsFive = JSON.stringify(userStatsFive);
            localStorage.userStatsSix = JSON.stringify(userStatsSix);
            localStorage.userStatsSeven = JSON.stringify(userStatsSeven);

            setIsReady(true)
            return;
        }

        // HAS PLAYED BEFORE --------------------

        if (localStorage.lastPlay == today) { // RETURNING TODAY
          const fiveStorage = JSON.parse(localStorage.userStatsFive)
          const sixStorage = JSON.parse(localStorage.userStatsSix)
          const sevenStorage = JSON.parse(localStorage.userStatsSeven)

          setFiveWon(fiveStorage.todayWin ? "won" : "");
          setSixWon(sixStorage.todayWin ? "won" : "");
          setSevenWon(sevenStorage.todayWin ? "won" : "");

          setIsReady(true);
          return;
        }

        // NEW SESSION
        const userStatsGeneral = JSON.parse(localStorage.userStatsGeneral);
        const userStatsFive = JSON.parse(localStorage.userStatsFive);
        const userStatsSix = JSON.parse(localStorage.userStatsSix);
        const userStatsSeven = JSON.parse(localStorage.userStatsSeven);

        if (!userStatsFive.todayWin || !userStatsSix.todayWin || !userStatsSeven.todayWin || localStorage.lastPlay != today - 1) {
            userStatsGeneral.currentStreak = 0;
        }
        if (!userStatsFive.todayWin || localStorage.lastPlay != today - 1) {
            userStatsFive.currentStreak = 0;
        }
        if (!userStatsSix.todayWin || localStorage.lastPlay != today - 1) {
            userStatsSix.currentStreak = 0;
        }
        if (!userStatsSeven.todayWin || localStorage.lastPlay != today - 1) {
            userStatsSeven.currentStreak = 0;
        }

        localStorage.lastPlay = today;

        userStatsFive.todayWin = false;
        userStatsSix.todayWin = false;
        userStatsSeven.todayWin = false;

        userStatsFive.history = {};
        userStatsSix.history = {};
        userStatsSeven.history = {};

        userStatsFive.guesses = [];
        userStatsSix.guesses = [];
        userStatsSeven.guesses = [];
        
        localStorage.userStatsGeneral = JSON.stringify(userStatsGeneral);
        localStorage.userStatsFive = JSON.stringify(userStatsFive);
        localStorage.userStatsSix = JSON.stringify(userStatsSix);
        localStorage.userStatsSeven = JSON.stringify(userStatsSeven);

        setIsReady(true)
    }, [])

    const moveGame = (event) => {
      setActiveGame(event.target.id);
    }

    const fiveWin = () => {
      // console.log("Five WON");
      setFiveWon("won");
    }
    const sixWin = () => {
      // console.log("Six WON");
      setSixWon("won");
    }
    const sevenWin = () => {
      // console.log("Seven WON");
      setSevenWon("won");
    }

    return (
        <>
            <NavBar 
              moveGame={moveGame} 
              openNote={() => {setShowNote(prev => !prev)}}
              fiveWon={fiveWon}
              sixWon={sixWon}
              sevenWon={sevenWon}
            >
            </NavBar>
            <DraggableTextbox show={showNote}></DraggableTextbox>
            {activeGame == 5 && (<WordGame ready={isReady} secretWord={fiveSecret} gameKey={"userStatsFive"} onWin={fiveWin}></WordGame>)}
            {activeGame == 6 && (<WordGame ready={isReady} secretWord={sixSecret} gameKey={"userStatsSix"} onWin={sixWin}></WordGame>)}
            {activeGame == 7 && (<WordGame ready={isReady} secretWord={sevenSecret} gameKey={"userStatsSeven"} onWin={sevenWin}></WordGame>)}
        </>
    )
}

export default App;