/**
 * RESEARCHX DEMO - ADVANCED SYSTEM LOGIC
 * Handles cinematic sequences, background engine, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ── 1. CINEMATIC INTRO SEQUENCE ──
    const intro = document.getElementById('demo-intro');
    const introBar = document.getElementById('introBarFill');
    const introPct = document.getElementById('introPct');
    const introLog = document.getElementById('introLog');
    const demoNav = document.getElementById('demoNav');

    const logMessages = [
        "INITIALIZING NEURAL CORE...",
        "CONNECTING TO GLOBAL DATA MESH...",
        "SYNCHRONIZING TEMPORAL INDEXES...",
        "CALIBRATING HOLOGRAPHIC RENDERER...",
        "SECURE LINK ESTABLISHED...",
        "DEMO SEQUENCE READY."
    ];

    let progress = 0;
    const loadSystem = setInterval(() => {
        progress += Math.random() * 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadSystem);
            setTimeout(completeIntro, 800);
        }
        
        introBar.style.width = `${progress}%`;
        introPct.innerText = `${Math.floor(progress)}%`;
        
        // Update log message based on progress
        const msgIndex = Math.min(
            Math.floor((progress / 100) * logMessages.length),
            logMessages.length - 1
        );
        introLog.innerText = logMessages[msgIndex];
    }, 50);

    function completeIntro() {
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.style.visibility = 'hidden';
            demoNav.classList.add('visible');
            initScrollReveal();
            startLiveUpdates();
        }, 1000);
    }

    // ── 2. BACKGROUND CANVAS ENGINE (GARGANTUA BLACK HOLE) ──
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let diskParticles = [];
    let centerX, centerY;
    let mouseX = 0, mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        initStars();
        initDisk();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - centerX) * 0.05;
        mouseY = (e.clientY - centerY) * 0.05;
    });

    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.2;
            this.alpha = Math.random();
        }
        update() { this.alpha = 0.3 + Math.random() * 0.7; }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(this.x + mouseX * 0.1, this.y + mouseY * 0.1, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class DiskParticle {
        constructor() { this.reset(); }
        reset() {
            this.angle = Math.random() * Math.PI * 2;
            this.distance = 120 + Math.random() * 350;
            this.speed = (1.5 / Math.sqrt(this.distance)) * 1.5;
            this.size = Math.random() * 2 + 0.5;
            this.color = this.getColor();
            this.opacity = Math.random() * 0.6 + 0.2;
        }
        getColor() {
            const r = Math.random();
            if (r > 0.9) return '#fff'; // Hot spots
            if (r > 0.6) return '#FFD700'; // Gold
            if (r > 0.3) return '#FF8C00'; // Dark Orange
            return '#FF4500'; // Orange Red
        }
        update() {
            this.angle -= this.speed; // Rotation
        }
        draw(lensingType) {
            let x, y;
            const cos = Math.cos(this.angle);
            const sin = Math.sin(this.angle);
            
            // Doppler beaming: Brighter on the side moving toward the observer (left side)
            const beaming = (cos + 1) / 2; 

            if (lensingType === 'front') {
                if (sin < 0) return; // Only front half
                x = centerX + cos * this.distance + mouseX;
                y = centerY + sin * this.distance * 0.15 + mouseY;
            } else if (lensingType === 'top') {
                if (sin >= 0) return; // Only back half
                // Lensed over the top
                const lensedDist = this.distance * (0.8 + Math.abs(sin) * 0.2);
                x = centerX + cos * lensedDist + mouseX;
                y = centerY - Math.abs(sin) * this.distance * 0.6 + mouseY;
            } else if (lensingType === 'bottom') {
                if (sin >= 0) return; // Only back half
                // Lensed under the bottom
                const lensedDist = this.distance * (0.8 + Math.abs(sin) * 0.2);
                x = centerX + cos * lensedDist + mouseX;
                y = centerY + Math.abs(sin) * this.distance * 0.6 + mouseY;
            }

            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity * (0.4 + beaming * 0.6);
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < 300; i++) stars.push(new Star());
    }

    function initDisk() {
        diskParticles = [];
        for (let i = 0; i < 1500; i++) diskParticles.push(new DiskParticle());
    }

    function drawEventHorizon() {
        const x = centerX + mouseX;
        const y = centerY + mouseY;

        // Subtle Photon Sphere Glow
        const grad = ctx.createRadialGradient(x, y, 60, x, y, 140);
        grad.addColorStop(0, 'rgba(255, 140, 0, 0.2)');
        grad.addColorStop(0.6, 'rgba(255, 69, 0, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 140, 0, Math.PI * 2);
        ctx.fill();

        // The Void (smaller to match image core)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, 55, 0, Math.PI * 2);
        ctx.fill();
    }

    resize();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Stars (Keeping for depth)
        stars.forEach(s => { s.update(); s.draw(); });

        // Removed procedural disk and event horizon to focus on the Gargantua image
        
        requestAnimationFrame(animate);
    }
    animate();

    // ── 3. SCROLL REVEAL LOGIC ──
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal-up');
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Special handling for pipeline energy flow
                    if (entry.target.classList.contains('demo-pipeline-section')) {
                        startPipelineAnimation();
                    }
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    }

    // ── 4. LIVE SYSTEM UPDATES ──
    function startLiveUpdates() {
        const liveTimeEl = document.getElementById('liveTime');
        const vhTimestamp = document.getElementById('vhTimestamp');
        const statLatency = document.getElementById('stat-latency');
        const statSessions = document.getElementById('stat-sessions');

        function updateTime() {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            liveTimeEl.innerText = `LIVE SYSTEM — ${timeStr} GMT`;
            vhTimestamp.innerText = timeStr;
        }

        setInterval(updateTime, 1000);
        updateTime();

        // Random jitter for stats
        setInterval(() => {
            const jitter = Math.floor(Math.random() * 5) - 2;
            statLatency.innerText = `${14 + jitter}ms`;
            
            if (Math.random() > 0.8) {
                const sessionDelta = Math.floor(Math.random() * 3) - 1;
                const current = parseInt(statSessions.innerText.replace(',', ''));
                statSessions.innerText = (current + sessionDelta).toLocaleString();
            }
        }, 3000);
    }

    // ── 5. VIDEO HUB INTERACTIONS ──
    const videoState = document.getElementById('videoPlayState');
    const videoEl = document.getElementById('demoVideo');
    const vhStatus = document.getElementById('vhStatus');

    videoState.addEventListener('click', () => {
        videoState.style.display = 'none';
        vhStatus.innerText = "STREAMING...";
        vhStatus.style.color = "var(--jarvis-green)";
        
        // In a real app, you'd set video source and play
        // videoEl.src = "your-video.mp4";
        // videoEl.play();
        
        console.log("Demo video playback initiated.");
    });

    // ── 6. PIPELINE ANIMATION ──
    const pipelinePulse = document.getElementById('pipelinePulse');
    
    function startPipelineAnimation() {
        // Move pulse dot along the pipeline
        // This is a simple version; real SVG path follow would be more complex
        const steps = document.querySelectorAll('.pipeline-step');
        let currentStep = 0;

        function cyclePipeline() {
            steps.forEach(s => s.style.opacity = '0.4');
            steps[currentStep].style.opacity = '1';
            
            currentStep = (currentStep + 1) % steps.length;
            setTimeout(cyclePipeline, 2000);
        }
        
        cyclePipeline();
    }
});
