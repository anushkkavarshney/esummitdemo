
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

/**
 * ===============================================
 * PORTAL ANIMATION ENHANCEMENTS
 * ===============================================
 */
const initPortalAnimation = () => {
    const portal = document.querySelector('.portal');
    const portalCore = document.querySelector('.portal-core');
    
    if (!portal || !portalCore) return;

    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        portal.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Add particles to portal core
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(244, 114, 182, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `float ${Math.random() * 3 + 2}s infinite ease-in-out`;
        
        portalCore.appendChild(particle);
        
        setTimeout(() => particle.remove(), 5000);
    };

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    setInterval(createParticle, 500);
};

/**
 * ===============================================
 * SMOOTH SCROLL
 * ===============================================
 */
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

/**
 * ===============================================
 * INTERSECTION OBSERVER FOR ANIMATIONS
 * ===============================================
 */
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe about cards
    document.querySelectorAll('.about-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe stat blocks
    document.querySelectorAll('.stat-block').forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(30px)';
        block.style.transition = `all 0.6s ease-out ${index * 0.15}s`;
        observer.observe(block);
    });

    // Observe vision section
    const visionContent = document.querySelector('.vision-content');
    if (visionContent) {
        visionContent.style.opacity = '0';
        visionContent.style.transform = 'translateX(-30px)';
        visionContent.style.transition = 'all 0.8s ease-out';
        observer.observe(visionContent);
    }
};

/**
 * ===============================================
 * COUNTER ANIMATION FOR STATS
 * ===============================================
 */
const initCounters = () => {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent.trim();
                
                // Extract number from text like "2000+", "₹10L", etc.
                const match = text.match(/(\d+)/);
                if (match) {
                    const value = parseInt(match[1]);
                    const prefix = text.split(match[1])[0];
                    const suffix = text.split(match[1])[1];
                    
                    const tempDiv = document.createElement('span');
                    element.parentNode.insertBefore(tempDiv, element);
                    element.style.display = 'none';
                    
                    let current = 0;
                    const duration = 2000;
                    const increment = value / (duration / 16);
                    
                    const animate = () => {
                        current += increment;
                        if (current < value) {
                            tempDiv.textContent = prefix + Math.floor(current) + suffix;
                            requestAnimationFrame(animate);
                        } else {
                            tempDiv.textContent = text;
                            element.textContent = text;
                            element.style.display = '';
                            tempDiv.remove();
                        }
                    };
                    
                    animate();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all stat numbers
    document.querySelectorAll('.stat-number, .stat-big').forEach(stat => {
        observer.observe(stat);
    });
};

/**
 * ===============================================
 * NAVBAR SCROLL EFFECT
 * ===============================================
 */
const initNavbarScroll = () => {
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.boxShadow = '0 2px 20px rgba(244, 114, 182, 0.1)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)';
            nav.style.backdropFilter = 'blur(4px)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
};

/**
 * ===============================================
 * INITIALIZE ALL
 * ===============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    initSquares();
    initPortalAnimation();
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initNavbarScroll();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
    } else {
        // Resume animations
    }
});

const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");

menuBtn.addEventListener("click", () => {
  drawer.classList.add("open");
});

closeDrawer.addEventListener("click", () => {
  drawer.classList.remove("open");
});