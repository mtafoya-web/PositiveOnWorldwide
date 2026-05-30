"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text, Environment, Float, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function AnimatedText() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <Center>
          <Text
            fontSize={1.5}
            color="#ffffff"
            fontWeight="bold"
            letterSpacing={0.1}
          >
            POSITIVE
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
          </Text>
        </Center>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <AnimatedText />
          <Sparkles count={100} scale={12} size={2} speed={0.4} color="#ffffff" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
