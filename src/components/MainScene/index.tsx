import * as THREE from 'three';

import React, {useEffect, useRef} from "react";
import {AppState, useAppContext} from "../../appContext";
// @ts-expect-error yes
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import './MainScene.css';
import ControlsSelector from "../ControlsSelector";

const MainScene = React.memo(function() {
  const weight = 600;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { appState } = useAppContext() as { appState: AppState };

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, /*window.innerWidth / window.innerHeight*/ 16/9, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      const controls = new OrbitControls( camera, renderer.domElement);

      //const aspectRatio = window.innerWidth / window.innerHeight;
      const aspectRatio = 16/9;

      const newHeight = weight / aspectRatio;
      //renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(weight, newHeight);

      const table  = createTable();

      if (appState.uploadedUrl) {
        const texture = new THREE.TextureLoader().load(appState.uploadedUrl);
        // @ts-expect-error yes
        table.children[0].material = new THREE.MeshBasicMaterial({map: texture});

        scene.add(table);
      } else {
        scene.add(table);
      }

      camera.position.z = 1.5;

      const animate = () => {
        requestAnimationFrame(animate);

        if(appState.controls) {
            controls.update();
        } else {
          controls.enabled = false;

          table.rotation.x += 0.01;
          table.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        renderer.dispose();
        scene.remove(table);
      }
    }
  }, [appState.uploadedUrl, appState.controls]);

  return (<div className="MainScene">
            <h1>Main Scene</h1>
            <p>You as a table</p>
            <ControlsSelector />
            <canvas id="mainScene" ref={canvasRef}/>
  </div>);
});

export default MainScene;


function createTable() {
  const table = new THREE.Group();

  const tabletopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
  const tabletopMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
  table.add(tabletop);

  const legGeometry = new THREE.BoxGeometry(0.1, 0.9, 0.1);
  const legMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

  const legPositions = [
    [-0.45, -0.5, -0.45],
    [0.45, -0.5, -0.45],
    [-0.45, -0.5, 0.45],
    [0.45, -0.5, 0.45]
  ];

  for (const position of legPositions) {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    // @ts-expect-error yes
    leg.position.set(...position);
    table.add(leg);
  }

  return table;
}