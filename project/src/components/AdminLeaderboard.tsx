import React, { useState, useEffect } from 'react';
import { fetchTopPlayers } from '../services/apiService';
import { Player } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';

export const AdminLeaderboard: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadTopPlayers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const players = await fetchTopPlayers();
      setTopPlayers(players);
    } catch (err) {
      setError('Error al cargar los mejores jugadores');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadTopPlayers();
  }, []);
  
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Top 5 Jugadores</h2>
        <button 
          onClick={loadTopPlayers}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-100 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <p className="text-center py-4">Cargando jugadores...</p>
      ) : topPlayers.length === 0 ? (
        <p className="text-center py-4">No hay datos de jugadores todavía</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-purple-700">
          <table className="min-w-full divide-y divide-purple-700">
            <thead className="bg-purple-900">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Jugador
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Aciertos
                </th>
              </tr>
            </thead>
            <tbody className="bg-purple-800 bg-opacity-50 divide-y divide-purple-700">
              {topPlayers.map((player, index) => (
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
                    <div className="text-sm font-medium">
                      {player.correctAnswers || 1}
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