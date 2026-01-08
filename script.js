
import { Renderer, Program, Mesh, Triangle } from 'https://esm.sh/ogl';

/**
 * 1. SQUARES BACKGROUND LOGIC
 * Strictly converted from the provided React code into Vanilla JS.
 */
const initSquares = () => {
    const canvas = document.getElementById('squares-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const config = {
        direction: 'diagonal',
        speed: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        squareSize: 40,
        hoverFillColor: 'rgba(244, 114, 182, 0.15)'
    };

    let gridOffset = { x: 0, y: 0 };
    let hoveredSquare = null;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const startX = Math.floor(gridOffset.x / config.squareSize) * config.squareSize;
        const startY = Math.floor(gridOffset.y / config.squareSize) * config.squareSize;

        for (let x = startX; x < canvas.width + config.squareSize; x += config.squareSize) {
            for (let y = startY; y < canvas.height + config.squareSize; y += config.squareSize) {
                const squareX = x - (gridOffset.x % config.squareSize);
                const squareY = y - (gridOffset.y % config.squareSize);

                const currentGridX = Math.floor((x - startX) / config.squareSize);
                const currentGridY = Math.floor((y - startY) / config.squareSize);

                if (hoveredSquare && hoveredSquare.x === currentGridX && hoveredSquare.y === currentGridY) {
                    ctx.fillStyle = config.hoverFillColor;
                    ctx.fillRect(squareX, squareY, config.squareSize, config.squareSize);
                }

                ctx.strokeStyle = config.borderColor;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(squareX, squareY, config.squareSize, config.squareSize);
            }
        }

    };

    const updateAnimation = () => {
        const effectiveSpeed = Math.max(config.speed, 0.1);
        switch (config.direction) {
            case 'right':
                gridOffset.x = (gridOffset.x - effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'left':
                gridOffset.x = (gridOffset.x + effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'up':
                gridOffset.y = (gridOffset.y + effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'down':
                gridOffset.y = (gridOffset.y - effectiveSpeed + config.squareSize) % config.squareSize;
                break;
            case 'diagonal':
                gridOffset.x = (gridOffset.x - effectiveSpeed + config.squareSize) % config.squareSize;
                gridOffset.y = (gridOffset.y - effectiveSpeed + config.squareSize) % config.squareSize;
                break;
        }

        drawGrid();
        requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = event => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const startX = Math.floor(gridOffset.x / config.squareSize) * config.squareSize;
        const startY = Math.floor(gridOffset.y / config.squareSize) * config.squareSize;

        const hX = Math.floor((mouseX + gridOffset.x - startX) / config.squareSize);
        const hY = Math.floor((mouseY + gridOffset.y - startY) / config.squareSize);

        if (!hoveredSquare || hoveredSquare.x !== hX || hoveredSquare.y !== hY) {
            hoveredSquare = { x: hX, y: hY };
        }
    };

    const handleMouseLeave = () => {
        hoveredSquare = null;
    };

    // Attach to window so we can track hover across sections
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    requestAnimationFrame(updateAnimation);
};

/**
 * 2. LUMINA CHROME SHADER
 */
// const initChrome = () => {
//     const container = document.getElementById('chrome-vortex');
//     if (!container) return;

//     const renderer = new Renderer({ antialias: true, alpha: true });
//     const gl = renderer.gl;
//     container.appendChild(gl.canvas);

//     const vertexShader = `
//         attribute vec2 position;
//         attribute vec2 uv;
//         varying vec2 vUv;
//         void main() {
//             vUv = uv;
//             gl_Position = vec4(position, 0.0, 1.0);
//         }
//     `;

//     const fragmentShader = `
//         precision highp float;
//         uniform float uTime;
//         uniform vec3 uResolution;
//         uniform vec2 uMouse;
//         varying vec2 vUv;

//         void main() {
//             vec2 uv = (vUv - 0.5) * 2.0;
//             uv.x *= uResolution.x / uResolution.y;

//             float dist = length(uv);
//             float angle = atan(uv.y, uv.x);
            
//             float swirl = angle + (2.8 / (dist + 0.08)) + uTime * 0.4;
            
//             float ring = sin(dist * 24.0 - swirl * 1.5);
//             float core = smoothstep(0.15, 0.5, dist);
//             float mask = smoothstep(0.52, 0.51, dist);
            
//             vec3 pink = vec3(0.957, 0.447, 0.714);
//             vec3 color = pink * 0.2; 
            
//             float streaks = abs(sin(swirl * 3.0 + uTime)) * 0.4;
//             color += pink * ring * streaks * core;
            
//             float glow = exp(-pow(dist - 0.5, 2.0) * 100.0);
//             color += (pink + 0.1) * glow * 1.8;
            
//             vec2 m = (uMouse - 0.5) * 2.0;
//             float mDist = length(uv - m);
//             color += pink * exp(-mDist * 8.0) * 0.5;

//             color *= (1.0 - mask);
//             float alpha = clamp(length(color) * 0.9, 0.0, 1.0);
//             gl_FragColor = vec4(color, alpha);
//         }
//     `;

//     const geometry = new Triangle(gl);
//     const program = new Program(gl, {
//         vertex: vertexShader,
//         fragment: fragmentShader,
//         uniforms: {
//             uTime: { value: 0 },
//             uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, 1]) },
//             uMouse: { value: new Float32Array([0.5, 0.5]) }
//         }
//     });

//     const mesh = new Mesh(gl, { geometry, program });

//     function resize() {
//         const width = container.offsetWidth;
//         const height = container.offsetHeight;
//         renderer.setSize(width, height);
//         program.uniforms.uResolution.value[0] = gl.canvas.width;
//         program.uniforms.uResolution.value[1] = gl.canvas.height;
//     }

//     window.addEventListener('resize', resize);
//     resize();

//     window.addEventListener('mousemove', (e) => {
//         program.uniforms.uMouse.value[0] = e.clientX / window.innerWidth;
//         program.uniforms.uMouse.value[1] = 1.0 - e.clientY / window.innerHeight;
//     });

//     function update(t) {
//         requestAnimationFrame(update);
//         program.uniforms.uTime.value = t * 0.001;
//         renderer.render({ scene: mesh });
//     }
//     requestAnimationFrame(update);
// };

// Start Systems
initSquares();
// initChrome();

  // -----------------------------
  // Animate Sponsors Grid
  // -----------------------------
  gsap.utils.toArray('.sponsor-logos-container img').forEach((logo, i) => {
    gsap.to(logo, {
      scrollTrigger: { trigger: logo, start: "top 85%" },
      opacity: 1,
      y: 0,
      duration: 1,
      delay: i * 0.2,
      ease: "power3.out"
    });
  });
  // Horizontal scrolling for mobile rows
// Mobile horizontal scroll animation
if (window.innerWidth <= 480) {
  document.querySelectorAll(".mobile-only .sponsor-row").forEach((row, index) => {
    // Duplicate content for seamless scroll
    row.innerHTML += row.innerHTML;

    const totalWidth = row.scrollWidth / 2; // width of original logos
    const direction = index % 2 === 0 ? 1 : -1; // alternate directions

    gsap.to(row, {
      x: direction * -totalWidth,
      duration: 20,  // adjust speed here
      repeat: -1,
      ease: "linear"
    });
  });
}



