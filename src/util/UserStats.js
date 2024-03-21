import React, {useEffect, useState, useRef} from "react";
import TypeWriter from "./TypeWriter";
import './UserStats.css';

function UserStats(props) {

    const dict = props.storage;
    const generalDict = props.generalStorage;

    return (
        <>
            <hr></hr>
            <div className="userStats">
                <div>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`${props.wordLength}-letter Stats`}></TypeWriter>
                    <hr></hr>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Games Played: ${dict.gamesPlayed}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Wins: ${dict.wins}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Total Guesses: ${dict.totalGuesses}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Best Game: ${dict.bestGame}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Average: ${dict.average}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Current Streak: ${dict.currentStreak}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Longest Streak: ${dict.longestStreak}`}></TypeWriter>
                </div>
                <div>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Overall Stats`}></TypeWriter>
                    <hr></hr>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Games Played: ${generalDict.gamesPlayed}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Wins: ${generalDict.wins}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Total Guesses: ${generalDict.totalGuesses}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Best Game: ${generalDict.bestGame}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Average: ${generalDict.average}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Current Streak: ${generalDict.currentStreak}`}></TypeWriter>
                    <TypeWriter cursor={false} showImmediately={props.showImmediately} text={`Longest Streak: ${generalDict.longestStreak}`}></TypeWriter>
                </div>
            </div>
            <hr></hr>
        </>
    )
}

export default UserStats;

UserStats.defaultProps = {
    showImmediately: false,
    cursor: false,
}