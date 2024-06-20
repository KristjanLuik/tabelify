import * as THREE from 'three';

// @ts-expect-error yes
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import React, {useEffect, useRef} from "react";
import {AppState, Control, useAppContext} from "../../appContext";
import Controls from "../Controls";
import CanvasSnapshot from "../CanvasSnapshot";
import createTable from "../../utils/createTable";
import './MainScene.css';


const MainScene = React.memo(function () {
    const weight = 600;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {appState} = useAppContext() as { appState: AppState };
    const objectCache = useRef<THREE.Object3D | null>(null);
    const cameraCache = useRef<THREE.Camera | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, /*window.innerWidth / window.innerHeight*/ 16 / 9, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                preserveDrawingBuffer: true,
                alpha: true,
                antialias: true
            });
            const controls = new OrbitControls(camera, renderer.domElement);

            //const aspectRatio = window.innerWidth / window.innerHeight;
            const aspectRatio = 16 / 9;

            const newHeight = weight / aspectRatio;
            //renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setSize(weight, newHeight);

            const table = createTable();

            // Cache setup
            if (objectCache.current) {
                objectCache.current?.getWorldPosition(table.position);
                //table.position.copy(objectCache.current.position);
                table.rotation.copy(objectCache.current.rotation);
            }
            if (cameraCache.current) {
                camera.position.copy(cameraCache.current.position);
                camera.rotation.copy(cameraCache.current.rotation);
            }

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

                if (appState.controls.control === Control.Orbit) {
                    controls.update();
                } else {
                    controls.enabled = false;

                    table.rotation.x += 0.01;
                    table.rotation.y += 0.01;
                }

                if (appState.background.useBackground && appState.background.color != '') {
                    scene.background = new THREE.Color(appState.background.color);
                }

                renderer.render(scene, camera);
            };

            animate();

            return () => {
                objectCache.current = table;
                cameraCache.current = camera;
                renderer.dispose();
                scene.remove(table);
            }
        }
    }, [appState.uploadedUrl, appState.controls, appState.background]);

    return (<div className="MainScene">
        <h1>Main Scene</h1>
        <p>You as a table</p>

        <div className="MainWindow">
            <span className="MenuLabel">Menu</span>
            <Controls/>
            <canvas id="mainScene" ref={canvasRef}/>
        </div>
        <CanvasSnapshot/>
    </div>);
});

export default MainScene;