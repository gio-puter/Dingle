import React, {useEffect, useState, useRef} from "react";
import './PromptUser.css';

function PromptUser(props) {

    const [userGuess, setUserGuess] = useState('');
    const [wordEntered, setWordEntered] = useState(false);

    useEffect(() => {
        if (wordEntered) {return};
        if (props.userGuess != "") {
            setWordEntered(true);
            setUserGuess(props.userGuess);
            return;
        }
        const handleKeyPress = (event) => {
            if (wordEntered || event.target.localName != "body") {return}
            const validChar = (event.key.replace(/\s+/g, '').length === 1);

            if (event.key === "Backspace" && userGuess.length > 0) {
                window.removeEventListener('keydown', handleKeyPress);
                setUserGuess(prev => prev.slice(0, -1));
            } else if (event.key === "Enter" && userGuess.length > 0) {
                window.removeEventListener('keydown', handleKeyPress);
                setWordEntered(true);
                props.onEnter(userGuess);
            } else if (validChar && userGuess.length < 12) {
                window.removeEventListener('keydown', handleKeyPress);
                setUserGuess(prev => prev + event.key);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [userGuess, wordEntered])

    return (
        <div className="userInput">
            <span className="userArrow">{">> "}</span>
            <span className={"userGuess"}>{userGuess}</span>
            {!wordEntered && <span className="cursor">«◊»</span>}
        </div>
    )
}

export default PromptUser;

PromptUser.defaultProps = {
    userGuess: "",
    onEnter: () => {},
}