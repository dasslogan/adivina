import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');
  const websocketRef = useRef<WebSocket | null>(null);
  
  const connect = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) return;
    
    setConnectionStatus('connecting');
    
    // Use the current window location for WebSocket connection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      websocketRef.current = null;
      console.log('WebSocket disconnected, trying to reconnect...');
      
      // Try to reconnect after a delay
      setTimeout(connect, 2000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };
    
    ws.onmessage = (event) => {
      setLastMessage(event.data);
    };
    
    websocketRef.current = ws;
  }, []);
  
  useEffect(() => {
    connect();
    
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [connect]);
  
  return { isConnected, lastMessage, connectionStatus };
}