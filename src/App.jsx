import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FilePlus2, FolderOpen, Grid2X2, Keyboard, Save, ChevronDown, Undo2, Redo2, FlipHorizontal2, FlipVertical2, Maximize2, RotateCcw, Sparkles } from 'lucide-react';
import Toolbar from './components/Toolbar.jsx';
import PixelBoard from './components/PixelBoard.jsx';
import PalettePanel from './components/PalettePanel.jsx';
import Gallery from './components/Gallery.jsx';
import Dialogs from './components/Dialogs.jsx';
import useHistory from './hooks/useHistory.js';
import { blankPixels, floodFill, drawShape, exportPng as downloadPng } from './utils/drawing.js';
import { readArtworks, writeArtworks } from './utils/storage.js';

export default function App() {
 const [size,setSize]=useState(16), [pixels,setPixels]=useState(()=>blankPixels(16));
 const [color,setColor]=useState('#405B49'), [customColor,setCustomColor]=useState('#405B49'), [tool,setTool]=useState('pencil');
 const [showGrid,setShowGrid]=useState(true), [mirror,setMirror]=useState(false), [zoom,setZoom]=useState(1), [artName,setArtName]=useState('untitled-garden');
 const [artworks,setArtworks]=useState(readArtworks), [savedMessage,setSavedMessage]=useState('Saved locally'), [modal,setModal]=useState(''), [menu,setMenu]=useState(''), [lineStart,setLineStart]=useState(null);
 const boardRef=useRef(null), painting=useRef(false), lastIndex=useRef(-1), startPixels=useRef(null), pixelsRef=useRef(pixels);
 const history=useHistory(pixels);
 const setCurrent=next=>{pixelsRef.current=next;setPixels(next)};
 const commit=next=>{setCurrent(next);history.push(next)};
 const resetBoard=(next,nextSize=size)=>{setSize(nextSize);setCurrent(next);history.reset(next);setLineStart(null);painting.current=false};
 const undo=()=>{const value=history.undo();if(value)setCurrent(value)};
 const redo=()=>{const value=history.redo();if(value)setCurrent(value)};
 const chooseTool=id=>{setTool(id);setLineStart(null)};
 const getIndex=e=>{const cell=e.target.closest('[data-cell]');if(cell&&boardRef.current?.contains(cell))return Number(cell.dataset.cell);const r=boardRef.current?.getBoundingClientRect();if(!r||e.clientX<r.left||e.clientX>=r.right||e.clientY<r.top||e.clientY>=r.bottom)return -1;return Math.floor((e.clientY-r.top)/r.height*size)*size+Math.floor((e.clientX-r.left)/r.width*size)};
 const paintAt=(source,index)=>{if(index<0||index>=source.length)return source;if(tool==='eyedropper'){if(source[index]){setColor(source[index]);setCustomColor(source[index])}return source}if(tool==='fill')return floodFill(source,index,color,size);const next=[...source];const paint=(i)=>{if(i>=0&&i<next.length)next[i]=tool==='eraser'?null:color};paint(index);if(mirror&&tool!=='fill'){const x=index%size,y=Math.floor(index/size);paint(y*size+size-1-x)}return next};
 const handleDown=e=>{const index=getIndex(e);if(index<0)return;e.preventDefault();if(['line','rectangle','circle'].includes(tool)){if(lineStart===null)setLineStart(index);else{commit(drawShape(pixelsRef.current,lineStart,index,tool,color,size,mirror));setLineStart(null)}return}if(tool==='eyedropper'){paintAt(pixelsRef.current,index);return}if(tool==='fill'){commit(paintAt(pixelsRef.current,index));return}painting.current=true;startPixels.current=pixelsRef.current;lastIndex.current=index;boardRef.current?.setPointerCapture?.(e.pointerId);setCurrent(paintAt(pixelsRef.current,index))};
 const handleMove=e=>{if(!painting.current)return;const index=getIndex(e);if(index<0||index===lastIndex.current)return;lastIndex.current=index;setCurrent(paintAt(pixelsRef.current,index))};
 const handleUp=()=>{if(!painting.current)return;painting.current=false;const before=startPixels.current,after=pixelsRef.current;if(before&&before.some((v,i)=>v!==after[i]))history.push(after);startPixels.current=null;lastIndex.current=-1};
 const clearCanvas=()=>{if(window.confirm('Clear the whole canvas? You can undo this action.'))commit(blankPixels(size));setLineStart(null)};
 const newArtwork=()=>{if(!window.confirm('Start a new artwork? Save your current work first if you want to keep it.'))return;setArtName('untitled-artwork');resetBoard(blankPixels(size));setModal('');setMenu('')};
 const changeSize=n=>{if(n===size)return;if(window.confirm(`Resize to ${n} × ${n}? This clears the current canvas.`))resetBoard(blankPixels(n),n)};
 const saveArtwork=()=>{const name=artName.trim()||'untitled-artwork';const item={id:Date.now(),name,size,pixels:[...pixelsRef.current],updatedAt:new Date().toISOString()};const next=[item,...artworks.filter(a=>a.name!==name)].slice(0,50);try{writeArtworks(next);setArtworks(next);setSavedMessage('Just saved ✓');window.setTimeout(()=>setSavedMessage('Saved locally'),2200)}catch{window.alert('Browser storage is full. Delete a few saved artworks and try again.')}setMenu('')};
 const openArtwork=artwork=>{if(!artwork||!Array.isArray(artwork.pixels)||artwork.pixels.length!==artwork.size*artwork.size){window.alert('This saved artwork is not valid.');return}setArtName(artwork.name);resetBoard([...artwork.pixels],artwork.size);setModal('');setMenu('')};
 const deleteArtwork=id=>{if(!window.confirm('Delete this saved artwork? This cannot be undone.'))return;const next=artworks.filter(a=>a.id!==id);setArtworks(next);try{writeArtworks(next)}catch{window.alert('Could not update browser storage.')}};
 const flip=(vertical=false)=>{const next=blankPixels(size);for(let y=0;y<size;y++)for(let x=0;x<size;x++)next[y*size+x]=pixelsRef.current[(vertical?size-1-y:y)*size+(vertical?x:size-1-x)];commit(next)};
 const exportPng=(scale,transparent)=>downloadPng({pixels:pixelsRef.current,size,scale,transparent,name:artName});
 const filled=pixels.filter(Boolean).length;
 useEffect(()=>{const onKey=e=>{const t=e.target;if(t instanceof HTMLElement&&(t.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(t.tagName)))return;const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();undo();return}if((e.ctrlKey||e.metaKey)&&k==='y'){e.preventDefault();redo();return}if((e.ctrlKey||e.metaKey)&&k==='s'){e.preventDefault();saveArtwork();return}if(e.key==='Escape'){setModal('');setMenu('');setLineStart(null);return}if((e.ctrlKey||e.metaKey)&&k==='n'){e.preventDefault();newArtwork();return}const map={p:'pencil',e:'eraser',g:'fill',i:'eyedropper',l:'line',r:'rectangle',c:'circle'};if(map[k])chooseTool(map[k])};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)});
 useEffect(()=>{const stop=()=>handleUp();window.addEventListener('pointerup',stop);return()=>window.removeEventListener('pointerup',stop)});
 return <div className="app-shell" onClick={()=>menu&&setMenu('')}>
  <header className="topbar"><a className="brand" href="#studio" onClick={e=>e.preventDefault()}><span className="brand-mark"><i/><i/><i/><i/></span><span>pixelpatch<span className="brand-period">.</span></span></a>
   <nav className="top-nav" onClick={e=>e.stopPropagation()}>{[['file','File'],['edit','Edit'],['view','View']].map(([id,label])=><div className="menu-wrap" key={id}><button onClick={()=>setMenu(menu===id?'':id)}>{label}<ChevronDown size={13}/></button>{menu===id&&<div className="dropdown-menu">{(id==='file'?[['New artwork',FilePlus2,newArtwork],['Save artwork',Save,saveArtwork],['Open artwork',FolderOpen,()=>setModal('open')],['Export PNG',Download,()=>setModal('export')]]:id==='edit'?[['Undo',Undo2,undo],['Redo',Redo2,redo],['Flip horizontal',FlipHorizontal2,()=>flip(false)],['Flip vertical',FlipVertical2,()=>flip(true)],['Clear canvas',Sparkles,clearCanvas]]:[['Toggle grid',Grid2X2,()=>setShowGrid(v=>!v)],['Reset zoom',Maximize2,()=>setZoom(1)],['Keyboard shortcuts',Keyboard,()=>setModal('shortcuts')]]).map(([text,Icon,action])=><button key={text} onClick={()=>{action();setMenu('')}}><Icon size={15}/>{text}</button>)}</div>}</div>)}</nav>
   <div className="document-title"><span className="document-dot"/><input value={artName} onChange={e=>setArtName(e.target.value)} aria-label="Artwork name"/><span className="file-extension">.px</span></div><div className="top-actions"><span className="save-status">{savedMessage}</span><button className="export-button" onClick={()=>setModal('export')}><Download size={15}/> Export PNG</button></div>
  </header>
  <main className="workspace" id="studio"><Toolbar tool={tool} chooseTool={chooseTool} canUndo={history.canUndo} canRedo={history.canRedo} undo={undo} redo={redo} mirror={mirror} setMirror={setMirror} flipHorizontal={()=>flip(false)} flipVertical={()=>flip(true)} clearCanvas={clearCanvas}/>
   <section className="canvas-area"><div className="canvas-heading"><div><div className="eyebrow">YOUR LITTLE ART STUDIO</div><h1>Make something <em>tiny.</em></h1><p className="heading-note">A few pixels, a little patience, and whatever you imagine.</p></div><div className="canvas-actions"><button className={`mini-action ${showGrid?'selected':''}`} onClick={()=>setShowGrid(v=>!v)}><Grid2X2 size={15}/> Grid</button><span className="mini-separator"/><button className="zoom-button" onClick={()=>setZoom(v=>v>=1.5?.75:v+.25)} title="Zoom in">{Math.round(zoom*100)}% <span>＋</span></button><button className="zoom-button" onClick={()=>setZoom(1)} title="Reset zoom"><RotateCcw size={13}/></button></div></div>
    <div className="canvas-stage"><div className="canvas-paper"><PixelBoard pixels={pixels} size={size} showGrid={showGrid} zoom={zoom} lineStart={lineStart} boardRef={boardRef} onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp}/></div><div className="stage-caption"><span><i className="live-dot"/>{['line','rectangle','circle'].includes(tool)?(lineStart===null?'Click a starting point, then an ending point':'Now click an ending point'):`${tool[0].toUpperCase()+tool.slice(1)} selected`}{mirror?' · Mirror on':''}</span><span>{size} × {size} px <b>/</b> {filled} coloured pixels</span></div></div>
    <Gallery artworks={artworks} openArtwork={openArtwork} openLibrary={()=>setModal('open')}/>
   </section>
   <PalettePanel color={color} setColor={setColor} customColor={customColor} setCustomColor={setCustomColor} size={size} changeSize={changeSize} showGrid={showGrid} setShowGrid={setShowGrid} mirror={mirror} setMirror={setMirror}/>
  </main><Dialogs modal={modal} setModal={setModal} artworks={artworks} openArtwork={openArtwork} deleteArtwork={deleteArtwork} pixels={pixels} size={size} artName={artName} exportPng={exportPng} newArtwork={newArtwork}/>
 </div>;
}
