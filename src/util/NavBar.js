import React, { useEffect, useRef } from "react";
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
// import { faNoteSticky } from "@fortawesome/free-regular-svg-icons";

function NavBar(props) {

    const navBarRef = useRef(null);

    useEffect(() => {
        console.log(props);
    }, [])

    const handleClick = (event) => {
        if (event.target.className.includes("active")) {
            return;
        }

        for (const child of navBarRef.current.children) {
            if (child.className.includes('active')) {
                child.className = child.className.replaceAll('active', '');
                child.className = child.className.replaceAll(' ', '');
            }
        }

        event.target.className += ' active'
        props.moveGame(event);
    }

    return (
        <div ref={navBarRef} className="navBar">
            <button id="5" className={`active ${props.fiveWon ? props.fiveWon : ""}`} onClick={handleClick}><span>{props.names[0]}</span></button>
            <button id="6" className={`${props.sixWon ? props.sixWon : ""}`} onClick={handleClick}><span>{props.names[1]}</span></button>
            <button id="7" className={`${props.sevenWon ? props.sevenWon : ""}`} onClick={handleClick}><span>{props.names[2]}</span></button>
            <button onClick={props.openNote}><FontAwesomeIcon icon={faNoteSticky} /></button>      
        </div>
    )
}

export default NavBar;

NavBar.defaultProps = {
    names: [5, 6, 7],
    openNote: () => {},
    moveGame: () => {},
}