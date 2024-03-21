import React, {useState, useRef, useEffect} from "react";
import './DraggableTextbox.css';

function DraggableTextbox(props) {
    
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const [offsetX, setOffsetX] = useState();
    const [offsetY, setOffsetY] = useState();
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [left, setLeft] = useState(50);
    const [top, setTop] = useState(50);

    const textboxRef = useRef(null);

    
    useEffect(() => {
        if (!isDragging) {return;}
        const handleMouseMove = (event) => {
            if (isDragging) {
                setLeft(Math.min(Math.max(event.clientX - offsetX, 0), window.innerWidth-width));
                setTop(Math.min(Math.max(event.clientY - offsetY, 0), window.innerHeight-height));
            }
        }

        const handleMouseUp = (event) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragging(false);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

    }, [isDragging]);

    useEffect(() => {
        if (!isResizing) {return;}
        const handleMouseMove = (event) => {
            if (isResizing) {
                if (left + width + event.clientX - offsetX - left >= window.innerWidth) {
                    return;
                }
                if (top + height + event.clientY - offsetY - top >= window.innerHeight ) {
                    return;
                }
                setWidth(Math.max(width + event.clientX - offsetX - left, 200));
                setHeight(Math.max(height + event.clientY - offsetY - top, 200));
            }
        }

        const handleMouseUp = (event) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsResizing(false);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

    }, [isResizing])

    const handleMouseDown = (event) => {
        setOffsetX(event.clientX - textboxRef.current.getBoundingClientRect().left);
        setOffsetY(event.clientY - textboxRef.current.getBoundingClientRect().top);
        setIsDragging(true);
    }


    const handleResize = (event) => {
        setOffsetX(event.clientX - textboxRef.current.getBoundingClientRect().left);
        setOffsetY(event.clientY - textboxRef.current.getBoundingClientRect().top);
        setIsResizing(true)
    }

    return (
        <div 
            ref={textboxRef} 
            className={`draggable-textbox ${isDragging ? 'dragging' : ''}`}
            style={{width, height, left, top, display: props.show ? "block" : "none"}}
        >
            <div className="resize-handle" onMouseDown={handleResize}></div>
            <div className="scroll-container" style={{width:"100%", height:"100%", overflowY:"auto"}}>
                <div 
                    className="content" 
                    contentEditable={true}
                >
                </div>
            </div>
            <div className="drag-handle" onMouseDown={handleMouseDown}></div>
        </div>
    )
}

export default DraggableTextbox;