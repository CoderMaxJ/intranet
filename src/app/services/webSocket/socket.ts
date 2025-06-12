import { useEffect, useRef } from 'react';

const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');

      // Send "ping" every 30 seconds
      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'pong') {
        console.log('Received pong from server');
      } else {
        console.log('Message from server:', data);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };

    return () => {
      socket.close();
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [url]);

  return socketRef.current;
};

export default useWebSocket;
