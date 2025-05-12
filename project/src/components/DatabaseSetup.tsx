import React, { useState } from 'react';
import { setupDatabase } from '../services/apiService';

export const DatabaseSetup: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiktok_riddles'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateDatabase = async () => {
    setIsCreating(true);
    setStatus('loading');
    setMessage('Creando base de datos...');
    
    try {
      const result = await setupDatabase(dbConfig);
      setStatus('success');
      setMessage(result.message || '¡Base de datos creada exitosamente!');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Error al crear la base de datos.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-purple-800 bg-opacity-80 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Configuración de Base de Datos</h2>
        
        {status !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg ${
            status === 'loading' ? 'bg-blue-500 bg-opacity-20 text-blue-100' :
            status === 'success' ? 'bg-green-500 bg-opacity-20 text-green-100' :
            'bg-red-500 bg-opacity-20 text-red-100'
          }`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Host
            </label>
            <input
              type="text"
              name="host"
              value={dbConfig.host}
              onChange={handleChange}
              className="w-full rounded-lg bg-purple-900 border border-purple-700 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 text-white px-4 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="user"
              value={dbConfig.user}
              onChange={handleChange}
              className="w-full rounded-lg bg-purple-900 border border-purple-700 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 text-white px-4 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={dbConfig.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-purple-900 border border-purple-700 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 text-white px-4 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre de Base de Datos
            </label>
            <input
              type="text"
              name="database"
              value={dbConfig.database}
              onChange={handleChange}
              className="w-full rounded-lg bg-purple-900 border border-purple-700 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 text-white px-4 py-2"
            />
          </div>
        </div>
        
        <div className="bg-indigo-900 bg-opacity-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2">Esta acción creará:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Base de datos "{dbConfig.database}"</li>
            <li>Tabla de adivinanzas (riddles)</li>
            <li>Tabla de puntuación de jugadores (players)</li>
            <li>Datos de ejemplo para comenzar</li>
          </ul>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleCreateDatabase}
            disabled={isCreating}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors duration-200"
          >
            {isCreating ? 'Creando...' : 'Crear Base de Datos'}
          </button>
        </div>
      </div>
    </div>
  );
};