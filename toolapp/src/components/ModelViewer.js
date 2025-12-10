import React, { Suspense, useState, useEffect } from "react";
import { View } from "react-native";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { STLLoader } from "three-stdlib";
import { OrbitControls, Center } from "@react-three/drei/native";
import { Asset } from "expo-asset";

function Model({ localResource }) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    async function loadAsset() {
      if (localResource) {
        try {
          const asset = Asset.fromModule(localResource);
          await asset.downloadAsync();
          setUri(asset.localUri || asset.uri);
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadAsset();
  }, [localResource]);

  if (!uri) return null;

  const geom = useLoader(STLLoader, uri);
  geom.center();
  geom.computeVertexNormals();

  return (
    <mesh geometry={geom} scale={1.1}>
      <meshStandardMaterial color="#A0A0A0" roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

export default function ModelViewer({ localResource }) {
  if (!localResource) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Canvas shadows frameloop="always" dpr={[1, 2]} camera={{ position: [0, 0, 80], fov: 50, near: 1, far: 1000 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />

        <Suspense fallback={null}>
          <Center>
            <Model localResource={localResource} />
          </Center>
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          enableDamping={false}
          minDistance={20}
          maxDistance={150}
        />
      </Canvas>
    </View>
  );
}
