export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface RobotState {
  connected: boolean;
  demoMode: boolean;
  position: Vector3;
  rotation: number;
  battery: number;
  speed: number;
  temp: number;
  humidity: number;
  signal: number;
  lastCommand: string;
  path: { x: number; z: number }[];
}

export type CommandType = "MOVE" | "STOP" | "ROTATE" | "PATH" | "VOICE";

export interface RobotCommand {
  type: CommandType;
  payload: any;
  timestamp: number;
}
