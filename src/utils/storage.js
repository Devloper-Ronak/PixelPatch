import { STORAGE_KEY } from './constants';
export function readArtworks() {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
export function writeArtworks(artworks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
}
