'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const generated = pmrem.fromScene(room, .03);
    const previous = scene.environment;
    scene.environment = generated.texture;
    room.dispose();
    return () => {
      scene.environment = previous;
      generated.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Sculpture({ progress, reducedMotion }: { progress: MutableRefObject<number>; reducedMotion: boolean }) {
  const assembly = useRef<THREE.Group>(null);
  const { size } = useThree();
  const center = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const knot = useRef<THREE.Mesh>(null);
  const silver = <meshPhysicalMaterial color="#cfd5eb" metalness={0.94} roughness={0.12} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.9} />;
  const dark = <meshPhysicalMaterial color="#313a63" metalness={0.92} roughness={0.15} clearcoat={0.9} />;
  const blue = <meshPhysicalMaterial color="#a6b0ff" metalness={0.58} roughness={0.11} transmission={0.15} thickness={1.8} clearcoat={1} />;
  useFrame(({clock, pointer}, delta) => {
    const p = Math.max(0, Math.min(1, progress.current));
    const time = clock.getElapsedTime();
    const ease = (x: number) => x*x*(3-2*x);
    const breakup = ease(Math.max(0,(p-.2)/.65));
    if (assembly.current) {
      assembly.current.rotation.y += reducedMotion ? 0 : Math.min(delta, .05)*(.07+.22*(1-p));
      assembly.current.rotation.x = THREE.MathUtils.lerp(assembly.current.rotation.x, -.28 + (reducedMotion?0:pointer.y*.09) + breakup*.32, .035);
      assembly.current.position.y = reducedMotion ? 0 : Math.sin(time*.58)*.09 - breakup*.2;
      const scale = 1 - breakup*.22;
      assembly.current.scale.setScalar(scale * (size.width < 700 ? .65 : 1));
    }
    if (center.current) {
      center.current.rotation.x += reducedMotion ? 0 : delta*.06;
      center.current.position.z = breakup*1.6;
      center.current.scale.setScalar(1-breakup*.3);
    }
    if (ringA.current) {
      ringA.current.position.x = -breakup*2.3;
      ringA.current.position.z = breakup*1.1;
      ringA.current.rotation.z = .65 + breakup*1.2;
    }
    if (ringB.current) {
      ringB.current.position.x = breakup*2.4;
      ringB.current.position.y = breakup*.6;
      ringB.current.rotation.y = .85 + breakup*2;
    }
    if (knot.current) {
      knot.current.position.y = breakup*1.9;
      knot.current.position.z = -breakup*1.4;
      knot.current.rotation.y += reducedMotion ? 0 : delta*.12;
    }
  });
  return <group ref={assembly} rotation={[0.05,.05,-.18]}>
    <mesh ref={knot} rotation={[.4,.2,.25]} castShadow>
      <torusKnotGeometry args={[1.1,.19,260,20,2,3]}/>{silver}
    </mesh>
    <mesh ref={center} position={[0,0,.02]}>
      <icosahedronGeometry args={[.73, 3]}/>{blue}
    </mesh>
    <mesh ref={ringA} rotation={[.6,.2,.65]}>
      <torusGeometry args={[1.75,.045,14,180]}/>{silver}
    </mesh>
    <mesh ref={ringB} rotation={[1.1,.85,.1]}>
      <torusGeometry args={[1.91,.038,12,160]}/>{dark}
    </mesh>
    <mesh rotation={[1.4,-.3,0]}><torusGeometry args={[1.38,.017,8,150]}/><meshBasicMaterial color="#a9b6ff" transparent opacity={.63}/></mesh>
    {Array.from({length:6},(_,i)=>{ const angle=i*Math.PI/3; return <mesh key={i} position={[Math.sin(angle)*1.67, Math.cos(angle)*1.67, Math.cos(angle*2)*.28]}>
      <sphereGeometry args={[.055,12,12]}/><meshStandardMaterial color="#edf0ff" emissive="#8f9afa" emissiveIntensity={.5}/>
    </mesh>})}
  </group>;
}

export default function SculptureScene({ progress, reducedMotion = false }: { progress: MutableRefObject<number>; reducedMotion?: boolean }) {
  return <Canvas className="sculpture-canvas" dpr={[1,1.7]} camera={{position:[0,0,7.8],fov:37}} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}} fallback={<div className="sculpture-fallback"/>}>
    <StudioEnvironment/>
    <ambientLight intensity={1.05} color="#b4baff"/>
    <hemisphereLight args={['#dce3ff','#141629',2.2]}/>
    <directionalLight position={[4,7,7]} intensity={5.3} color="#ffffff"/>
    <pointLight position={[-5,-1,4]} intensity={45} color="#6170ff" distance={12}/>
    <pointLight position={[5,-4,-1]} intensity={34} color="#b5c8ff" distance={12}/>
    <Sculpture progress={progress} reducedMotion={reducedMotion}/>
  </Canvas>;
}
