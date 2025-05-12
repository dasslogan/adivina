import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Game } from './components/Game';
import { Admin } from './components/Admin';
import { DatabaseSetup } from './components/DatabaseSetup';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'admin' | 'setup'>('game');

  return (
    <Layout>
      <nav className="bg-purple-800 text-white p-4 mb-6 rounded-lg shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">TikTok Riddle Challenge</h1>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentView('game')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'game' ? 'bg-pink-500' : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors duration-200`}
            >
              Game
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'admin' ? 'bg-pink-500' : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors duration-200`}
            >
              Admin
            </button>
            <button
              onClick={() => setCurrentView('setup')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'setup' ? 'bg-pink-500' : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors duration-200`}
            >
              Setup DB
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto">
        {currentView === 'game' && <Game />}
        {currentView === 'admin' && <Admin />}
        {currentView === 'setup' && <DatabaseSetup />}
      </div>
    </Layout>
  );
}

export default App;