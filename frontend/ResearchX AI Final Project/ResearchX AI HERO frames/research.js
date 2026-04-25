/**
 * ResearchX AI — JARVIS Intelligence Engine
 * Built with Three.js, GSAP, and Precision Engineering
 */

class JarvisInterface {
    constructor() {
        this.papers = [
            { id: "LOG_A7", status: "VERIFIED", title: "Fault-Tolerant Quantum Computing", summary: "Achieved error rates below threshold for scalable quantum architectures." },
            { id: "LOG_B2", status: "PROCESSING", title: "Hybrid Optimization for Drug Discovery", summary: "Leveraging quantum annealing and classical neural networks." },
            { id: "LOG_C9", status: "INCOMING", title: "Post-Quantum Cryptography Standards", summary: "Analyzing NIST standards for enterprise infrastructure migration." },
            { id: "LOG_D4", status: "VERIFIED", title: "Quantum Advantage in Materials", summary: "Simulation of superconductors showing 45% efficiency gain." },
            { id: "LOG_E1", status: "SCANNING", title: "Scalable Quantum Networks", summary: "Breakthrough in photonic entanglement distribution." }
        ];

        this.insights = [
            "Willow chip demonstrates below-threshold error rates.",
            "Topological qubits emerging as scalable architecture.",
            "Quantum advantage confirmed in materials science."
        ];

        this.init();
    }

    async init() {
        console.log("JARVIS: System Initialization...");
        
        this.setupClock();
        this.initThreeNebula();
        this.initJarvisCore();
        this.injectSystemLogs();
        this.injectInsights();
        this.setupInteractions();
        this.animate();

        // Dismiss loader after system check
        setTimeout(() => this.dismissLoader(), 3000);
    }

    setupClock() {
        const clockEl = document.getElementById('rs-clock');
        setInterval(() => {
            const now = new Date();
            clockEl.textContent = now.toTimeString().split(' ')[0];
        }, 1000);
    }

    dismissLoader() {
        const loader = document.getElementById('rs-loader');
        if (loader) {
            gsap.to(loader, { opacity: 0, duration: 1, onComplete: () => loader.style.display = 'none' });
        }
        
        // Trigger radial progress
        const circle = document.getElementById('rs-confidence-circle');
        if (circle) {
            circle.style.strokeDashoffset = "20"; // ~90%
        }

        // Animate counters
        document.querySelectorAll('.counter').forEach(c => {
            const target = parseInt(c.dataset.target);
            gsap.to(c, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                onUpdate: function() {
                    c.innerText = Math.floor(c.innerText).toLocaleString();
                }
            });
        });
    }

    // ── Three.js Background Nebula ───────────────────────────────────
    initThreeNebula() {
        const canvas = document.getElementById('rs-nebula-canvas');
        this.nebulaScene = new THREE.Scene();
        this.nebulaCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.nebulaRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.nebulaRenderer.setSize(window.innerWidth, window.innerHeight);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 120;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.04,
            color: 0x00F3FF,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        this.nebulaParticles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.nebulaScene.add(this.nebulaParticles);
        this.nebulaCamera.position.z = 50;
    }

    // ── Three.js JARVIS Core ─────────────────────────────────────────────
    initJarvisCore() {
        const container = document.getElementById('rs-core-container');
        this.coreScene = new THREE.Scene();
        this.coreCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.coreRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.coreRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.coreRenderer.domElement);

        this.coreGroup = new THREE.Group();
        this.coreScene.add(this.coreGroup);

        // 1. Central Holographic Sphere (Downscaled)
        const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: 0x00F3FF,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        this.coreOrb = new THREE.Mesh(sphereGeo, sphereMat);
        this.coreGroup.add(this.coreOrb);

        // 2. Precision Rings (Downscaled)
        this.jarvisRings = [];
        const ringConfigs = [
            { r: 2.1, color: 0x00F3FF, speed: 0.02, axis: 'z', dash: true },
            { r: 2.6, color: 0x00FF94, speed: -0.01, axis: 'y', dash: false },
            { r: 3.2, color: 0x0088FF, speed: 0.015, axis: 'x', dash: true },
            { r: 3.8, color: 0x00F3FF, speed: -0.025, axis: 'z', dash: false },
            { r: 4.5, color: 0x00FF94, speed: 0.008, axis: 'y', dash: true }
        ];

        ringConfigs.forEach(conf => {
            const geometry = new THREE.TorusGeometry(conf.r, 0.01, 16, 100);
            const material = new THREE.MeshBasicMaterial({ 
                color: conf.color, 
                transparent: true, 
                opacity: 0.35 
            });
            const ring = new THREE.Mesh(geometry, material);
            this.coreGroup.add(ring);
            this.jarvisRings.push({ mesh: ring, ...conf });
        });

        // 3. Vertical Meridians (Downscaled)
        const meridianMat = new THREE.MeshBasicMaterial({ color: 0x00F3FF, transparent: true, opacity: 0.1 });
        for(let i = 0; i < 4; i++) {
            const mRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.005, 16, 100), meridianMat);
            mRing.rotation.y = (Math.PI / 4) * i;
            this.coreGroup.add(mRing);
        }

        // 4. Scanning Arcs (Downscaled)
        const arcGeo = new THREE.TorusGeometry(5.0, 0.02, 16, 100, Math.PI * 0.6);
        const arcMat = new THREE.MeshBasicMaterial({ color: 0x00F3FF, transparent: true, opacity: 0.5 });
        this.scanArc = new THREE.Mesh(arcGeo, arcMat);
        this.coreGroup.add(this.scanArc);

        // 4. Lights
        const pLight = new THREE.PointLight(0x00F3FF, 2, 20);
        pLight.position.set(5, 5, 5);
        this.coreScene.add(pLight);
        this.coreScene.add(new THREE.AmbientLight(0x101010));

        this.coreCamera.position.z = 15;

        // Force an immediate resize to match the initial container dimensions
        this.onResize();
        
        // Double-check resize after a short delay for any late DOM shifts
        setTimeout(() => this.onResize(), 100);
    }

    injectSystemLogs() {
        const container = document.getElementById('rs-papers-feed');
        if (!container) return;

        this.papers.forEach((paper, i) => {
            setTimeout(() => {
                const log = document.createElement('div');
                log.className = 'rs-log-entry';
                log.innerHTML = `
                    <div class="rs-log-header">
                        <span class="rs-log-id">${paper.id}</span>
                        <span class="rs-log-status">[${paper.status}]</span>
                    </div>
                    <div class="rs-log-text">> ${paper.title}</div>
                `;
                container.prepend(log);
                
                // Subtle flicker effect on new entry
                gsap.fromTo(log, { opacity: 0 }, { opacity: 1, duration: 0.1, repeat: 3, yoyo: true });
            }, i * 800);
        });
    }

    injectInsights() {
        const container = document.getElementById('rs-insights-list');
        if (!container) return;

        this.insights.forEach((insight, i) => {
            const item = document.createElement('div');
            item.className = 'rs-insight-item';
            item.textContent = insight;
            container.appendChild(item);
            
            gsap.from(item, {
                opacity: 0,
                x: 20,
                delay: 3 + (i * 0.5),
                duration: 1
            });
        });
    }

    setupInteractions() {
        window.addEventListener('resize', () => this.onResize());
        
        this.mouse = { x: 0, y: 0 };
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) - 0.5;
            this.mouse.y = (e.clientY / window.innerHeight) - 0.5;
            
            // Core parallax tilt
            gsap.to(this.coreGroup.rotation, {
                y: this.mouse.x * 0.4,
                x: this.mouse.y * 0.4,
                duration: 2,
                ease: "power2.out"
            });
        });
    }

    onResize() {
        if (this.nebulaRenderer) {
            this.nebulaCamera.aspect = window.innerWidth / window.innerHeight;
            this.nebulaCamera.updateProjectionMatrix();
            this.nebulaRenderer.setSize(window.innerWidth, window.innerHeight);
        }

        const container = document.getElementById('rs-core-container');
        if (container && this.coreRenderer) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            this.coreCamera.aspect = width / height;
            this.coreCamera.updateProjectionMatrix();
            this.coreRenderer.setSize(width, height);
            
            // Ensure pixel ratio is handled but capped for performance
            this.coreRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Nebula slow spin
        this.nebulaParticles.rotation.y += 0.0005;
        this.nebulaRenderer.render(this.nebulaScene, this.nebulaCamera);

        // Core precision rotation
        this.coreOrb.rotation.y += 0.01;
        this.scanArc.rotation.z -= 0.02;

        this.jarvisRings.forEach(ring => {
            ring.mesh.rotation[ring.axis] += ring.speed;
        });

        // Core pulsing light & scale
        const time = Date.now() * 0.003;
        const lightPulse = 1.8 + Math.sin(time) * 0.4;
        const scalePulse = 1.0 + Math.sin(time * 0.5) * 0.02;
        
        this.coreOrb.scale.set(scalePulse, scalePulse, scalePulse);
        
        // Map reaction to globe pulse
        if (this.mapSystem && Math.sin(time * 0.5) > 0.95) {
            this.mapSystem.triggerPulseReaction();
        }

        this.coreScene.children.forEach(c => {
            if (c instanceof THREE.PointLight) c.intensity = lightPulse;
        });

        this.coreRenderer.render(this.coreScene, this.coreCamera);
    }
}

/**
 * Advanced Global Intelligence Grid
 */
class MapIntelligenceSystem {
    constructor() {
        this.canvas = document.getElementById('rs-map-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.layers = document.querySelectorAll('.rs-map-layer');
        
        this.init();
    }

    init() {
        this.resize();
        this.generateNodes();
        this.generateHeatZones();
        this.generateMicroHUD();
        this.setupParallax();
        this.startScanningSystems();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateNodes() {
        const nodeCount = 80;
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.4 + 0.1,
                targetAlpha: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI,
                type: Math.random() > 0.85 ? 'hub' : 'node'
            });
        }

        // Generate connections for hubs
        this.nodes.filter(n => n.type === 'hub').forEach(hub => {
            const targets = this.nodes
                .filter(n => n !== hub)
                .sort((a, b) => Math.hypot(a.x - hub.x, a.y - hub.y) - Math.hypot(b.x - hub.x, b.y - hub.y))
                .slice(0, 3);

            targets.forEach(target => {
                this.connections.push({ from: hub, to: target, progress: Math.random() });
            });
        });
    }

    generateHeatZones() {
        const hud = document.querySelector('.layer-hud');
        for (let i = 0; i < 4; i++) {
            const zone = document.createElement('div');
            zone.className = 'rs-heat-zone';
            zone.style.left = Math.random() * 80 + 10 + '%';
            zone.style.top = Math.random() * 80 + 10 + '%';
            zone.style.animationDelay = `${i * 2}s`;
            hud.appendChild(zone);
        }
    }

    generateMicroHUD() {
        const hud = document.querySelector('.layer-hud');
        const labels = ['DATA_STREAM', 'SCAN_ACTIVE', 'GRID_LINK', 'NEURAL_FEED'];
        
        for (let i = 0; i < 12; i++) {
            const el = document.createElement('div');
            el.className = 'rs-map-hud-element';
            if (Math.random() > 0.7) el.className += ' rs-flicker-text';
            
            el.style.left = Math.random() * 95 + '%';
            el.style.top = Math.random() * 95 + '%';
            
            const type = Math.random();
            if (type > 0.6) {
                el.textContent = `${labels[Math.floor(Math.random() * labels.length)]}: ${Math.floor(Math.random() * 1000)}`;
            } else if (type > 0.3) {
                el.textContent = `[${(Math.random() * 180 - 90).toFixed(2)} | ${(Math.random() * 360 - 180).toFixed(2)}]`;
            } else {
                el.textContent = `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`;
            }
            
            hud.appendChild(el);
        }
    }

    setupParallax() {
        this.mouseX = 0;
        this.mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            this.layers.forEach((layer, i) => {
                const depth = (i + 1) * 20;
                gsap.to(layer, {
                    x: x * depth,
                    y: y * depth,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
        });
    }

    startScanningSystems() {
        // Periodic Radar Pulses
        setInterval(() => {
            this.createRadarPulse();
        }, 4000);

        // Occasional Target Locks
        setInterval(() => {
            if (Math.random() > 0.6) this.createTargetLock();
        }, 6000);
    }

    createRadarPulse() {
        const hud = document.querySelector('.layer-hud');
        const pulse = document.createElement('div');
        pulse.className = 'radar-pulse-effect';
        pulse.style.left = Math.random() * 100 + '%';
        pulse.style.top = Math.random() * 100 + '%';
        hud.appendChild(pulse);
        setTimeout(() => pulse.remove(), 4000);
    }

    createTargetLock() {
        const hud = document.querySelector('.layer-hud');
        const lock = document.createElement('div');
        lock.className = 'target-lock';
        lock.style.left = Math.random() * 100 + '%';
        lock.style.top = Math.random() * 100 + '%';
        
        // Add coordinates label
        const label = document.createElement('div');
        label.className = 'rs-label';
        label.style.position = 'absolute';
        label.style.top = '70px';
        label.style.left = '0';
        label.style.fontSize = '0.5rem';
        label.textContent = `LOC: ${Math.random().toFixed(4)}, ${Math.random().toFixed(4)}`;
        lock.appendChild(label);

        hud.appendChild(lock);
        setTimeout(() => lock.remove(), 2500);
    }

    triggerPulseReaction() {
        this.nodes.forEach(n => {
            n.alpha = 1.0;
            setTimeout(() => n.alpha = n.targetAlpha, 500);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mouse distance for globe hover effect
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const mouseDist = Math.hypot(this.mouseX - centerX, this.mouseY - centerY);
        const nearGlobe = mouseDist < 300;

        // Draw Connections
        this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
        this.ctx.lineWidth = 0.5;
        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();

            // Animated Data Particles
            let speed = 0.005;
            if (nearGlobe) speed = 0.015; // Faster when hovering near globe

            conn.progress += speed;
            if (conn.progress > 1) conn.progress = 0;
            
            const px = conn.from.x + (conn.to.x - conn.from.x) * conn.progress;
            const py = conn.from.y + (conn.to.y - conn.from.y) * conn.progress;
            
            this.ctx.fillStyle = nearGlobe ? 'rgba(0, 243, 255, 0.8)' : 'rgba(0, 243, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 1, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw Nodes
        this.nodes.forEach(node => {
            node.pulse += 0.02;
            let dynamicAlpha = node.alpha * (0.5 + Math.sin(node.pulse) * 0.5);
            
            // Intensify if near globe
            if (nearGlobe) {
                const distToGlobe = Math.hypot(node.x - centerX, node.y - centerY);
                if (distToGlobe < 400) {
                    dynamicAlpha *= 1.5;
                }
            }

            this.ctx.fillStyle = `rgba(0, 243, 255, ${dynamicAlpha})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.type === 'hub' ? 2 : 1, 0, Math.PI * 2);
            this.ctx.fill();

            if (node.type === 'hub') {
                this.ctx.strokeStyle = `rgba(0, 243, 255, ${dynamicAlpha * 0.3})`;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 6 + Math.sin(node.pulse) * 3, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initializing the Interface
document.addEventListener('DOMContentLoaded', () => {
    const jarvis = new JarvisInterface();
    window.JARVIS = jarvis;
    jarvis.mapSystem = new MapIntelligenceSystem();
});

