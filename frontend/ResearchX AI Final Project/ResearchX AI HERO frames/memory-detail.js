/**
 * JARVIS Prime — Memory Reconstruction Engine Pro
 * Built with Three.js, GSAP, and Neural Logic
 */

class MemorySystem {
    constructor() {
        // ── Advanced Memory Database ──
        this.memoryDB = {
            "0": {
                title: "Research Hub Core",
                id: "MEM-R01",
                timestamp: "2026-04-12 10:24",
                query: "What is the current state of Solid-State Battery (SSB) commercialization?",
                response: "SSB technology is transitioning from pilot lines to Giga-factory scale. Major players like QuantumScape and Toyota have validated sulfide-based solid electrolytes, achieving 80% charge in 15 minutes while maintaining 90% capacity over 800 cycles.",
                insights: [
                    "Sulfide electrolytes have surpassed ionic conductivity thresholds.",
                    "Anode-free designs are significantly reducing cell weight.",
                    "Manufacturing cost parity with Liquid-ion expected by 2028."
                ],
                tags: ["Energy", "Batteries", "Solid-State", "Automotive"],
                status: "RECONSTRUCTION_COMPLETE"
            },
            "1": {
                title: "Quantum Analysis Cluster",
                id: "MEM-Q77",
                timestamp: "2026-04-15 14:55",
                query: "Analyze the impact of error correction on topological qubits.",
                response: "Topological qubits, specifically those based on Majorana zero modes, offer inherent protection against local decoherence. Recent experiments with 'Floquet code' architectures show a 10x improvement in logical qubit stability compared to standard surface codes.",
                insights: [
                    "Majorana fermions validated in hybrid semiconductor-superconductor wires.",
                    "Floquet codes provide dynamic protection against T1 errors.",
                    "Braid-based gates are showing 99.9% fidelity in simulations."
                ],
                tags: ["Quantum", "Computing", "Topological", "Physics"],
                status: "VERIFIED_SESSION"
            },
            "2": {
                title: "Market Signal Pulse",
                id: "MEM-M92",
                timestamp: "2026-04-18 09:12",
                query: "Predictive sentiment analysis for AI infrastructure stocks.",
                response: "Institutional inflow into compute-heavy providers remains at record highs. Sentiment index (SI) shows a 0.82 correlation between datacenter expansion announcements and 3-month equity performance, with a specific focus on liquid cooling technologies.",
                insights: [
                    "Sentiment shifted towards 'Infrastructure over Software' in Q1.",
                    "Liquid cooling vendors seeing 40% QoQ growth in orders.",
                    "Compute scarcity remains the primary valuation driver."
                ],
                tags: ["Finance", "AI", "Market", "Hardware"],
                status: "LIVE_DATA_REPLAY"
            },
            "3": {
                title: "Neural Pathways Mesh",
                id: "MEM-N44",
                timestamp: "2026-04-19 11:30",
                query: "Mapping global knowledge distribution across decentralized nodes.",
                response: "The neural mesh has achieved 99.9% consistency across 1.8M distributed nodes. Semantic cross-referencing algorithms are now capable of sub-10ms synchronization, enabling real-time global intelligence synthesis.",
                insights: [
                    "Decentralized nodes show higher fault tolerance.",
                    "Semantic mesh latency reduced by 40% in recent update.",
                    "Global consistency verified across 12 geographic zones."
                ],
                tags: ["Neural", "Global", "Mesh", "Network"],
                status: "MESH_STABLE"
            },
            "4": {
                title: "Insight Engine Synthesis",
                id: "MEM-I12",
                timestamp: "2026-04-20 16:40",
                query: "Synthesizing actionable intelligence from unstructured data clusters.",
                response: "The Insight Engine has processed 14TB of raw data, identifying 12 major emerging patterns in sustainable aviation fuels. The synthesis identifies 'Power-to-Liquid' (PtL) as the most viable path for long-haul decarbonization.",
                insights: [
                    "PtL pathways show 80% reduction in net carbon.",
                    "Scalability challenges identified in feedstock collection.",
                    "Investment in SAF infra projected to double by 2027."
                ],
                tags: ["Insights", "Synthesis", "AI", "Sustainability"],
                status: "INSIGHTS_GENERATED"
            },
            "5": {
                title: "Deep Archive Vault",
                id: "MEM-D09",
                timestamp: "2026-04-21 08:05",
                query: "Retrieving compressed research vectors from long-term storage.",
                response: "Archived research from 2024-2025 has been successfully re-indexed. High-density storage vectors now support lossless semantic retrieval, allowing the AI to maintain 'infinite' context for historical trends.",
                insights: [
                    "Lossless compression achieved for 95% of text data.",
                    "Historical trends show a cyclic return to hardware focus.",
                    "Archive integrity verified via blockchain hashing."
                ],
                tags: ["Archive", "Memory", "Storage", "Vectors"],
                status: "ARCHIVE_RE_INDEXED"
            }
        };

        this.init();
    }

    init() {
        // 1. Get ID from URL
        const params = new URLSearchParams(window.location.search);
        this.currentID = params.get('id') || "0";
        
        // Ensure ID is within bounds 0-5, otherwise fallback to "0"
        if (!this.memoryDB[this.currentID]) {
            this.currentID = "0";
        }
        
        this.data = this.memoryDB[this.currentID];

        // 2. Initialize Sub-systems
        this.initThreeJSCore();
        this.initGridBackground();
        this.populateUI();
        this.setupInteractions();
        this.animateIn();
    }

    // ── 3D Memory Core System (Three.js) ──
    initThreeJSCore() {
        const container = document.getElementById('rs-core-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        // Core Geometry: Floating Icosahedron
        const geometry = new THREE.IcosahedronGeometry(2, 0);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00F3FF,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const core = new THREE.Mesh(geometry, material);
        scene.add(core);

        // Outer Neural Points
        const pointsGeom = new THREE.BufferGeometry();
        const coords = [];
        for (let i = 0; i < 200; i++) {
            coords.push((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        }
        pointsGeom.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
        const pointsMat = new THREE.PointsMaterial({ color: 0x9D00FF, size: 0.05 });
        const points = new THREE.Points(pointsGeom, pointsMat);
        scene.add(points);

        // Lights
        const light = new THREE.PointLight(0x00F3FF, 2, 50);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        camera.position.z = 8;

        const animate = () => {
            requestAnimationFrame(animate);
            core.rotation.y += 0.005;
            core.rotation.x += 0.002;
            points.rotation.y -= 0.001;
            
            // Pulse Effect
            const s = 1 + Math.sin(Date.now() * 0.002) * 0.1;
            core.scale.set(s, s, s);
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
        });

        // Mouse Parallax
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(camera.position, { x: x, y: -y, duration: 2 });
            camera.lookAt(0, 0, 0);
        });
    }

    // ── 3D Neon Grid Floor ──
    initGridBackground() {
        const canvas = document.getElementById('rs-grid-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const lines = [];
        for (let i = 0; i < 40; i++) {
            lines.push({ x: i * (canvas.width / 40), o: Math.random() });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
            ctx.lineWidth = 1;

            // Perspective Grid
            const horizon = canvas.height * 0.4;
            for (let i = 0; i < 20; i++) {
                const y = horizon + (i * i * 2);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            for (let i = -20; i < 60; i++) {
                const x = i * 50;
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, horizon);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };
        draw();
    }

    populateUI() {
        // Main Data
        document.getElementById('rs-memory-title').textContent = this.data.title;
        document.getElementById('rs-session-id').textContent = this.data.id;
        document.getElementById('rs-status-text').textContent = this.data.status;
        document.getElementById('rs-display-query').textContent = this.data.query;
        document.getElementById('rs-display-response').textContent = this.data.response;

        // Insights
        const insightsList = document.getElementById('rs-display-insights');
        insightsList.innerHTML = this.data.insights.map(ins => `<li>${ins}</li>`).join('');

        // Tags
        const tagsGrid = document.getElementById('rs-display-tags');
        tagsGrid.innerHTML = this.data.tags.map(tag => `<span class="rs-tag">${tag}</span>`).join('');

        // Sidebar Stream
        const stream = document.getElementById('rs-memory-stream');
        stream.innerHTML = Object.keys(this.memoryDB).map(key => {
            const item = this.memoryDB[key];
            return `
                <div class="rs-stream-item ${key === this.currentID ? 'active' : ''}" onclick="window.location.href='?id=${key}'">
                    <div class="title">${item.title}</div>
                    <div class="meta">${item.timestamp} | ${item.id}</div>
                </div>
            `;
        }).join('');
    }

    setupInteractions() {
        const btn = document.getElementById('rs-btn-sync');
        if (btn) {
            btn.addEventListener('click', () => {
                btn.textContent = "SYNCING...";
                gsap.to('.rs-interface-shell', { opacity: 0.5, duration: 0.2, repeat: 3, yoyo: true });
                setTimeout(() => {
                    btn.textContent = "SYNC_COMPLETE";
                    this.data.status = "SYNC_OPTIMIZED";
                    document.getElementById('rs-status-text').textContent = "SYNC_OPTIMIZED";
                }, 1500);
            });
        }
    }

    animateIn() {
        gsap.from('.rs-top-hud', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
        gsap.from('.rs-data-stream-aside', { x: -50, opacity: 0, duration: 1, delay: 0.2 });
        gsap.from('.rs-analysis-aside', { x: 50, opacity: 0, duration: 1, delay: 0.2 });
        gsap.from('.rs-core-focus', { scale: 0.8, opacity: 0, duration: 1.5, delay: 0.5 });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.JARVIS_MEMORY = new MemorySystem();
});
