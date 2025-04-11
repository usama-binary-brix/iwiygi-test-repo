// ThreeDCube.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'

interface CubeProps {
  height: number;
  width: number;
  length: number;
  weight: number;
}

const CubeBox: React.FC<CubeProps> = ({ height, width, length, weight }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mouseX = 0;
        let mouseY = 0;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        ref.current?.appendChild(renderer.domElement);

        // Update geometry to reflect height, width, and length
        const geometry = new THREE.BoxGeometry(width, height, length);
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Front face (red)
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Back face (green)
            new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top face (blue)
            new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom face (yellow)
            new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Right face (magenta)
            new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Left face (cyan)
        ];

        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);

            cube.rotation.x += (mouseY - cube.rotation.x) * 0.05;
            cube.rotation.y += (mouseX - cube.rotation.y) * 0.05;

            renderer.render(scene, camera);
        };

        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        animate();

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            ref.current?.removeChild(renderer.domElement);
        };
    }, [height, width, length]);

    return (
        <div>
            <div ref={ref}></div>
            <div className="info">
                <p>Height: {height} units</p>
                <p>Width: {width} units</p>
                <p>Length: {length} units</p>
                <p>Weight: {weight} kg</p>
            </div>
        </div>
    );
};

export default CubeBox;
