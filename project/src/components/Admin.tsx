import React, { useState, useEffect } from 'react';
import { RiddleForm } from './RiddleForm';
import { AdminLeaderboard } from './AdminLeaderboard';
import { Riddle } from '../types';
import { fetchRiddles, deleteRiddle } from '../services/apiService';

export const Admin: React.FC = () => {
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [selectedRiddle, setSelectedRiddle] = useState<Riddle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRiddles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchRiddles();
      setRiddles(data);
    } catch (err) {
      setError('Error al cargar las adivinanzas. Asegúrate de que la base de datos esté configurada correctamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRiddles();
  }, []);

  const handleDeleteRiddle = async (id: number) => {
    if (!confirm('¿Estás seguro que deseas eliminar esta adivinanza?')) return;
    
    setIsLoading(true);
    try {
      await deleteRiddle(id);
      loadRiddles(); // Reload the list
    } catch (err) {
      setError('Error al eliminar la adivinanza.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-purple-800 bg-opacity-80 rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Gestionar Adivinanzas</h2>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-100 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <RiddleForm 
            riddle={selectedRiddle} 
            onSuccess={() => {
              setSelectedRiddle(null);
              loadRiddles();
            }}
          />
        </div>

        <div className="bg-purple-800 bg-opacity-80 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Lista de Adivinanzas</h2>
            <button 
              onClick={loadRiddles}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
          
          {isLoading ? (
            <p className="text-center py-4">Cargando adivinanzas...</p>
          ) : riddles.length === 0 ? (
            <p className="text-center py-4">No hay adivinanzas disponibles. Agrega una nueva.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-700">
                <thead className="bg-purple-900">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                      Pregunta
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                      Respuesta
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-purple-800 bg-opacity-50 divide-y divide-purple-700">
                  {riddles.map((riddle) => (
                    <tr key={riddle.id}>
                      <td className="py-3 px-4 whitespace-nowrap">{riddle.id}</td>
                      <td className="py-3 px-4">
                        {riddle.question.length > 50 
                          ? `${riddle.question.substring(0, 50)}...` 
                          : riddle.question}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{riddle.answer}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedRiddle(riddle)}
                          className="text-blue-400 hover:text-blue-300 mr-3"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteRiddle(riddle.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <AdminLeaderboard />
      </div>
    </div>
  );
};