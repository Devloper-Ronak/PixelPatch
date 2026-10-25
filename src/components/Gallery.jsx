import React from 'react';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
function Thumbnail({ artwork, className='' }) { return <div className={`art-thumb ${className}`} style={{'--thumb-size':artwork.size}}>{artwork.pixels.map((pixel,i)=><span key={i} style={{background:pixel||'transparent'}}/>)}</div>; }
export { Thumbnail };
export default function Gallery({ artworks, openArtwork, openLibrary }) {
 return <section className="recent-section"><div className="recent-heading"><div><span className="eyebrow">THE LITTLE GALLERY</span><h2>Saved on this device</h2></div><button className="view-all" onClick={openLibrary}>View all <ArrowUpRight size={15}/></button></div>
 {artworks.length ? <div className="recent-list">{artworks.slice(0,4).map(a=><button className="recent-art" key={a.id} onClick={()=>openArtwork(a)}><Thumbnail artwork={a}/><span className="recent-name">{a.name}</span><span className="recent-dimensions">{a.size} × {a.size}</span></button>)}</div> : <div className="empty-gallery"><span className="empty-spark">✳</span><div><strong>Your gallery starts here.</strong><p>Make a little something, then save it here.</p></div><FolderOpen size={18}/></div>}</section>;
}
