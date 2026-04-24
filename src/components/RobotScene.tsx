import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRobotStore } from '../store/useRobotStore';

const RobotModel = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { state } = useRobotStore();

  useFrame((clock) => {
    if (meshRef.current) {
      // Smooth interpolation
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, state.position.x, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, state.position.z, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, state.rotation, 0.1);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Robot Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.4, 1]} />
        <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Robot "Head" / Sensor Pod */}
      <mesh position={[0, 0.6, 0.3]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
      </mesh>
      {/* Wheels */}
      {[-0.45, 0.45].map((x, i) => (
        <group key={i} position={[x, 0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 1, 0]} color="#00f2ff" intensity={2} />
    </group>
  );
};

const PathLine = () => {
  const { state } = useRobotStore();
  const pathPoints = state.path.map(p => new THREE.Vector3(p.x, 0.05, p.z));

  if (pathPoints.length < 2) return null;

  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={pathPoints} />
      <lineBasicMaterial attach="material" color="#bc13fe" linewidth={2} transparent opacity={0.5} />
    </line>
  );
}

export const RobotScene: React.FC = () => {
  return (
    <div className="w-full h-full glass-card overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />

        <Suspense fallback={null}>
          <RobotModel />
          <PathLine />
          
          <Grid 
            infiniteGrid 
            sectionSize={5} 
            sectionThickness={1.5} 
            sectionColor="#bc13fe" 
            cellSize={1} 
            cellThickness={1} 
            cellColor="#444" 
          />
          
          <Environment preset="city" />
        </Suspense>
        
        <fog attach="fog" args={['#0a0a12', 5, 25]} />
      </Canvas>
      
      {/* HUD Info Overlay */}
      <div className="absolute top-4 right-4 pointer-events-none text-right">
        <h4 className="font-display text-xs text-neon-purple tracking-widest uppercase">Digital Twin</h4>
        <p className="font-mono text-[10px] text-white/40">SYNCED | RT-X KERNEL 0.9</p>
      </div>
    </div>
  );
};
