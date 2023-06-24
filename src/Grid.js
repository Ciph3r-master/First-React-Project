import React, { useEffect, useState } from "react";
import { useReducer } from "react";
import BombImg from './assets/img/bombe.png'

export default function Grid(props)
{

    const [boxesClaimed, setBoxesClaimed] = useState(props.boxes)
    //Doublon de isFinish dans MineSweeper (utiliser celui de MineSweeper uniquement)
    const [isFinish, setIsFinish] = useState(false)
    //Le onClick bloque le rerender ? TODO retirer ce hook
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const getIndexBoxByCoords = (nx,ny) =>
    {
        return boxesClaimed.findIndex((obj => obj.x == nx && obj.y == ny));
    } 

    const setVisible = (nx, ny) =>
    {
        const objIndex = getIndexBoxByCoords(nx,ny)
        
        let newArray = boxesClaimed;
        newArray[objIndex].isVisible = true
        setBoxesClaimed(newArray);
    }

    const flood = (nx,ny) =>
    {

        const box = props.boxes[getIndexBoxByCoords(nx,ny)]

        if(box === undefined)
        {
            return;
        }

        if(box.bombCount != 0)
        {
            setVisible(nx,ny)
            return;
        }

        if(!(nx >= 1 && nx <= props.size.x && ny >= 1 && ny <= props.size.y))
        {
            return;
        }

        if(!box.isVisible)
        {
            setVisible(nx,ny)
            flood(nx - 1, ny)
            flood(nx + 1, ny)
            flood(nx, ny - 1)
            flood(nx, ny + 1)
        }

    }
    
    const onGridClick = (e) =>
    {
        e.preventDefault();

        /*TODO : RIGHT CLICK WITH FLAG*/

        const  x = parseInt(e.target.style.gridColumn)
        const y = parseInt(e.target.style.gridRow)

        if(props.hasBomb(props.bombs,x,y)){
            const newArray = props.boxes;
            newArray.forEach((e) =>{
                e.isVisible = true;
            })
            setBoxesClaimed(newArray)
            setIsFinish(true);
        }
        else
        {
            flood(x,y)
        }
        forceUpdate()

    }



    const createTemplate = () =>
    {

        const gridTemplateStyle = {column:"", row:""}

        let i = 0;
        let j = 0;

        while (i < props.size.x)
        {
            gridTemplateStyle.column += "1fr "
            i++;
        }

        while (j < props.size.x)
        {
            gridTemplateStyle.row += "1fr "
            j++;
        }

        return gridTemplateStyle;
    }

    const gridTemplateStyle = createTemplate();
    const colors = ["#285943", "#6BA368", "#985F6F", "#B84A62", "#4C243B","#2374AB","#141301","#7E007B"]

    return <div onClick={onGridClick} onContextMenu={(e) => e.preventDefault} className="minesweeper-grid" 
        style={{
            gridTemplateColumns: gridTemplateStyle.column,
            gridTemplateRows: gridTemplateStyle.row,
        }}>

        {props.bombs.map((b) => (
        <div className={isFinish ? "cell bomb" : "cell"} 
            style={{
                backgroundColor: isFinish ? '#DB162F' : '',
                gridColumn: b.x, 
                gridRow: b.y
        }}>
            {isFinish ? <img src={BombImg} alt='bomb' /> : <></>}
        </div>
        ))}

        {boxesClaimed.map((b) => (
        <div className={b.isVisible ? "cell cell-visible" : "cell"} 
            style={{
                backgroundColor: b.isVisible ? '#e0ba72' : '',
                color: colors[b.bombCount - 1],
                gridColumn: b.x, 
                gridRow: b.y,                
        }}> 
            {b.isVisible && b.bombCount != 0 ? b.bombCount : <></>}
        </div>
        ))}

    </div>
}