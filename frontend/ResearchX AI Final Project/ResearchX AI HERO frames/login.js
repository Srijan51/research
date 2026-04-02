document.addEventListener('DOMContentLoaded', () => {
    // --- Global Engine State ---
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const lerpFactor = 0.08;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const loginForm = document.querySelector('.login-form');
    const loginBtn = document.querySelector('.login-btn');
    const inputs = document.querySelectorAll('.form-input');
    const card = document.querySelector('.quantum-card');
    const statusText = document.getElementById('tactical-status');
    const nodeText = document.getElementById('node-identifier');

    // --- Neural Network Background ---
    const canvas = document.getElementById('neural-canvas');
    let ctx = null;
    let nodes = [];
    const nodeCount = 100;
    
    if(canvas) {
        ctx = canvas.getContext('2d');
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class NeuralNode {
            constructor() { 
                this.init(); 
            }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.radius = Math.random() * 2 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Cursor interaction
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += dx * force * 0.03;
                    this.y += dy * force * 0.03;
                }
                
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.init();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
                ctx.fill();
            }
        }

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new NeuralNode());
        }
    }

    // --- High-Performance Interaction Engine ---
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Calculate normalized values (-1 to 1) for the 3D card tilt physics
        targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    const updateInteraction = () => {
        // Apply LERP for buttery smooth momentum
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        if (card) {
            // Dual Transform: Physical Movement (Translate) + 3D Rotation (Rotate)
            // Move card by up to 30px and tilt by 25deg
            const moveX = currentX * 30;
            const moveY = currentY * 30;
            const rotateY = currentX * 25;
            const rotateX = -currentY * 25;

            card.style.transform = `translate(${moveX}px, ${moveY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(50px)`;
            
            // Dynamic Shadow Shift - Moves opposite to light
            card.style.boxShadow = `${-moveX}px ${-moveY}px 60px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 243, 255, 0.1)`;
        }

        // Background HUD Parallax
        const huds = document.querySelectorAll('.hud-decoration');
        huds.forEach((hud, index) => {
            const factor = (index + 1) * 20;
            hud.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        // Grid Parallax
        const grid = document.querySelector('.cyber-grid');
        if (grid) {
            grid.style.transform = `perspective(600px) rotateX(60deg) translateY(${currentY * 30}px) translateX(${currentX * 30}px)`;
        }

        // Orb Parallax
        const orbs = document.querySelectorAll('.glow-orb');
        orbs.forEach((orb, index) => {
            const factor = (index + 1) * -30;
            orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        // Neural Canvas updates
        if(ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw lines first so nodes render on top
            ctx.lineWidth = 1;
            for(let i = 0; i < nodes.length; i++) {
                for(let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if(dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist/120})`;
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach(node => {
                node.update();
                node.draw();
            });
        }

        requestAnimationFrame(updateInteraction);
    };
    requestAnimationFrame(updateInteraction);

    // Reset targets on mouse leave
    document.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    // --- Tactical Status Simulation ---
    const statuses = ["Initializing Neural Link...", "Bypassing Firewalls...", "Syncing Biometrics...", "Node Connected: SECURE", "Awaiting Authorization..."];
    let statusIndex = 0;
    const rotateStatus = () => {
        if (statusIndex < statuses.length) {
            statusText.textContent = statuses[statusIndex];
            statusIndex++;
            setTimeout(rotateStatus, 1500 + Math.random() * 1000);
        }
    };
    rotateStatus();

    setInterval(() => {
        const nodes = ["QUANTUM-AX7", "NEURAL-CORE-1", "VORTEX-MAIN", "SYNA-LINK-0"];
        if (nodeText) nodeText.textContent = `Node: ${nodes[Math.floor(Math.random() * nodes.length)]}`;
    }, 5000);

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const group = input.closest('.cyber-group');
            if (group) group.classList.add('active');
            statusText.textContent = "Input Detected: AUTHORIZING...";
        });
        input.addEventListener('blur', () => {
            const group = input.closest('.cyber-group');
            if (group) group.classList.remove('active');
            statusText.textContent = "Awaiting Authorization...";
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btnSpan = loginBtn.querySelector('span');
            loginBtn.style.pointerEvents = 'none';
            loginBtn.classList.add('processing');
            btnSpan.textContent = 'DECRYPTING NEURAL KEY...';
            statusText.textContent = "SECURITY OVERRIDE INITIATED";
            statusText.style.color = "var(--neon-purple)";
            
            setTimeout(() => {
                btnSpan.textContent = 'NEURAL SYNC COMPLETE';
                statusText.textContent = "ACCESS GRANTED - WELCOME RESEARCHER";
                statusText.style.color = "var(--neon-cyan)";
                loginBtn.style.background = 'linear-gradient(135deg, #00F3FF, #9D00FF)';
                loginBtn.style.boxShadow = '0 0 50px rgba(0, 243, 255, 0.8)';
                setTimeout(() => {
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 1s ease';
                    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
                }, 1500);
            }, 2500);
        });
    }

    // Entrance Animation - Targeted at the Container
    const cardContainer = document.querySelector('.card-tilt-container');
    if (cardContainer) {
        cardContainer.style.opacity = '0';
        cardContainer.style.transform = 'translateY(40px)';
        cardContainer.style.transition = 'all 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        setTimeout(() => {
            cardContainer.style.opacity = '1';
            cardContainer.style.transform = 'translateY(0)';
        }, 150);
    }
});
