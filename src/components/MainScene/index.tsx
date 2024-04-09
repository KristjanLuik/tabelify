import * as THREE from 'three';

import React, { useEffect, useRef } from "react";
import { useAppContext } from "../../appContext";

const MainScene = React.memo(function() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useAppContext() as { state: { uploadedUrl: string } };

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, /*window.innerWidth / window.innerHeight*/ 16/9, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

      //console.log(window.innerWidth, window.innerHeight);
      //console.log(canvasRef.current.getBoundingClientRect())

      //const aspectRatio = window.innerWidth / window.innerHeight;
      const aspectRatio = 16/9;

      const newHeight = 800 / aspectRatio;
      //renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(800, newHeight);

      let cube: THREE.Mesh;
      if (state.uploadedUrl) {
        const texture = new THREE.TextureLoader().load(state.uploadedUrl);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const geometry = new THREE.BoxGeometry();
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
      } else {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: "#09C6B7" });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
      }

      camera.position.z = 1.5;

      const animate = () => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        renderer.dispose();
        scene.remove(cube);
      }
    }
  }, [state.uploadedUrl]);

  return (<div>
            <h1>Main Scene</h1>
            <p>You as a table</p>
            <canvas id="mainScene" ref={canvasRef}/>
  </div>);
});

export default MainScene;