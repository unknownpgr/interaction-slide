import React, { useState } from 'react';
import './AvoidInteraction.scss';

export default function AvoidInteraction() {

    const { width, height } = document.body.getBoundingClientRect();

    const [x, setX] = useState(width / 4);
    const [y, setY] = useState(height / 2);
    const [opacity, setOpacity] = useState(1);

    const distance = 200;

    const onMouseMove = (event) => {
        const [mX, mY] = [event.clientX, event.clientY];

        let dX, dY;

        dX = width / 4 - mX;
        dY = height / 2 - mY;

        const lenLeft = Math.sqrt(dX * dX + dY * dY);

        if (lenLeft < distance) {
            const bX = mX + dX * distance / lenLeft;
            const bY = mY + dY * distance / lenLeft;
            setX(bX);
            setY(bY);
        } else {
            setX(width / 4);
            setY(height / 2);
        }

        dX = width * 3 / 4 - mX;
        dY = height / 2 - mY;

        const lenRight = Math.sqrt(dX * dX + dY * dY);

        let opacity = (lenRight - 150) / distance;
        if (opacity > 1) opacity = 1;
        if (opacity < 0) opacity = 0;

        setOpacity(opacity);
    };

    const onHCube = () => {
        window.location.href = 'https://dev.h-cu.be';
    };

    const onNavy = () => {
        window.location.href = "https://en.wikipedia.org/wiki/United_States_Navy_SEALs";
    };

    return (
        <div className='avoid-interaction' onMouseMove={onMouseMove}>
            <button style={{ left: x, top: y, backgroundColor: '#fff', color: '#000' }}>구글폼</button>
            <button style={{ left: width / 2, top: height / 2 }} onClick={onHCube} className="clickable">더 폼</button>
            <button style={{ left: width * 3 / 4, top: height / 2, opacity, backgroundColor: '#000' }}>타입폼</button>
            <button style={{ top: height / 4, backgroundColor: '#1cc805' }} className="nc" onClick={onNavy}>네이비씰</button>
        </div>
    );
}

