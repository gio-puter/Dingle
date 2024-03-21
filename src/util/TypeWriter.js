import React, { useEffect, useRef, useState } from 'react';
import './TypeWriter.css';

function TypeWriter(props) {

    const [placeholder, setPlaceholder] = useState('');
    const index = useRef(0);


    const handleKeyPress = (event) => {
        // console.log("WOW");
        if (event.target.localName != "body") {return}
        if (event.key === 'Enter') {
            index.current = props.text.length;
            setPlaceholder(props.text);
            window.removeEventListener('keydown', handleKeyPress);
        }
    };
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        const typeWrite = () => {
            window.removeEventListener('keydown', handleKeyPress);
            setPlaceholder(props.text.substr(0, index.current+1));
            index.current += 1;
        }

        if (props.showImmediately) {
            index.current = props.text.length;
            window.removeEventListener('keydown', handleKeyPress);
            setPlaceholder(props.text);
        } else if (index.current < props.text.length) {
            let addChar = setTimeout(typeWrite, 75);
            return () => clearTimeout(addChar);
        }

        if (index.current >= props.text.length) {
            window.removeEventListener('keydown', handleKeyPress);
            props.onFinish();
        }
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };

    }, [placeholder])

    return (
        <div className={props.className}>
            <p>
                {placeholder}
                {index.current < props.text.length && props.cursor && (
                    <span className='cursor'>
                        «◊»
                    </span>
                )}
            </p>
        </div>
    );
}

export default TypeWriter;

TypeWriter.defaultProps = {
    className: "",
    text: "",
    showImmediately: false,
    onFinish: () => {},
    cursor: true,
}
