import { useState, useEffect } from 'react';

interface PausedGame {
  id: string;
  whitePlayer: { name: string };
  blackPlayer: { name: string };
  boardState: string;
  currentTurn: string;
  moves: Array<{
    from: string;
    to: string;
    notation: string;
  }>;
}

export const useGameResume = (token: string | null) => {
  const [pausedGames, setPausedGames] = useState<PausedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPausedGames = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/game/paused', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch paused games');
      }
      
      const games = await response.json();
      setPausedGames(games);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPausedGames();
  }, [token]);

  return {
    pausedGames,
    loading,
    error,
    refetch: fetchPausedGames
  };
};