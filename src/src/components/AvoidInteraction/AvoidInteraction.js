import React, { useState } from 'react'
import './AvoidInteraction.css'

export default function AvoidInteraction() {

    const { width, height } = window.screen

    const [x, setX] = useState(width / 4)
    const [y, setY] = useState(height / 2)
    const [opacity, setOpacity] = useState(1)

    const distance = 200;

    const onMouseMove = (event) => {
        const [mX, mY] = [event.clientX, event.clientY]

        let dX, dY;

        dX = width / 4 - mX;
        dY = height / 2 - mY;

        const lenLeft = Math.sqrt(dX * dX + dY * dY)

        if (lenLeft < distance) {
            const bX = mX + dX * distance / lenLeft
            const bY = mY + dY * distance / lenLeft
            setX(bX)
            setY(bY)
        } else {
            setX(width / 4)
            setY(height / 2)
        }

        dX = width * 3 / 4 - mX;
        dY = height / 2 - mY;

        const lenRight = Math.sqrt(dX * dX + dY * dY)

        let opacity = (lenRight - 150) / distance
        if (opacity > 1) opacity = 1
        if (opacity < 0) opacity = 0

        setOpacity(opacity)
    }

    const onClick = () => {
        window.location.href = 'https://dev.h-cu.be'
    }

    return (
        <div className='full-container' onMouseMove={onMouseMove}>
            <button style={{ left: x, top: y, backgroundColor: '#fff', color: '#000' }}>구글폼</button>
            <button style={{ left: width / 2, top: height / 2 }} onClick={onClick} className="clickable">더 폼</button>
            <button style={{ left: width * 3 / 4, top: height / 2, opacity, backgroundColor: '#000' }}>타입폼</button>
            <button style={{ left: width - 16, top: height / 4, backgroundColor: '#1cc805' }}>네이비씰</button>
        </div>
    )
}

