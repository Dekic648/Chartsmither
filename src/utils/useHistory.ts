import { useState, useCallback, useRef } from 'react';

const MAX_HISTORY = 50;

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

export interface UseHistoryResult<T> {
  state: T;
  set: (val: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory<T>(initial: T): UseHistoryResult<T> {
  const [state, setState] = useState<T>(() => deepClone(initial));
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const set = useCallback((val: T) => {
    setState((prev) => {
      pastRef.current = [...pastRef.current, deepClone(prev)].slice(-MAX_HISTORY);
      futureRef.current = [];
      return deepClone(val);
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (pastRef.current.length === 0) return prev;
      const newPast = [...pastRef.current];
      const previous = newPast.pop()!;
      pastRef.current = newPast;
      futureRef.current = [deepClone(prev), ...futureRef.current].slice(0, MAX_HISTORY);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (futureRef.current.length === 0) return prev;
      const newFuture = [...futureRef.current];
      const next = newFuture.shift()!;
      futureRef.current = newFuture;
      pastRef.current = [...pastRef.current, deepClone(prev)].slice(-MAX_HISTORY);
      return next;
    });
  }, []);

  return {
    state,
    set,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
  };
}
