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

    // ── 2. BACKGROUND CANVAS ENGINE ──
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5;
            this.alpha = Math.random() * 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 243, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
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
