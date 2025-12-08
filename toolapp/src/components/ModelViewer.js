import React, { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Canvas, useLoader } from '@react-three/fiber/native';
import { STLLoader } from 'three-stdlib';
import { OrbitControls, Stage } from '@react-three/drei/native';
import Colors from '../styles/Colors';


function Model({ url }) {
  const geom = useLoader(STLLoader, url);
  
  return (
    <mesh geometry={geom} scale={0.05} rotation={[0, 0, 0]}>
       {/*  */}
       <meshStandardMaterial color="gray" roughness={0.5} metalness={0.8} />
    </mesh>
  );
}

export default function ModelViewer({ url }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 50 }}>
        {/* Luces  para que se vea el objeto */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Suspense fallback={null}>
            {/*  */}
            <Stage environment={null} intensity={1} contactShadow={false}>
                 {url ? <Model url={url} /> : null}
            </Stage>
        </Suspense>
        
        {/* Permite rotar con el dedo */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </View>
  );
}