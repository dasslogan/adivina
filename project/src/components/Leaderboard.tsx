import React from 'react';
import { Player } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  title: string;
  limit?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  players, 
  title,
  limit = 10
}) => {
  const sortedPlayers = [...players]
    .sort((a, b) => a.guessTime - b.guessTime)
    .slice(0, limit);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="w-6 h-6 inline-flex items-center justify-center">{rank + 1}</span>;
    }
  };
  
  return (
    <div className="bg-purple-800 bg-opacity-80 rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
      {sortedPlayers.length === 0 ? (
        <p className="text-center text-gray-300 py-4">No hay jugadores todavía</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-purple-700">
          <table className="min-w-full divide-y divide-purple-700">
            <thead className="bg-purple-900">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Posición
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Jugador
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Tiempo
                </th>
              </tr>
            </thead>
            <tbody className="bg-purple-800 bg-opacity-50 divide-y divide-purple-700">
              {sortedPlayers.map((player, index) => (
                <tr key={player.id} className={index < 3 ? 'bg-purple-900 bg-opacity-50' : ''}>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {player.nickname || player.id}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm">
                      {(player.guessTime / 1000).toFixed(1)}s
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};