import { create } from 'zustand';
import { RobotState, RobotCommand } from '../types';

interface RobotStore {
  state: RobotState;
  isConnecting: boolean;
  error: string | null;
  history: RobotCommand[];
  
  // Actions
  updateState: (newState: Partial<RobotState>) => void;
  setConnecting: (value: boolean) => void;
  setError: (error: string | null) => void;
  addCommand: (command: RobotCommand) => void;
  setDemoMode: (enabled: boolean) => void;
}

export const useRobotStore = create<RobotStore>((set) => ({
  state: {
    connected: false,
    demoMode: true,
    position: { x: 0, y: 0, z: 0 },
    rotation: 0,
    battery: 100,
    speed: 0,
    temp: 25,
    humidity: 50,
    signal: 100,
    lastCommand: 'None',
    path: [],
  },
  isConnecting: false,
  error: null,
  history: [],

  updateState: (newState) => 
    set((s) => ({ state: { ...s.state, ...newState } })),
  
  setConnecting: (value) => set({ isConnecting: value }),
  
  setError: (error) => set({ error }),
  
  addCommand: (command) => 
    set((s) => ({ history: [command, ...s.history].slice(0, 50) })),
    
  setDemoMode: (enabled) => 
    set((s) => ({ state: { ...s.state, demoMode: enabled } })),
}));
