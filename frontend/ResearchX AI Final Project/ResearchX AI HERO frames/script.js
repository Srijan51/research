document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for active nav items
    const sections = document.querySelectorAll('main section');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px', // Adjusted to trigger earlier
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update active class on nav items
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observer for cinematic fade-in/out animations
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    sections.forEach(section => {
        if (section.id && section.id !== '') {
            observer.observe(section);
            revealObserver.observe(section);
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '16px 0';
            navbar.style.background = 'rgba(5, 5, 12, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.WebkitBackdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        } else {
            navbar.style.padding = '24px 0';
            navbar.style.background = 'rgba(5, 5, 12, 0.6)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.WebkitBackdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        }
    });
    
    // Add subtle hover animations to strategy nodes
    const nodes = document.querySelectorAll('.node.sub');
    const coreNode = document.querySelector('.core');
    
    if (coreNode) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                coreNode.style.boxShadow = '0 0 80px rgba(0, 243, 255, 0.7), inset 0 0 30px rgba(0, 243, 255, 0.5)';
                coreNode.style.borderColor = 'var(--neon-cyan)';
            });
            node.addEventListener('mouseleave', () => {
                coreNode.style.boxShadow = '';
                coreNode.style.borderColor = '';
            });
        });
    }

    // Particles animation
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.8)' : 'rgba(157, 0, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Dynamic Neural Load Updater
    function updateNeuralLoad() {
        const loadElement = document.querySelector('.status-metric');
        if (loadElement) {
            const load = Math.floor(Math.random() * 71) + 15; // Random between 15-85
            loadElement.textContent = `Neural Load: ${load}%`;
        }
    }

    // Update neural load every 3-5 seconds
    setInterval(updateNeuralLoad, Math.random() * 2000 + 3000); // 3-5 seconds

    // Initial update
    updateNeuralLoad();

    // Animate Results Dashboard Bars
    function animateBars() {
        const bars = document.querySelectorAll('.bar-fill');
        bars.forEach((bar, index) => {
            const value = bar.getAttribute('data-value');
            bar.style.setProperty('--bar-height', `${value}%`);
        });
    }

    // Update dashboard metrics dynamically
    function updateDashboardMetrics() {
        const processingStatus = document.getElementById('processing-status');
        const confidenceLevel = document.getElementById('confidence-level');
        const dataPoints = document.getElementById('data-points');

        if (processingStatus) {
            const statuses = ['Analyzing...', 'Processing...', 'Synthesizing...', 'Complete'];
            processingStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
        }

        if (confidenceLevel) {
            const confidence = (Math.random() * 10 + 90).toFixed(1);
            confidenceLevel.textContent = `${confidence}%`;
        }

        if (dataPoints) {
            const points = Math.floor(Math.random() * 1000000) + 2000000;
            dataPoints.textContent = `${(points / 1000000).toFixed(1)}M`;
        }
    }

    // Initialize dashboard animations
    animateBars();
    updateDashboardMetrics();

    // Update metrics every 4-6 seconds
    setInterval(updateDashboardMetrics, Math.random() * 2000 + 4000);

    // Dynamic Memory Stats Updater
    function updateMemoryStats() {
        const totalMemory = document.getElementById('total-memory');
        const activeSessions = document.getElementById('active-sessions');
        const syncRate = document.getElementById('sync-rate');
        const neuralLinks = document.getElementById('neural-links');

        if (totalMemory) {
            const memory = (40 + Math.random() * 20).toFixed(1);
            totalMemory.textContent = `${memory} TB`;
        }

        if (activeSessions) {
            const sessions = Math.floor(1000 + Math.random() * 1000);
            activeSessions.textContent = sessions.toLocaleString();
        }

        if (syncRate) {
            const rate = (95 + Math.random() * 5).toFixed(1);
            syncRate.textContent = `${rate}%`;
        }

        if (neuralLinks) {
            const links = Math.floor(8000 + Math.random() * 2000);
            neuralLinks.textContent = links.toLocaleString();
        }
    }

    // Update memory stats every 5-8 seconds
    setInterval(updateMemoryStats, Math.random() * 3000 + 5000);

    // Initialize memory stats
    updateMemoryStats();

    // ===== OUTPUT GENERATOR ENHANCED FUNCTIONALITY =====

    // Dynamic Output Status Updates
    function updateOutputStatus() {
        const generationProgress = document.getElementById('generation-progress');
        const generationStatus = document.getElementById('generation-status');
        const outputQuality = document.getElementById('output-quality');
        const processingSpeed = document.getElementById('processing-speed');
        const dataSources = document.getElementById('data-sources');
        const docTimestamp = document.getElementById('doc-timestamp');

        // Update generation progress (animated ring)
        if (generationProgress) {
            const progress = Math.floor(Math.random() * 40) + 60; // 60-100%
            generationProgress.style.background = `conic-gradient(var(--neon-cyan) ${progress * 3.6}deg, transparent 0deg)`;
            generationProgress.textContent = `${progress}%`;
        }

        // Update generation status
        if (generationStatus) {
            const statuses = ['Ready', 'Analyzing', 'Processing', 'Synthesizing', 'Optimizing', 'Complete'];
            generationStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
        }

        // Update output quality
        if (outputQuality) {
            const quality = (95 + Math.random() * 5).toFixed(1);
            outputQuality.textContent = `${quality}%`;
        }

        // Update processing speed
        if (processingSpeed) {
            const speed = (1.5 + Math.random() * 2).toFixed(1);
            processingSpeed.textContent = `${speed}s`;
        }

        // Update data sources
        if (dataSources) {
            const sources = Math.floor(1000 + Math.random() * 1000);
            dataSources.textContent = sources.toLocaleString();
        }

        // Update document timestamp
        if (docTimestamp) {
            const now = new Date();
            const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
            docTimestamp.textContent = timestamp;
        }
    }

    // Initialize output status updates
    updateOutputStatus();
    setInterval(updateOutputStatus, Math.random() * 3000 + 4000); // 4-7 seconds

    // Format Card Interactions
    const formatCards = document.querySelectorAll('.format-card');
    formatCards.forEach(card => {
        card.addEventListener('click', function() {
            const format = this.getAttribute('data-format');

            // Remove active class from all cards
            formatCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');

            // Show processing overlay
            showProcessingOverlay();

            // Simulate processing delay
            setTimeout(() => {
                hideProcessingOverlay();
                showSuccessMessage(format);
            }, 2000 + Math.random() * 2000);
        });
    });

    // Processing Overlay Functions
    function showProcessingOverlay() {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    function hideProcessingOverlay() {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Success Message Function
    function showSuccessMessage(format) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="success-icon">✅</div>
            <div class="success-text">
                <div class="success-title">${format.toUpperCase()} Export Complete</div>
                <div class="success-desc">Your research intelligence has been generated successfully</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Enhanced Button Interactions
    const pdfBtn = document.getElementById('pdf-download-btn');
    const exportBtn = document.getElementById('export-schema-btn');
    const apiBtn = document.getElementById('data-api-btn');
    const shareBtn = document.getElementById('share-btn');

    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            showProcessingOverlay();
            setTimeout(() => {
                hideProcessingOverlay();
                showSuccessMessage('pdf');
                // Simulate PDF download
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'ResearchX_Intelligence_Report.pdf';
                link.click();
            }, 2500);
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showProcessingOverlay();
            setTimeout(() => {
                hideProcessingOverlay();
                showSuccessMessage('schema');
            }, 1800);
        });
    }

    if (apiBtn) {
        apiBtn.addEventListener('click', function() {
            // Toggle API stream
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.innerHTML = '<span>🔄 API Stream Active</span>';
                startAPIStream();
            } else {
                this.innerHTML = '<span>🔗 Data API Stream</span>';
                stopAPIStream();
            }
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            showProcessingOverlay();
            setTimeout(() => {
                hideProcessingOverlay();
                showSuccessMessage('share');
                // Simulate share functionality
                if (navigator.share) {
                    navigator.share({
                        title: 'ResearchX AI Intelligence Report',
                        text: 'Advanced AI-generated research insights',
                        url: window.location.href
                    });
                }
            }, 1500);
        });
    }

    // API Stream Simulation
    let apiStreamInterval;
    function startAPIStream() {
        const statusElement = document.getElementById('generation-status');
        if (statusElement) {
            apiStreamInterval = setInterval(() => {
                const dataPoints = ['Streaming...', 'Processing...', 'Analyzing...', 'Synthesizing...'];
                statusElement.textContent = dataPoints[Math.floor(Math.random() * dataPoints.length)];
            }, 1000);
        }
    }

    function stopAPIStream() {
        if (apiStreamInterval) {
            clearInterval(apiStreamInterval);
            const statusElement = document.getElementById('generation-status');
            if (statusElement) {
                statusElement.textContent = 'Ready';
            }
        }
    }

    // Add CSS for success notification
    const style = document.createElement('style');
    style.textContent = `
        .success-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid var(--neon-cyan);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .success-notification.show {
            transform: translateX(0);
        }

        .success-icon {
            font-size: 1.5rem;
            color: var(--neon-cyan);
        }

        .success-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: var(--text-main);
            margin-bottom: 5px;
        }

        .success-desc {
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .format-card.active {
            border-color: var(--neon-cyan);
            box-shadow: 0 0 20px rgba(0,255,255,0.4);
            background: rgba(0,255,255,0.1);
        }

        .btn-secondary.active {
            background: rgba(0,255,255,0.1);
            border-color: var(--neon-cyan);
            box-shadow: 0 0 15px rgba(0,255,255,0.4);
        }
    `;
    document.head.appendChild(style);

    // ===== ENHANCED PROCESS SECTION FUNCTIONALITY =====

    // Process Control Panel Updates
    function updateProcessMetrics() {
        const cpuUsage = document.getElementById('cpu-usage');
        const neuralLoad = document.getElementById('neural-load');
        const dataThroughput = document.getElementById('data-throughput');
        const processTime = document.getElementById('process-time');
        const processStatus = document.getElementById('process-status');

        // Update CPU usage
        if (cpuUsage) {
            const cpu = Math.floor(70 + Math.random() * 25);
            cpuUsage.textContent = `${cpu}%`;
        }

        // Update neural load
        if (neuralLoad) {
            const load = Math.floor(85 + Math.random() * 12);
            neuralLoad.textContent = `${load}%`;
        }

        // Update data throughput
        if (dataThroughput) {
            const throughput = (1.5 + Math.random() * 2).toFixed(1);
            dataThroughput.textContent = `${throughput}GB/s`;
        }

        // Update process time (incrementing timer)
        if (processTime) {
            const currentTime = processTime.textContent.split(':');
            let hours = parseInt(currentTime[0]);
            let minutes = parseInt(currentTime[1]);
            let seconds = parseInt(currentTime[2]);

            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }

            processTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Update process status
        if (processStatus) {
            const statuses = ['Active', 'Processing', 'Optimizing', 'Analyzing'];
            const statusText = processStatus.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = statuses[Math.floor(Math.random() * statuses.length)];
            }
        }
    }

    // Initialize process metrics updates
    updateProcessMetrics();
    setInterval(updateProcessMetrics, Math.random() * 2000 + 3000); // 3-5 seconds

    // Step Progress Updates
    function updateStepProgress() {
        const steps = [
            { id: 'step1', progress: 100, text: 'step1-text' },
            { id: 'step2', progress: 87, text: 'step2-text' },
            { id: 'step3', progress: 64, text: 'step3-text' },
            { id: 'step4', progress: 23, text: 'step4-text' }
        ];

        steps.forEach((step, index) => {
            const progressElement = document.getElementById(`${step.id}-progress`);
            const textElement = document.getElementById(step.text);

            if (progressElement && textElement) {
                let currentProgress = parseInt(textElement.textContent) || 0;
                let targetProgress = step.progress;

                // Add some randomness to make it more dynamic
                if (index < 3) { // First 3 steps are mostly complete
                    targetProgress = Math.min(100, targetProgress + Math.floor(Math.random() * 10) - 5);
                } else { // Last step is progressing
                    targetProgress = Math.min(100, currentProgress + Math.floor(Math.random() * 8));
                }

                // Smooth animation
                const increment = targetProgress - currentProgress;
                if (Math.abs(increment) > 0) {
                    const stepIncrement = increment / 20; // 20 frames for smooth animation
                    let frame = 0;

                    const animateProgress = () => {
                        frame++;
                        const newProgress = Math.round(currentProgress + (stepIncrement * frame));

                        progressElement.style.width = `${newProgress}%`;
                        textElement.textContent = `${newProgress}%`;

                        if (frame < 20) {
                            requestAnimationFrame(animateProgress);
                        }
                    };

                    animateProgress();
                }
            }
        });
    }

    // Initialize step progress updates
    updateStepProgress();
    setInterval(updateStepProgress, Math.random() * 4000 + 6000); // 6-10 seconds

    // Step Data Stream Animations
    function updateStepStatuses() {
        const stepStatuses = ['step1-status', 'step2-status', 'step3-status', 'step4-status'];

        stepStatuses.forEach((statusId, index) => {
            const statusElement = document.getElementById(statusId);
            if (statusElement) {
                const dataStream = statusElement.querySelector('.data-stream');
                if (dataStream) {
                    // Different animation speeds and styles for different steps
                    const speeds = ['3s', '2.7s', '2.4s', '2.1s'];
                    const intensities = ['high', 'medium', 'medium', 'low'];

                    dataStream.style.animationDuration = speeds[index];
                    dataStream.setAttribute('data-intensity', intensities[index]);
                }
            }
        });
    }

    updateStepStatuses();

    // Process Visualization Controls
    const vizButtons = document.querySelectorAll('.viz-btn');
    vizButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            vizButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });

    function switchView(view) {
        const flowDiagram = document.querySelector('.flow-diagram');
        if (flowDiagram) {
            // Add transition effect
            flowDiagram.style.opacity = '0.5';
            setTimeout(() => {
                flowDiagram.style.opacity = '1';
            }, 300);

            // Here you could implement different visualization modes
            console.log(`Switching to ${view} view`);
        }
    }

    // Interactive Step Cards
    const stepCards = document.querySelectorAll('.step');
    stepCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Add click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Show step details (could expand this)
            showStepDetails(index + 1);
        });

        // Add hover sound effect simulation
        card.addEventListener('mouseenter', function() {
            // Could add audio feedback here
            console.log(`Hovering over step ${index + 1}`);
        });
    });

    function showStepDetails(stepNumber) {
        const stepDetails = [
            'Objective: Defining research parameters and scope for autonomous execution',
            'Ingestion: Scanning and parsing data across multiple network nodes',
            'Analysis: Neural pattern synthesis and correlation analysis',
            'Insights: Extracting actionable intelligence vectors'
        ];

        // Create a temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'step-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>Step ${stepNumber} Details</h4>
                <p>${stepDetails[stepNumber - 1]}</p>
            </div>
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;

        // Animate in
        setTimeout(() => tooltip.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }

    // Data Flow Animation Enhancement
    function enhanceDataFlow() {
        const connectors = document.querySelectorAll('.connector');
        connectors.forEach((connector, index) => {
            const dataPackets = connector.querySelectorAll('.data-packet');

            // Stagger the animations
            dataPackets.forEach((packet, packetIndex) => {
                packet.style.animationDelay = `${index * 0.5 + packetIndex * 0.3}s`;
            });
        });
    }

    enhanceDataFlow();

    // Flow Node Interactions
    const flowNodes = document.querySelectorAll('.flow-node');
    flowNodes.forEach((node, index) => {
        node.addEventListener('click', function() {
            // Highlight the clicked node
            flowNodes.forEach(n => n.classList.remove('selected'));
            this.classList.add('selected');

            // Update step progress to focus on this step
            updateStepFocus(index + 1);
        });
    });

    function updateStepFocus(stepNumber) {
        // Could implement step-specific focus functionality
        console.log(`Focusing on step ${stepNumber}`);
    }

    // Add CSS for step tooltips
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .step-tooltip {
            position: fixed;
            transform: translate(-50%, -100%) translateY(-10px);
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .step-tooltip.show {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(0);
        }

        .tooltip-content {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid var(--neon-cyan);
            border-radius: 8px;
            padding: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            min-width: 250px;
        }

        .tooltip-content h4 {
            color: var(--neon-cyan);
            margin: 0 0 10px 0;
            font-size: 1rem;
        }

        .tooltip-content p {
            color: var(--text-main);
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.4;
        }

        .flow-node.selected {
            border-color: var(--neon-purple);
            background: rgba(157, 0, 255, 0.1);
            transform: scale(1.05);
        }

        .flow-node.selected .node-pulse {
            background: var(--neon-purple);
            animation: nodePulseSelected 1.5s ease-in-out infinite;
        }

        @keyframes nodePulseSelected {
            0%, 100% {
                transform: scale(1);
                opacity: 0.8;
                box-shadow: 0 0 15px var(--neon-purple);
            }
            50% {
                transform: scale(1.4);
                opacity: 1;
                box-shadow: 0 0 25px var(--neon-purple), 0 0 35px var(--neon-purple);
            }
        }
    `;
    document.head.appendChild(tooltipStyle);

});
