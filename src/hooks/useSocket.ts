import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRobotStore } from '../store/useRobotStore';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { updateState, setConnecting, addCommand } = useRobotStore();

  useEffect(() => {
    setConnecting(true);
    const socket = io(); // Connects to the same host
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to ROBO-X Server');
      setConnecting(false);
      updateState({ connected: true });
    });

    socket.on('status', (data) => {
      updateState(data);
    });

    socket.on('telemetry', (data) => {
      updateState(data);
    });

    socket.on('robot_update', (data) => {
      updateState(data);
    });

    socket.on('disconnect', () => {
      updateState({ connected: false });
    });

    return () => {
      socket.disconnect();
    };
  }, [updateState, setConnecting]);

  const sendCommand = (type: string, payload: any) => {
    if (socketRef.current) {
      const command = { type, payload, timestamp: Date.now() };
      socketRef.current.emit('command', command);
      addCommand(command as any);
    }
  };

  const toggleDemoMode = (enabled: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('set_demo_mode', enabled);
    }
  };

  return { sendCommand, toggleDemoMode };
};
