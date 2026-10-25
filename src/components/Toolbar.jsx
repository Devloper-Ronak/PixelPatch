import React from 'react';
import * as Icons from 'lucide-react';
import { TOOLS } from '../utils/constants';
export default function Toolbar({ tool, chooseTool, canUndo, canRedo, undo, redo, mirror, setMirror, flipHorizontal, flipVertical, clearCanvas }) {
 return <aside className="tool-panel"><div className="panel-kicker">THE TOOLBOX</div><div className="tool-list">{TOOLS.map(item => { const Icon = Icons[item.icon]; return <button key={item.id} className={`tool-button ${tool === item.id ? 'active' : ''}`} onClick={() => chooseTool(item.id)} title={`${item.label} (${item.key})`}><Icon size={17}/><span>{item.label}</span><kbd>{item.key}</kbd></button>; })}</div>
  <div className="tool-divider"/><div className="panel-kicker">A LITTLE UNDO MAGIC</div><div className="history-actions"><button onClick={undo} disabled={!canUndo} title="Undo"><Icons.Undo2 size={18}/></button><button onClick={redo} disabled={!canRedo} title="Redo"><Icons.Redo2 size={18}/></button></div>
  <div className="tool-divider"/><div className="panel-kicker">TRANSFORM</div><button className="text-tool" onClick={flipHorizontal}><Icons.FlipHorizontal2 size={15}/> Flip horizontal</button><button className="text-tool" onClick={flipVertical}><Icons.FlipVertical2 size={15}/> Flip vertical</button><button className={`text-tool ${mirror ? 'text-tool-on' : ''}`} onClick={() => setMirror(v => !v)}><Icons.Sparkles size={15}/> Mirror drawing {mirror ? 'on' : 'off'}</button><button className="text-tool danger-text" onClick={clearCanvas}><Icons.Trash2 size={15}/> Clear canvas</button>
  <div className="sidebar-note"><span>✳</span><p>Small pixels.<br/>Big ideas.</p></div></aside>;
}
