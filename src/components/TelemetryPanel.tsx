import React from 'react';
import { Battery, Thermometer, Droplets, Zap, Activity, Signal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRobotStore } from '../store/useRobotStore';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const data = [
  { time: '0s', val: 0 },
  { time: '1s', val: 10 },
  { time: '2s', val: 25 },
  { time: '3s', val: 15 },
  { time: '4s', val: 40 },
  { time: '5s', val: 30 },
];

interface StatItemProps {
  label: string;
  value: string | number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, color }) => (
  <div className="bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
    <div className="text-[9px] text-slate-500 uppercase font-mono mb-1 tracking-wider">{label}</div>
    <div className={cn("text-lg font-mono tracking-tight", color)}>{value}</div>
  </div>
);

export const TelemetryPanel: React.FC = () => {
  const { state } = useRobotStore();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Power Core Section */}
      <div className="glass-card p-4 border-white/10 relative overflow-hidden group">
        <h3 className="text-[10px] font-mono uppercase text-slate-500 mb-4 tracking-widest">Power Core</h3>
        
        {/* Vertical Battery Bars */}
        <div className="flex items-end gap-1.5 h-24 mb-4">
          {[80, 85, 75, 90, 88, 95].map((h, i, arr) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              className={cn(
                "flex-1 rounded-sm transition-all duration-1000",
                i === arr.length - 1 
                  ? "bg-green-500/40 border-t-2 border-green-400 shadow-[0_-5px_15px_rgba(74,222,128,0.3)]" 
                  : "bg-green-500/20 border-t border-green-400/40"
              )}
            />
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-mono text-white tracking-tighter">{Math.round(state.battery)}</span>
            <span className="text-[11px] text-slate-500 uppercase font-mono">%</span>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-slate-500 uppercase font-mono tracking-widest leading-none mb-1">Runtime</div>
            <div className="text-sm font-mono text-blue-300 tracking-tight">04:12:45</div>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto scrollbar-hide">
        <StatItem label="Lidar Dist" value={`${state.speed > 0 ? (12.4 - Math.random()).toFixed(1) : "12.4"}m`} color="text-blue-400" />
        <StatItem label="Velocity" value={`${state.speed.toFixed(1)}m/s`} color="text-purple-400" />
        <StatItem label="CPU Temp" value={`${state.temp.toFixed(0)}°C`} color="text-yellow-400" />
        <StatItem label="Humidity" value={`${state.humidity.toFixed(0)}%`} color="text-green-400" />
        <StatItem label="Signal" value={`${state.signal}dBm`} color="text-blue-300" />
        <StatItem label="Voltage" value="12.6V" color="text-slate-300" />
      </div>
    </div>
  );
};
