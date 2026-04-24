import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Navigation, ShieldOff, PlayCircle, StopCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRobotStore } from '../store/useRobotStore';
import { parseVoiceCommand } from '../utils/voiceParser';
import { cn } from '../lib/utils';

export const Controls: React.FC<{ onCommand: (type: string, payload: any) => void }> = ({ onCommand }) => {
  const { state } = useRobotStore();
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': onCommand("MOVE", { x: 0, z: 1 }); break;
        case 's': onCommand("MOVE", { x: 0, z: -1 }); break;
        case 'a': onCommand("MOVE", { x: -1, z: 0 }); break;
        case 'd': onCommand("MOVE", { x: 1, z: 0 }); break;
        case ' ': onCommand("STOP", {}); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCommand]);

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setVoiceText(text);
      const cmd = parseVoiceCommand(text);
      if (cmd) {
        onCommand(cmd.type, cmd.params);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Movement Controls */}
      <div className="glass-card p-4 flex items-center justify-center gap-8 relative overflow-hidden bg-black/20 border-white/10">
        <div className="absolute top-3 left-4 text-[9px] uppercase font-mono text-slate-500 tracking-[0.2em]">Manual Vectors</div>
        
        <div className="relative w-32 h-32 bg-black/40 rounded-full border border-white/5 flex items-center justify-center shadow-inner">
          <motion.div 
            drag
            dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
            onDrag={(e, info) => {
              onCommand("MOVE", { x: info.offset.x / 40, z: -info.offset.y / 40 });
            }}
            onDragEnd={() => onCommand("STOP", {})}
            className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full border-2 border-white/20 shadow-2xl relative cursor-grab active:cursor-grabbing active:scale-95 transition-transform"
          >
            <div className="absolute top-1 left-4 right-4 h-2 bg-white/10 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Navigation className="w-5 h-5 text-white/20" />
            </div>
          </motion.div>
          <div className="absolute -top-4 text-[9px] uppercase text-slate-600 font-mono">Forward</div>
          <div className="absolute -bottom-4 text-[9px] uppercase text-slate-600 font-mono">Backward</div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => onCommand("MOVE", {x:0,z:1})} className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xl hover:bg-blue-500/20 text-slate-400 transition-colors">↑</button>
          <div className="flex gap-2">
            <button onClick={() => onCommand("MOVE", {x:-1,z:0})} className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xl hover:bg-blue-500/20 text-slate-400 transition-colors">←</button>
            <button onClick={() => onCommand("MOVE", {x:0,z:-1})} className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xl hover:bg-blue-500/20 text-slate-400 transition-colors">↓</button>
            <button onClick={() => onCommand("MOVE", {x:1,z:0})} className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xl hover:bg-blue-500/20 text-slate-400 transition-colors">→</button>
          </div>
        </div>
      </div>

      {/* Speed & Performance */}
      <div className="col-span-2 glass-card p-5 flex flex-col justify-between border-white/10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-widest leading-none">Thrust & Velocity</h3>
             <p className="text-[8px] font-mono text-white/30 uppercase">Neural-Sync v4 Active</p>
          </div>
          <div className="flex gap-2">
             <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 uppercase font-mono tracking-wider">Auto-Mode</span>
             <button onClick={handleVoice} className={cn(
               "p-1.5 rounded transition-all",
               isListening ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/30 hover:text-blue-400"
             )}>
               <Mic className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 py-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-tight">
              <span className="text-slate-500">Peak Velocity</span>
              <span className="text-blue-400">{(state.speed * 1.2).toFixed(1)} m/s</span>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, state.speed * 20)}%` }}
                 className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
               />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-tight">
              <span className="text-slate-500">Acceleration</span>
              <span className="text-purple-400">1.2 m/s²</span>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-gradient-to-r from-purple-600 to-pink-400 w-[40%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
           <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/10">Launch Auto-Patrol</button>
           <button onClick={() => onCommand("STOP", {})} className="flex-1 py-3 bg-white/5 border border-white/10 text-red-500 hover:bg-red-500/10 text-[10px] font-bold rounded-xl uppercase tracking-[0.2em] transition-all">Return to Dock</button>
        </div>
      </div>

      {/* Signal Strength */}
      <div className="glass-card p-4 flex flex-col justify-center items-center gap-3 border-white/10">
        <div className="flex items-end gap-1.5 mb-2">
          {[4, 7, 10, 14, 18].map((h, i) => (
            <div key={i} className={cn(
              "w-2.5 rounded-sm transition-opacity duration-500",
              `h-${h}`,
              i < 3 ? "bg-blue-400" : "bg-blue-400 opacity-20"
            )} 
            style={{ height: `${h * 4}px` }}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-slate-300 tracking-wider">SIGNAL: -64dBm</div>
          <div className="text-[8px] text-blue-500 uppercase tracking-[0.3em] font-display animate-pulse mt-1">Synchronizing...</div>
        </div>
      </div>
    </div>
  );
};
