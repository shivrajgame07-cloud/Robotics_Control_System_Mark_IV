import React from 'react';
import { CameraFeed } from './CameraFeed';
import { RobotScene } from './RobotScene';
import { TelemetryPanel } from './TelemetryPanel';
import { Controls } from './Controls';
import { useRobotStore } from '../store/useRobotStore';
import { useSocket } from '../hooks/useSocket';
import { Power, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { state } = useRobotStore();
  const { sendCommand } = useSocket();

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4 max-h-screen overflow-hidden">
      {/* Header Navigation */}
      <header className="flex items-center justify-between h-14 px-6 glass-card border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]",
              state.connected ? "bg-blue-500" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            )} />
            <span className="text-lg font-bold tracking-widest text-white font-display">
              ROBO-X <span className="text-blue-400">MK.IV</span>
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            <span>System: {state.connected ? 'Online' : 'Offline'}</span>
            <span className={state.connected ? "text-green-400" : "text-red-400"}>
              • Latency: {state.connected ? '12ms' : 'N/A'}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex gap-4 items-center bg-black/40 px-4 py-1.5 rounded-xl border border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 uppercase leading-none tracking-tight">Active Protocol</span>
              <span className="text-xs text-blue-300 font-mono tracking-tight">{state.lastCommand}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <button className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/40 text-red-500 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all">
            Emergency Stop
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
        {/* LEFT: Camera Feed Panel */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <CameraFeed />
          <div className="h-48 glass-card p-4 flex flex-col overflow-hidden">
            <h3 className="text-[10px] font-mono uppercase text-slate-500 mb-3 tracking-widest">Alert Log</h3>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {[
                { time: "14:22:01", msg: "CMD_RCV: GOTO_POS(24,12)", type: "info" },
                { time: "14:22:02", msg: "AI_PROC: PATH_OPTIMIZED", type: "success" },
                { time: "14:22:10", msg: "WARN: OBSTACLE_DETECT_70CM", type: "warning" }
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-[9px] font-mono border-l border-white/10 pl-3">
                  <span className="text-blue-400/50">[{log.time}]</span>
                  <span className={cn(
                    log.type === "success" ? "text-green-400" : 
                    log.type === "warning" ? "text-yellow-400" : "text-slate-300"
                  )}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: 3D Simulation View */}
        <section r-id="3d-view" className="col-span-12 lg:col-span-6 relative overflow-hidden">
          <RobotScene />
        </section>

        {/* RIGHT: Status & Telemetry */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden text-slate-200">
          <TelemetryPanel />
          <div className="bg-red-600/5 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
             <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-600/40">
                <ShieldAlert className="w-5 h-5 text-red-500" />
             </div>
             <div>
                <h4 className="text-[10px] font-display text-red-500 tracking-widest uppercase leading-none">Safety Interlock</h4>
                <p className="text-[9px] font-mono text-white/40 uppercase mt-1">Obstacle detection active</p>
             </div>
          </div>
        </aside>
      </main>

      {/* Footer Controls Panel */}
      <footer className="h-[180px] min-h-[180px]">
        <Controls onCommand={sendCommand} />
      </footer>
    </div>
  );
};
