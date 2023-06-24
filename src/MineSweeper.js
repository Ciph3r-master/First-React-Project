import { useState } from "react";
import Grid from "./Grid";
import Button from "./Button";

export default function MineSweeper(props)
{
    const refreshPage = () => {
        window.location.reload(false);
    }

    const size = props.params;

    const getRandomInt = (max) => {
        let value = 0;
        max++;
        while(value === 0){
            value = Math.floor(Math.random() * max)
        }
        return value;
    }

    const hasBomb = (bombs, nx, ny) =>
    {
        //Fait défiler l'array bombs et vérifie si
        //aux coordonnées indiqués une bombe est déjà présente
        const isFound = bombs.some(b => {
            if (b.x === nx && b.y === ny) {
                return true;
            }

            return false;
        });
        
        return isFound;
    }

    //Générer les bombes sans doublon (coordonnées)
    const genBomb = () => {
        const bombs = []
        let i = 1

        while(i <= size.bombs)
        {
            let nx = getRandomInt(size.x)
            let ny = getRandomInt(size.y)

        
            while(hasBomb(bombs, nx, ny)){
                nx = getRandomInt(size.x)
                ny = getRandomInt(size.y)
            }

            bombs.push({
                x: nx,
                y: ny
            })

            i++;
        }

        return bombs;
    }


    const bombs = genBomb();

    const countBombs = (x,y) =>
    {
        let i = -1;
        let j = -1;
        let bombCount = 0;
        while (j <= 1)
        {
            while(i <= 1)
            {
                if (hasBomb(bombs, x + i, y + j)){
                    bombCount++;
                }
                i++;
            }

            i = -1;
            j++;
        }
        return bombCount;
        
    }

    const genBoxes = () =>
    {
        const boxes = []
        let x = 1;
        let y = 1;

        //Tant que le curseur est dans la grille
        while (y <= size.y)
        {
            //Tant qu'il ne dépasse pas une ligne
            while (x <= size.x)
            {
                // Pas de collision avec une bombe ça serait dommage
                if (hasBomb(bombs, x, y)) {
                    x++;
                    continue;
                }
                boxes.push({x: x, y: y, bombCount: countBombs(x,y), isVisible:false})
                x++;
            }
            x = 1;
            y++;
        }
        return boxes;
    }

    const boxes = genBoxes();

    return <>
        <Grid refresh={refreshPage} bombs={bombs} boxes={boxes} hasBomb={hasBomb} size={size}/>
    </>
}