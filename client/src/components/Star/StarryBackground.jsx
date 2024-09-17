import { useEffect, useRef, useState } from "react";
import { useTheme } from "../Themecontext";

const StarryBackground = () => {
    const { mode } = useTheme();
    const canvasRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const stars = [];
        const numStars = 150; // Adjust for more or fewer stars
        const speed = 0.05;

        const initializeStars = () => {
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    speed: speed + Math.random() * 0.4,
                });
            }
        };

        const updateStars = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (const star of stars) {
                star.x -= star.speed;
                if (star.x < 0) {
                    star.x = canvas.width;
                    star.y = Math.random() * canvas.height;
                }
            }
        };

        const drawStars = () => {
            context.fillStyle = mode === 'dark' ? 'white' : 'black'; // Change star color based on theme
            for (const star of stars) {
                context.beginPath();
                context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                context.fill();
            }
        };

        const animate = () => {
            updateStars();
            drawStars();
            requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        initializeStars();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [mode]); // Re-render when mode changes

    const handleMouseMove = (e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} />

        </>
    );
};

export default StarryBackground;
