import { OrbitControls, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Model = () => {
    const img = useTexture("./img.png");
    const cyl = useRef(null);

    // Refs to store mouse positions and last update time
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    const lastMouseMove = useRef(Date.now());

    // State for handling rotation
    const [rotation, setRotation] = useState({ x: 0, z: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            // Update mouse positions
            mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1;

            // Record the time of the last mouse move
            lastMouseMove.current = Date.now();
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useFrame(() => {
        const currentTime = Date.now();
        const isMouseMoving = currentTime - lastMouseMove.current <= 100;

        if (cyl.current) {
            if (isMouseMoving) {
                // Smoothly interpolate rotation based on mouse movement
                const targetRotationX = mouseY.current * 0.2;
                const targetRotationZ = mouseX.current * 0.2;

                // Smooth transition using interpolation
                cyl.current.rotation.x = THREE.MathUtils.lerp(
                    cyl.current.rotation.x,
                    targetRotationX,
                    0.1 // Adjust this value for more or less smoothness
                );
                cyl.current.rotation.z = THREE.MathUtils.lerp(
                    cyl.current.rotation.z,
                    targetRotationZ,
                    0.1 // Adjust this value for more or less smoothness
                );
            } else {
                // Smoothly return to default rotation
                cyl.current.rotation.x = THREE.MathUtils.lerp(
                    cyl.current.rotation.x,
                    0,
                    0.1 // Adjust this value for more or less smoothness
                );
                cyl.current.rotation.z = THREE.MathUtils.lerp(
                    cyl.current.rotation.z,
                    0,
                    0.1 // Adjust this value for more or less smoothness
                );
            }

            // Continue rotating on Y-axis
            cyl.current.rotation.y += 0.01;
        }
    });

    return (
        <group rotation={[0, 1.4, 0.5]}>
        <OrbitControls/>
            <mesh ref={cyl}>
                <cylinderGeometry args={[2, 2, 2, 30, 30, true]} />
                <meshStandardMaterial
                    transparent
                    map={img}
                    opacity={0.9}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

export default Model;
