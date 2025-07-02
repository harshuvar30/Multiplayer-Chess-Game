import React from 'react';
import { useGameResume } from '../hooks/useGameResume';

interface ResumeGameProps {
  token: string | null;
  onResumeGame: () => void;
}

export const ResumeGame: React.FC<ResumeGameProps> = ({ token, onResumeGame }) => {
  const { pausedGames, loading, error } = useGameResume(token);

  if (loading) return <div>Loading paused games...</div>;
  if (error) return <div>Error: {error}</div>;
  if (pausedGames.length === 0) return null;

  return (
    <div className="resume-game-section">
      <h3>Resume Previous Games</h3>
      {pausedGames.map((game) => (
        <div key={game.id} className="paused-game-card">
          <p>
            <strong>Game:</strong> {game.whitePlayer.name} (White) vs {game.blackPlayer.name} (Black)
          </p>
          <p><strong>Current Turn:</strong> {game.currentTurn}</p>
          <p><strong>Moves:</strong> {game.moves.length}</p>
          <button onClick={onResumeGame}>Resume Game</button>
        </div>
      ))}
    </div>
  );
};