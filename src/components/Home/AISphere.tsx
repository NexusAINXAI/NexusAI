import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';
import { Terminal } from '../Terminal/Terminal';

interface AISphereProps {
  onTerminalOpen: () => void;
  onTerminalClose: () => void;
  scrollProgress: number;
  colors: {
    sphere: string;
    ring1: string;
    ring2: string;
    ring3: string;
    particles: string;
  };
}

export function AISphere({ onTerminalOpen, onTerminalClose, scrollProgress, colors }: AISphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { camera } = useThree();
  const initialCameraPosition = useRef(camera.position.clone());
  const animationRef = useRef<number>();
  const [isResponding, setIsResponding] = useState(false);

  useFrame((state) => {
    if (sphereRef.current) {
      const baseScale = 0.08;
      const responseScale = isResponding ? 0.15 : 0;
      const pulseScale = baseScale + responseScale;
      
      const speedMultiplier = isResponding ? 3 : 1;
      sphereRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2 * speedMultiplier) * pulseScale;
      sphereRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.5 * speedMultiplier) * pulseScale;
      sphereRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 1.8 * speedMultiplier) * pulseScale;
      sphereRef.current.rotation.y += 0.004 * (isResponding ? 2 : 1);

      // Move sphere based on scroll
      if (!isTerminalOpen) {
        const targetX = scrollProgress * 2;
        sphereRef.current.position.x = THREE.MathUtils.lerp(sphereRef.current.position.x, targetX, 0.1);
      }
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += 0.006;
      ring1Ref.current.position.x = sphereRef.current?.position.x || 0;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += 0.008;
      ring2Ref.current.position.x = sphereRef.current?.position.x || 0;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += 0.01;
      ring3Ref.current.position.x = sphereRef.current?.position.x || 0;
    }
  });

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animateCamera = (
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    startTarget: THREE.Vector3,
    endTarget: THREE.Vector3,
    duration: number = 2000,
    onComplete?: () => void
  ) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();
    const controls = camera.userData.controls;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      camera.position.lerpVectors(startPos, endPos, eased);
      
      if (controls) {
        const target = new THREE.Vector3();
        target.lerpVectors(startTarget, endTarget, eased);
        controls.target.copy(target);
        controls.update();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleSphereClick = () => {
    // Prevent interaction when scrolled down
    if (scrollProgress > 0.1) return;
    
    setIsTerminalOpen(true);
    onTerminalOpen();
    
    const targetPosition = new THREE.Vector3(0, 0.5, 2);
    const targetLookAt = new THREE.Vector3(0, 0.5, 0);
    animateCamera(
      camera.position.clone(),
      targetPosition,
      new THREE.Vector3(0, 0, 0),
      targetLookAt
    );
  };

  const handleCloseTerminal = () => {
    setIsTerminalOpen(false);
    onTerminalClose();
    setIsResponding(false);
    
    animateCamera(
      camera.position.clone(),
      initialCameraPosition.current,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, 0, 0)
    );
  };

  const handleTerminalSubmit = (duration: number) => {
    setIsResponding(true);
    setTimeout(() => setIsResponding(false), duration);
  };

  return (
    <group>
      <motion.mesh
        ref={sphereRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        onClick={handleSphereClick}
        position={[0, 0.5, 0]}
        style={{ cursor: scrollProgress > 0.1 ? 'default' : 'pointer' }}
      >
        <Sphere args={[0.8, 64, 64]}>
          <MeshDistortMaterial
            color={colors.sphere}
            emissive={colors.sphere}
            emissiveIntensity={2}
            roughness={0.1}
            metalness={1}
            distort={isResponding ? 1.2 : 0.8}
            speed={isResponding ? 8 : 4}
          />
        </Sphere>
      </motion.mesh>

      <group position={[0, 0.5, 0]}>
        <mesh ref={ring1Ref} rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.0, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color={colors.ring1}
            emissive={colors.ring1}
            emissiveIntensity={2}
            transparent
            opacity={0.3}
            roughness={0}
            metalness={1}
            clearcoat={1}
          />
        </mesh>

        <mesh ref={ring2Ref} rotation-x={Math.PI / 3}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color={colors.ring2}
            emissive={colors.ring2}
            emissiveIntensity={2}
            transparent
            opacity={0.3}
            roughness={0}
            metalness={1}
            clearcoat={1}
          />
        </mesh>

        <mesh ref={ring3Ref} rotation-x={Math.PI / 4}>
          <torusGeometry args={[3.0, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color={colors.ring3}
            emissive={colors.ring3}
            emissiveIntensity={2}
            transparent
            opacity={0.3}
            roughness={0}
            metalness={1}
            clearcoat={1}
          />
        </mesh>
      </group>

      {isTerminalOpen && (
        <Terminal 
          onClose={handleCloseTerminal}
          onSubmit={handleTerminalSubmit}
        />
      )}
    </group>
  );
}