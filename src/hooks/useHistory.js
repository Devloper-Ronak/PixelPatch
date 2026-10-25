import { useCallback, useRef, useState } from 'react';
export default function useHistory(initialValue) {
  const history = useRef([initialValue]); const index = useRef(0); const [, refresh] = useState(0);
  const push = useCallback(value => { const next = history.current.slice(0, index.current + 1); next.push(value); if (next.length > 100) next.shift(); history.current = next; index.current = next.length - 1; refresh(n => n + 1); }, []);
  const undo = useCallback(() => { if (index.current > 0) { index.current--; refresh(n => n + 1); return history.current[index.current]; } }, []);
  const redo = useCallback(() => { if (index.current < history.current.length - 1) { index.current++; refresh(n => n + 1); return history.current[index.current]; } }, []);
  const reset = useCallback(value => { history.current = [value]; index.current = 0; refresh(n => n + 1); }, []);
  return { push, undo, redo, reset, canUndo: index.current > 0, canRedo: index.current < history.current.length - 1 };
}
