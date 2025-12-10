import React, { Suspense, useState, useEffect, useMemo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { STLLoader } from "three-stdlib";
import { OrbitControls, Center } from "@react-three/drei/native";
import { Asset } from "expo-asset";

function Model({ uri }) {
  // Cargamos el modelo directamente
  const originalGeom = useLoader(STLLoader, uri);

  const geometry = useMemo(() => {
    const geom = originalGeom.clone();
    geom.center();
    geom.computeVertexNormals();
    return geom;
  }, [originalGeom]);

  return (
    <mesh geometry={geometry} scale={1.1}>
      <meshPhongMaterial color="#A0A0A0" specular="#111111" shininess={30} />
    </mesh>
  );
}

export default function ModelViewer({ localResource }) {
  const [modelUri, setModelUri] = useState(null);

  // Efecto para descargar el archivo antes de mostrar nada 3D
  useEffect(() => {
    async function loadAsset() {
      if (!localResource) return;
      try {
        const asset = Asset.fromModule(localResource);
        await asset.downloadAsync();
        setModelUri(asset.localUri || asset.uri);
      } catch (e) {
        console.error("Error al descargar asset:", e);
      }
    }
    loadAsset();
  }, [localResource]);

  if (!modelUri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />

        <Suspense fallback={null}>
          <Center>
            {/* Aquí pasamos la URI limpia al hijo */}
            <Model uri={modelUri} />
          </Center>
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false} 
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </View>
  );
}
