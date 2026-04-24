import React, { useState } from 'react';
import { Camera, Maximize2, RefreshCcw, Wifi } from 'lucide-react';
import { useRobotStore } from '../store/useRobotStore';
import { cn } from '../lib/utils';

export const CameraFeed: React.FC = () => {
  const { state } = useRobotStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={cn(
      "glass-card overflow-hidden relative group h-full transition-all duration-500",
      isFullscreen ? "fixed inset-0 z-50 rounded-none" : "w-full"
    )}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-tighter">REC</span>
              <span className="text-[10px] text-white font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur border border-white/5 uppercase">CAM_01_ESP32</span>
            </div>
            <div className="text-[10px] text-slate-400 font-display tracking-widest uppercase">Visual Stream</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCcw className="w-4 h-4 text-white/60" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {state.demoMode || !state.connected ? (
          <div className="relative w-full h-full">
            {/* Mock Image for Demo Mode as seen in theme */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800')] bg-cover opacity-20 grayscale brightness-50" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-48 h-48 border border-white/5 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 border border-blue-500/10 rounded-full animate-pulse" />
               </div>
               <div className="absolute w-full h-[1px] bg-white/5"></div>
               <div className="absolute h-full w-[1px] bg-white/5"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Wifi className="w-10 h-10 text-blue-500/30 mb-2 animate-pulse" />
              <p className="text-[10px] text-blue-400/50 font-mono uppercase tracking-[0.2em]">Searching for Signal...</p>
            </div>
          </div>
        ) : (
          <img 
            src="http://192.168.1.45:81/stream" 
            alt="Robot View" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Overlay Stats */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end border-t border-white/5 pt-2">
        <div className="font-mono text-[9px] text-blue-300/60 uppercase tracking-tight">
          FPS: 24.5 | BITRATE: 1.2Mbps
        </div>
        <div className="font-mono text-[9px] text-slate-500 uppercase">
          Latency: {state.connected ? "12ms" : "---"}
        </div>
      </div>
    </div>
  );
};
