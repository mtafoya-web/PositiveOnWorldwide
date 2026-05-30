"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, PerspectiveCamera, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function BrandText() {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!textRef.current) return;
    const t = state.clock.getElapsedTime();
    textRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    textRef.current.position.y = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={textRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          font="/fonts/Inter-Bold.woff" // Assuming font exists or fallback
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          letterSpacing={-0.05}
        >
          POSITIVE ON{"\n"}WORLDWIDE
          <meshStandardMaterial metalness={0.8} roughness={0.1} emissive="white" emissiveIntensity={0.2} />
        </Text>
      </Float>
      
      {/* Abstract Glow Shapes */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          speed={2}
          distort={0.4}
          radius={1}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 h-screen w-full overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} color="white" intensity={0.5} />
        
        <BrandText />
        
        <Environment preset="city" />
      </Canvas>
      
      {/* Gradient Overlay for luxury feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black pointer-events-none" />
    </div>
  );
}
