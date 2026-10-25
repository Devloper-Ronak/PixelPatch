export const blankPixels = size => Array(size * size).fill(null);

export function floodFill(source, start, color, size) {
  const target = source[start];
  if (target === color) return source;
  const next = [...source], stack = [start], seen = new Set();
  while (stack.length) {
    const index = stack.pop();
    if (seen.has(index) || next[index] !== target) continue;
    seen.add(index); next[index] = color;
    const x = index % size, y = Math.floor(index / size);
    if (x > 0) stack.push(index - 1);
    if (x < size - 1) stack.push(index + 1);
    if (y > 0) stack.push(index - size);
    if (y < size - 1) stack.push(index + size);
  }
  return next;
}

export function drawShape(source, start, end, shape, color, size, mirror = false) {
  const next = [...source];
  const x1 = start % size, y1 = Math.floor(start / size);
  const x2 = end % size, y2 = Math.floor(end / size);
  const put = (x, y) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    next[y * size + x] = color;
    if (mirror) next[y * size + size - 1 - x] = color;
  };
  if (shape === 'rectangle') {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) put(x, y);
  } else if (shape === 'circle') {
    const left = Math.min(x1, x2), right = Math.max(x1, x2);
    const top = Math.min(y1, y2), bottom = Math.max(y1, y2);
    const cx = (left + right) / 2, cy = (top + bottom) / 2;
    const rx = Math.max((right - left + 1) / 2, .5), ry = Math.max((bottom - top + 1) / 2, .5);
    for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d <= 1.35 && d >= .42) put(x, y);
    }
  } else {
    let x = x1, y = y1; const dx = Math.abs(x2-x1), dy = Math.abs(y2-y1);
    const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1; let err = dx-dy;
    while (true) { put(x,y); if (x === x2 && y === y2) break; const e2 = 2*err; if (e2 > -dy) { err -= dy; x += sx; } if (e2 < dx) { err += dx; y += sy; } }
  }
  return next;
}

export function exportPng({ pixels, size, scale, transparent, name }) {
  const canvas = document.createElement('canvas'); canvas.width = size * scale; canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (!transparent) { ctx.fillStyle = '#F7F2E8'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  pixels.forEach((pixel, i) => { if (pixel) { ctx.fillStyle = pixel; ctx.fillRect((i % size) * scale, Math.floor(i / size) * scale, scale, scale); } });
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `${(name.trim() || 'pixelpatch-artwork').replace(/[<>:"/\\|?*]/g, '-')}.png`;
    link.click(); URL.revokeObjectURL(url);
  }, 'image/png');
}
