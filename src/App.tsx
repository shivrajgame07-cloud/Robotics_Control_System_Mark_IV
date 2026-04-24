/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRobotStore } from './store/useRobotStore';
import { ConnectPanel } from './components/ConnectPanel';
import { Dashboard } from './components/Dashboard';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const { isConnecting, setConnecting } = useRobotStore();

  const handleConnect = () => {
    setConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setConnecting(false);
      setIsStarted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-neon-blue selection:text-slate-900">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ConnectPanel onConnect={handleConnect} isConnecting={isConnecting} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
