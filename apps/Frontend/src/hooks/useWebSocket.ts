import { useEffect, useRef, useState } from 'react';

interface UseWebSocketProps {
  token: string | null;
  onGameStart?: (data: any) => void;
  onMove?: (data: any) => void;
  onGameOver?: (data: any) => void;
  onWaitingForOpponent?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useWebSocket = ({
  token,
  onGameStart,
  onMove,
  onGameOver,
  onWaitingForOpponent,
  onError
}: UseWebSocketProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      setConnected(true);
      // Send authentication token
      ws.current?.send(JSON.stringify({ token }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'init_game':
          onGameStart?.(message.payload);
          break;
        case 'move':
          onMove?.(message);
          break;
        case 'GAME OVER':
          onGameOver?.(message.payload);
          break;
        case 'WAITING_FOR_OPPONENT':
          onWaitingForOpponent?.(message.payload);
          break;
        case 'ERROR':
          onError?.(message.message);
          break;
        case 'NO_PAUSED_GAME':
          onError?.('No paused games found');
          break;
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [token]);

  const startNewGame = () => {
    if (ws.current && connected) {
      ws.current.send(JSON.stringify({ type: 'init_game' }));
    }
  };

  const resumeGame = () => {
    if (ws.current && connected) {
      ws.current.send(JSON.stringify({ type: 'resume_game' }));
    }
  };

  const makeMove = (move: { from: string; to: string }) => {
    if (ws.current && connected) {
      ws.current.send(JSON.stringify({ type: 'move', move }));
    }
  };

  return {
    connected,
    startNewGame,
    resumeGame,
    makeMove
  };
};