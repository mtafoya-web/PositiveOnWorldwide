"use client";

import { Canvas } from "@react-three/fiber";
import { Center, Text3D, Float, PerspectiveCamera, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";

function Scene() {
  const fontUrl = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json";

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#d8ff3e" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
      <spotLight position={[0, 5, 5]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" castShadow />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center top position={[0, 0.4, 0]}>
          <Text3D
            font={fontUrl}
            size={0.6}
            height={0.1}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            POSITIVE
            <MeshTransmissionMaterial 
              backside
              backsideThickness={0.2}
              thickness={0.05}
              roughness={0.05}
              transmission={1}
              ior={1.5}
              chromaticAberration={0.05}
              anisotropy={0.1}
              distortion={0.1}
              distortionScale={0.1}
              temporalDistortion={0.1}
              clearcoat={1}
              attenuationDistance={0.5}
              attenuationColor="#ffffff"
              color="#ffffff"
            />
          </Text3D>
        </Center>
        <Center bottom position={[0, -0.4, 0]}>
          <Text3D
            font={fontUrl}
            size={0.4}
            height={0.08}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            ON WORLDWIDE
            <MeshTransmissionMaterial 
              backside
              backsideThickness={0.2}
              thickness={0.05}
              roughness={0.05}
              transmission={1}
              ior={1.5}
              chromaticAberration={0.05}
              anisotropy={0.1}
              distortion={0.1}
              distortionScale={0.1}
              temporalDistortion={0.1}
              clearcoat={1}
              attenuationDistance={0.5}
              attenuationColor="#ffffff"
              color="#ffffff"
            />
          </Text3D>
        </Center>
      </Float>

      <mesh position={[0, 0, -2]} scale={20}>
        <planeGeometry />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

export function Hero3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative h-[70vh] w-full bg-ink flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl font-black uppercase tracking-tighter text-chalk md:text-8xl">
            POSITIVE
            <br />
            <span className="text-chalk/60">ON WORLDWIDE</span>
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[75vh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="flex h-full w-full flex-col items-center justify-center bg-ink">
            <h1 className="font-display text-6xl font-black uppercase tracking-tighter text-chalk md:text-8xl animate-pulse">
              POSITIVE
            </h1>
          </div>
        }>
          <Canvas 
            shadows 
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="px-4"
        >
          <p className="font-display text-lg uppercase tracking-[0.4em] text-limeflash md:text-xl">
            Wear the Energy. Spread the Movement.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 pointer-events-auto">
            <button className="bg-chalk px-8 py-3 font-display text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105 active:scale-95">
              Shop the Drop
            </button>
            <button className="border border-chalk/30 px-8 py-3 font-display text-sm font-bold uppercase tracking-wider text-chalk backdrop-blur-sm transition-all hover:bg-chalk/10">
              The Brand
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Dynamic Background Accents */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-limeflash/5 blur-[120px]" />
      <div className="absolute right-0 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
    </section>
  );
}
