import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import { Text, RoundedBox, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ProfileCard3DProps {
  name: string;
  title: string;
  email: string;
  department: string;
  imageUrl?: string;
}

function HangingIDCard({ name, title, email, department }: { name: string; title: string; email: string; department: string }) {
  const cardRef = useRef<THREE.Group>(null);
  const lanyard1Ref = useRef<THREE.Mesh>(null);
  const lanyard2Ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [swinging, setSwinging] = useState(true);
  const [mouseInfluence, setMouseInfluence] = useState({ x: 0, y: 0 });
  
  // Physics simulation variables
  const velocity = useRef({ x: 0, z: 0 });
  const damping = 0.98;
  const gravity = 0.001;
  const springForce = 0.05;

  useFrame((state, delta) => {
    if (cardRef.current && swinging) {
      const time = state.clock.elapsedTime;
      
      // Natural pendulum motion with physics
      const restAngleX = mouseInfluence.x * 0.3;
      const restAngleZ = mouseInfluence.y * 0.2;
      
      // Apply spring forces towards rest position
      const currentRotationX = cardRef.current.rotation.x;
      const currentRotationZ = cardRef.current.rotation.z;
      
      velocity.current.x += (restAngleX - currentRotationX) * springForce;
      velocity.current.z += (restAngleZ - currentRotationZ) * springForce;
      
      // Add some natural wind effect
      velocity.current.x += Math.sin(time * 0.7) * 0.0005;
      velocity.current.z += Math.cos(time * 0.9) * 0.0008;
      
      // Apply gravity effect (cards tend to face forward)
      velocity.current.x += -currentRotationX * gravity;
      
      // Apply damping
      velocity.current.x *= damping;
      velocity.current.z *= damping;
      
      // Update rotations
      cardRef.current.rotation.x += velocity.current.x * delta * 60;
      cardRef.current.rotation.z += velocity.current.z * delta * 60;
      
      // Limit rotation to realistic ranges
      cardRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, cardRef.current.rotation.x));
      cardRef.current.rotation.z = Math.max(-0.5, Math.min(0.5, cardRef.current.rotation.z));
      
      // Subtle vertical bobbing from air currents
      cardRef.current.position.y = -2 + Math.sin(time * 0.6) * 0.05 + Math.cos(time * 1.3) * 0.02;
      
      // Update lanyard positions to follow card
      if (lanyard1Ref.current && lanyard2Ref.current) {
        const cardRotZ = cardRef.current.rotation.z;
        const cardRotX = cardRef.current.rotation.x;
        
        // Left lanyard
        lanyard1Ref.current.rotation.z = cardRotZ * 0.3;
        lanyard1Ref.current.rotation.x = cardRotX * 0.2;
        lanyard1Ref.current.position.x = -0.4 + Math.sin(cardRotZ) * 0.3;
        
        // Right lanyard
        lanyard2Ref.current.rotation.z = cardRotZ * 0.3;
        lanyard2Ref.current.rotation.x = cardRotX * 0.2;
        lanyard2Ref.current.position.x = 0.4 + Math.sin(cardRotZ) * 0.3;
      }
    }
  });

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (hovered && event.point) {
      const x = (event.point.x / 3) * 2;
      const y = (event.point.y / 3) * 2;
      setMouseInfluence({ x: y, y: x });
    }
  };

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Ceiling mount */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Metal ring for lanyard */}
      <mesh ref={ringRef} position={[0, 4, 0]} castShadow>
        <torusGeometry args={[0.2, 0.03, 8, 16]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Left lanyard cord */}
      <mesh ref={lanyard1Ref} position={[-0.4, 2, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 4, 8]} />
        <meshStandardMaterial
          color="#ff6b6b"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Right lanyard cord */}
      <mesh ref={lanyard2Ref} position={[0.4, 2, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 4, 8]} />
        <meshStandardMaterial
          color="#ff6b6b"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* ID Card Group */}
      <group 
        ref={cardRef} 
        position={[0, -2, 0]}
        onClick={() => setSwinging(!swinging)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => {
          setHovered(false);
          setMouseInfluence({ x: 0, y: 0 });
        }}
      >
        {/* Card Shadow/Base */}
        <RoundedBox
          args={[3.4, 5.4, 0.02]}
          position={[0, 0, -0.01]}
          castShadow
        >
          <meshStandardMaterial
            color="#000000"
            transparent
            opacity={0.3}
          />
        </RoundedBox>

        {/* Main Card Body */}
        <RoundedBox
          args={[3.2, 5.2, 0.08]}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={hovered ? "#1e3a8a" : "#1e40af"}
            metalness={0.1}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Company Header Strip */}
        <RoundedBox
          args={[3.2, 0.8, 0.081]}
          position={[0, 2.2, 0.001]}
        >
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.2}
            roughness={0.7}
          />
        </RoundedBox>

        {/* Photo Frame */}
        <RoundedBox
          args={[1.6, 2, 0.02]}
          position={[0, 0.8, 0.041]}
          castShadow
        >
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>

        {/* Photo Placeholder */}
        <RoundedBox
          args={[1.4, 1.8, 0.01]}
          position={[0, 0.8, 0.051]}
        >
          <meshStandardMaterial
            color="#64748b"
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>

        {/* Name Badge */}
        <RoundedBox
          args={[2.8, 0.5, 0.02]}
          position={[0, -0.5, 0.041]}
          castShadow
        >
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.05}
            roughness={0.95}
          />
        </RoundedBox>

        {/* Title Badge */}
        <RoundedBox
          args={[2.8, 0.4, 0.02]}
          position={[0, -1.1, 0.041]}
          castShadow
        >
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.05}
            roughness={0.95}
          />
        </RoundedBox>

        {/* Department Badge */}
        <RoundedBox
          args={[2.8, 0.35, 0.02]}
          position={[0, -1.6, 0.041]}
          castShadow
        >
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.05}
            roughness={0.95}
          />
        </RoundedBox>

        {/* Email Badge */}
        <RoundedBox
          args={[2.8, 0.3, 0.02]}
          position={[0, -2.05, 0.041]}
          castShadow
        >
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.05}
            roughness={0.95}
          />
        </RoundedBox>

        {/* Security Chip */}
        <mesh position={[-1.2, -2.3, 0.041]}>
          <boxGeometry args={[0.4, 0.25, 0.02]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.8}
            roughness={0.2}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Holographic Security Strip */}
        <mesh position={[1.2, -2.3, 0.041]}>
          <planeGeometry args={[0.8, 0.2]} />
          <meshStandardMaterial
            color="#a855f7"
            transparent
            opacity={0.7}
            emissive="#a855f7"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Company Logo Glow */}
        <mesh position={[0, 2.2, 0.042]}>
          <circleGeometry args={[0.25, 32]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={hovered ? 0.4 : 0.2}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Company Name */}
        <Text
          position={[0, 2.2, 0.051]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          TECH INNOVATIONS
        </Text>

        {/* Employee Name */}
        <Text
          position={[0, -0.5, 0.051]}
          fontSize={0.16}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {name.toUpperCase()}
        </Text>

        {/* Job Title */}
        <Text
          position={[0, -1.1, 0.051]}
          fontSize={0.12}
          color="#374151"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>

        {/* Department */}
        <Text
          position={[0, -1.6, 0.051]}
          fontSize={0.1}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          {department}
        </Text>

        {/* Email */}
        <Text
          position={[0, -2.05, 0.051]}
          fontSize={0.08}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          {email}
        </Text>

        {/* ID Number */}
        <Text
          position={[0, -2.4, 0.051]}
          fontSize={0.06}
          color="#d1d5db"
          anchorX="center"
          anchorY="middle"
        >
          ID: EMP-2024-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
        </Text>

        {/* Photo Placeholder Avatar */}
        <mesh position={[0, 1, 0.052]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Avatar Icon */}
        <Text
          position={[0, 1, 0.053]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          👤
        </Text>

        {/* Magnetic Strip */}
        <RoundedBox
          args={[3.2, 0.15, 0.005]}
          position={[0, -2.7, 0.045]}
        >
          <meshStandardMaterial
            color="#000000"
            metalness={0.8}
            roughness={0.3}
          />
        </RoundedBox>
      </group>

      {/* Lanyard clips */}
      <mesh position={[-0.4, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0.4, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

export const ProfileCard3D: React.FC<ProfileCard3DProps> = ({ 
  name = "RAHIL AHMED", 
  title = "SOFTWARE ENGINEER", 
  email = "rahil@company.com",
  department = "ENGINEERING DEPT",
  imageUrl 
}) => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        shadows
        className="h-full w-full"
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#3b82f6" />
        <pointLight position={[0, -5, 5]} intensity={0.8} color="#10b981" />
        <spotLight
          position={[0, 8, 5]}
          angle={0.3}
          penumbra={0.5}
          intensity={1}
          castShadow
          color="#ffffff"
        />
        
        <HangingIDCard name={name} title={title} email={email} department={department} />
        
        <ContactShadows
          position={[0, -4, 0]}
          opacity={0.6}
          scale={12}
          blur={3}
          far={4}
        />
        
        <Environment preset="city" />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Enhanced Terminal-style info overlay */}
      <div className="absolute top-6 left-6 text-green-400 font-mono text-sm bg-black bg-opacity-50 p-4 rounded-lg border border-green-400 border-opacity-30">
        <div className="mb-3 text-cyan-400 text-lg font-bold">│ EMPLOYEE PROFILE │</div>
        <div className="space-y-1">
          <div className="text-green-300">├─ Name: <span className="text-white">{name}</span></div>
          <div className="text-green-300">├─ Title: <span className="text-yellow-400">{title}</span></div>
          <div className="text-green-300">├─ Dept: <span className="text-blue-400">{department}</span></div>
          <div className="text-green-300">└─ Email: <span className="text-purple-400">{email}</span></div>
        </div>
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <div className="text-yellow-400">⚡ Interactive Controls:</div>
          <div>• Click card to pause/resume swing</div>
          <div>• Hover to influence movement</div>
          <div>• Drag to rotate camera view</div>
          <div>• Scroll to zoom in/out</div>
        </div>
        <div className="mt-3 text-xs text-green-500 animate-pulse">
          STATUS: ● ACTIVE
        </div>
      </div>

      {/* Security badge indicator */}
      <div className="absolute bottom-6 right-6 text-green-400 font-mono text-xs bg-black bg-opacity-50 p-3 rounded border border-green-400 border-opacity-30">
        <div className="text-red-400 mb-1">🔒 SECURITY LEVEL</div>
        <div className="text-yellow-400">AUTHORIZED PERSONNEL</div>
        <div className="text-green-400 animate-pulse mt-1">ACCESS GRANTED</div>
      </div>
    </div>
  );
};