import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="w-5 h-5 text-green-400" />,
          label: 'Conectado a TikFinity',
          color: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: <Wifi className="w-5 h-5 text-yellow-400 animate-pulse" />,
          label: 'Conectando a TikFinity...',
          color: 'bg-yellow-500'
        };
      case 'error':
        return {
          icon: <WifiOff className="w-5 h-5 text-red-400" />,
          label: 'Error de conexión',
          color: 'bg-red-500'
        };
      case 'disconnected':
      default:
        return {
          icon: <WifiOff className="w-5 h-5 text-gray-400" />,
          label: 'Desconectado - Inicie TikFinity App',
          color: 'bg-gray-500'
        };
    }
  };

  const { icon, label, color } = getStatusInfo();

  return (
    <div className="mb-6 flex justify-center">
      <div className={`${color} bg-opacity-20 rounded-full px-4 py-2 flex items-center`}>
        {icon}
        <span className="ml-2 text-sm">{label}</span>
      </div>
    </div>
  );
};