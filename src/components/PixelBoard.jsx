import React from 'react';
export default function PixelBoard({ pixels, size, showGrid, zoom, lineStart, onPointerDown, onPointerMove, onPointerUp, boardRef }) {
  return <div className="board-wrap"><div ref={boardRef} className={`pixel-board ${showGrid ? 'with-grid' : ''}`} style={{ '--grid-size': size, '--zoom': zoom }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp}>
    {pixels.map((pixel, index) => <div key={`${size}-${index}`} data-cell={index} className={`pixel-cell ${lineStart === index ? 'line-start' : ''}`} style={{ backgroundColor: pixel || 'transparent' }} />)}
  </div></div>;
}
