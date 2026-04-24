import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Wifi, ShieldCheck, ArrowRight } from 'lucide-react';

interface ConnectPanelProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export const ConnectPanel: React.FC<ConnectPanelProps> = ({ onConnect, isConnecting }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#0a1025_0%,_#02040a_100%)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg glass-card p-12 relative overflow-hidden group border-white/10"
      >
        {/* Animated background accent */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-colors duration-700" />
        
        <div className="relative z-10 space-y-10 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-10 animate-pulse" />
              <div className="w-24 h-24 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-6 backdrop-blur-md">
                <Cpu className="w-full h-full text-blue-400" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold tracking-[-0.05em] text-white mb-3">
              ROBO-X <span className="text-blue-500">MK.IV</span>
            </h1>
            <p className="text-slate-400 font-sans text-sm max-w-xs mx-auto leading-relaxed">
              Industrial-grade robotics interface. Initialize neural link to connect to system core.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <Wifi className="w-4 h-4 text-green-400 mb-2" />
              <div className="text-[9px] text-slate-500 uppercase font-mono tracking-widest leading-none mb-1">Protocol</div>
              <div className="text-xs text-white font-medium">Link-Sync v4</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-purple-400 mb-2" />
              <div className="text-[9px] text-slate-500 uppercase font-mono tracking-widest leading-none mb-1">Status</div>
              <div className="text-xs text-white font-medium">Core Secure</div>
            </div>
          </div>

          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full group relative py-4 bg-blue-600 rounded-xl font-display text-sm font-bold tracking-[0.2em] text-white transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-blue-900/20"
          >
             <span className="relative z-10 flex items-center justify-center gap-2 uppercase">
               {isConnecting ? "Establishing Neural Link..." : "Initialize System"}
               {!isConnecting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> }
             </span>
          </button>
          
          <div className="flex items-center justify-center gap-4 pt-4 opacity-30">
            <div className="h-[1px] flex-1 bg-white/20" />
            <span className="text-[8px] font-mono text-white uppercase tracking-[0.4em]">Hardware Layer 1.0.4</span>
            <div className="h-[1px] flex-1 bg-white/20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
