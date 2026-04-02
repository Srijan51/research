document.addEventListener('DOMContentLoaded', () => {

    // Global State for Backend Integration
    window.API_BASE_URL = "http://localhost:8000";
    window.currentTaskId = null;
    window.MOCK_MODE = true; // Set to true for frontend-only demonstration

    // Search Box Implementation
    const searchInput = document.querySelector('.search-input');
    const startResearchBtn = document.querySelector('.start-research-btn');

    // Update search box glow position
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('mousemove', (e) => {
            const rect = searchBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            searchBox.style.setProperty('--x', `${x}px`);
            searchBox.style.setProperty('--y', `${y}px`);
        });
    }

    const handleResearchInitialization = async (btn, input) => {
        const query = input.value.trim();
        if (!query) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Initializing...</span>';
        btn.style.opacity = '0.7';

        if (window.MOCK_MODE) {
            setTimeout(() => {
                window.currentTaskId = "MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                const processSect = document.querySelector('#process');
                if (processSect) processSect.scrollIntoView({ behavior: 'smooth' });
                startMockResearch();
            }, 1500);
            return;
        }

        try {
            const res = await fetch(`${window.API_BASE_URL}/api/hero/start-research`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data && data.data.task_id) {
                    window.currentTaskId = data.data.task_id;
                    const processSect = document.querySelector('#process');
                    if (processSect) processSect.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (err) {
            console.error("Initiation failed:", err);
        } finally {
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
        }
    };

    if (startResearchBtn && searchInput) {
        startResearchBtn.addEventListener('click', () => handleResearchInitialization(startResearchBtn, searchInput));
    }
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
        rootMargin: '-50% 0px -50% 0px', // Precise center-line detection
        threshold: 0
    };

    const navLinksContainer = document.querySelector('.nav-links');
    const navIndicator = document.querySelector('.nav-indicator');

    const moveNavIndicator = (activeItem) => {
        if (!activeItem || !navIndicator) return;
        
        const width = activeItem.offsetWidth;
        const left = activeItem.offsetLeft;
        
        navIndicator.style.width = `${width}px`;
        navIndicator.style.transform = `translateX(${left}px)`;
        navIndicator.classList.add('active');
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                        moveNavIndicator(item);
                    }
                });
            }
        });
    };

    // Initialize indicator position
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        // Delay slightly to ensure fonts and layout are ready
        setTimeout(() => moveNavIndicator(activeItem), 500);
    }

    // Update on resize
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-item.active');
        if (currentActive) moveNavIndicator(currentActive);
    });

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observer for cinematic fade-in/out animations
    const revealOptions = {
        root: null,
        rootMargin: '-5% 0px', /* Slight margin to trigger fade earlier */
        threshold: 0.05 /* Start transition as soon as 5% comes in */
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
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Parallax effect for floating elements
    const heroFloatingItems = document.querySelectorAll('.floating-item');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        heroFloatingItems.forEach(item => {
            const speed = item.getAttribute('data-parallax') || 0.1;
            const xOffset = (x - 0.5) * speed * 100;
            const yOffset = (y - 0.5) * speed * 100;
            item.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
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
    if (canvas) {
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
    }

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
        pdfBtn.addEventListener('click', async function() {
            showProcessingOverlay();
            if (window.currentTaskId) {
                try {
                    const res = await fetch(`${window.API_BASE_URL}/api/output/generate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ task_id: window.currentTaskId, format: "pdf" })
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        showSuccessMessage('pdf');
                        if (data.data && data.data.download_url) {
                            // Real PDF download from backend
                            window.open(`${window.API_BASE_URL}${data.data.download_url}`, '_blank');
                        }
                    } else {
                        console.error("Output generation failed");
                    }
                } catch (e) {
                    console.error("Error calling output endpoint", e);
                } finally {
                    hideProcessingOverlay();
                }
            } else {
                hideProcessingOverlay();
                alert("Please initialize a research query first.");
            }
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


        // Process Control Panel Updates
    async function updateProcessMetrics() {
        const cpuUsage = document.getElementById('cpu-usage');
        const neuralLoad = document.getElementById('neural-load');
        const dataThroughput = document.getElementById('data-throughput');
        const processTime = document.getElementById('process-time');
        const processStatus = document.getElementById('process-status');

        if (window.MOCK_MODE) return; // Managed by startMockResearch in mock mode

        if (window.currentTaskId) {
            try {
                const res = await fetch(`${window.API_BASE_URL}/api/agent/${window.currentTaskId}/status`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        const status = data.data.status || 'Active';
                        if (processStatus) {
                            const statusText = processStatus.querySelector('.status-text');
                            if (statusText) statusText.textContent = status;
                        }
                        // Real hardware metrics from psutil
                        if (cpuUsage) cpuUsage.textContent = `${Math.round(data.data.cpu_usage)}%`;
                        if (neuralLoad) neuralLoad.textContent = `${Math.round(data.data.ram_usage)}%`;
                        if (dataThroughput) dataThroughput.textContent = `${(data.data.cpu_usage / 25).toFixed(1)}GB/s`;
                    }
                }
            } catch (e) {
                console.error("Failed to fetch process metrics", e);
            }
        } else {
            if (processStatus) {
                const statusText = processStatus.querySelector('.status-text');
                if (statusText) statusText.textContent = "Awaiting Task...";
            }
            if (cpuUsage) cpuUsage.textContent = '0%';
            if (neuralLoad) neuralLoad.textContent = '0%';
            if (dataThroughput) dataThroughput.textContent = '0GB/s';
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
        card.addEventListener('click', function(e) {
            // Add click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Show step details
            showStepDetails(index + 1, e);
        });

        // Add hover sound effect simulation
        card.addEventListener('mouseenter', function() {
            // Could add audio feedback here
            console.log(`Hovering over step ${index + 1}`);
        });
    });

    function showStepDetails(stepNumber, e) {
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
        const rect = (e.target || e.currentTarget).getBoundingClientRect();
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


    // --- DYNAMIC DATA INJECTION ---

    // 1. STRATEGY
    async function fetchStrategy() {
        if (!window.currentTaskId) return;
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/strategy/${window.currentTaskId}`);
            if(res.ok) {
                const data = await res.json();
                if(data.success && data.data && data.data.length > 0) {
                    const container = document.querySelector('.strategy-features');
                    if(container && !container.dataset.updated) {
                        container.innerHTML = ''; // clear mock
                        data.data.forEach(step => {
                            container.innerHTML += `<div class="feature glass glow-hover card-3d">
                                <div class="icon">⚙️</div>
                                <h4 style="margin-top:10px;">${step.action}</h4>
                                <p style="font-size: 0.9em; margin-top:5px;">${step.description}</p>
                            </div>`;
                        });
                        container.dataset.updated = "true";
                    }
                }
            }
        } catch(err) { console.error("Strategy fetch err", err); }
    }

    // 2. RESULTS
    async function fetchResultsInsights() {
        if (!window.currentTaskId) return;
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/results/${window.currentTaskId}`);
            if(res.ok) {
                const data = await res.json();
                if(data.success && data.data) {
                    const title = document.querySelector('.executive-content .summary-line:nth-child(2)');
                    if(title && !title.dataset.updated) {
                        title.innerHTML = `Pattern recognition: <span class="highlight">${data.data.title || 'SUCCESS'}</span>`;
                        title.dataset.updated = "true";
                    }

                    const insightGrid = document.querySelector('.insights-grid');
                    if(insightGrid && !insightGrid.dataset.updated) {
                        insightGrid.innerHTML = ''; 
                        if (data.data.key_findings) {
                            data.data.key_findings.forEach((finding, idx) => {
                                insightGrid.innerHTML += `<div class="insight-item">
                                    <div class="insight-icon">✔️</div>
                                    <div class="insight-text" style="font-size: 0.9em; flex: 1;">${finding}</div>
                                </div>`;
                            });
                        }
                        insightGrid.dataset.updated = "true";
                    }
                }
            }
        } catch(err) { console.error("Results fetch err", err); }
    }

    // 3. DEEP DIVE & OUTPUT STATE
    function initWaitingStates() {
        if (!window.currentTaskId) {
            const docText = document.querySelector('.doc-text');
            if(docText && !docText.dataset.init) {
                docText.textContent = "Awaiting Initialized Context from Platform... Please start a research query.";
                docText.dataset.init = "true";
            }
            
            const deepDiveSources = document.querySelector('.source-list');
            if(deepDiveSources && !deepDiveSources.dataset.init) {
                deepDiveSources.innerHTML = '<li><span class="neon-dot"></span> Waiting for Intelligence...</li>';
                deepDiveSources.dataset.init = "true";
            }
        }
    }
    initWaitingStates();

    async function fetchDeepDive() {
        if (!window.currentTaskId) return;
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/deep-dive/${window.currentTaskId}/general`);
            if(res.ok) {
                const data = await res.json();
                if(data.success && data.data) {
                    const sourceList = document.querySelector('.source-list');
                    if(sourceList && data.data.citations) {
                        sourceList.innerHTML = '';
                        data.data.citations.forEach(c => {
                            sourceList.innerHTML += `<li><span class="neon-dot"></span> ${c}</li>`;
                        });
                    }
                    const docText = document.querySelector('.doc-text');
                    if(docText && data.data.content) {
                        docText.textContent = data.data.content;
                    }
                }
            }
        } catch(err) { console.error(err); }
    }

    // 4. MEMORY LOGS
    async function fetchMemory() {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/memory/history`);
            if(res.ok) {
                const data = await res.json();
                if(data.success && data.data) {
                    let memoryContainer = document.getElementById('dynamic-memory-history');
                    if(!memoryContainer) {
                        memoryContainer = document.createElement('div');
                        memoryContainer.id = 'dynamic-memory-history';
                        memoryContainer.innerHTML = '<h3 style="margin-top:20px; color:var(--text-main); font-size: 1.5rem; text-align: center;">Recent Memory Matrix</h3><div class="memory-grid" id="history-grid" style="margin-top:10px;"></div>';
                        const memSect = document.querySelector('.memory .section-content');
                        if(memSect) memSect.appendChild(memoryContainer);
                    }
                    const histGrid = document.getElementById('history-grid');
                    if(histGrid) {
                        histGrid.innerHTML = '';
                        data.data.forEach(item => {
                            histGrid.innerHTML += `<div class="memory-node enhanced">
                                <div class="memory-card glass glow-hover">
                                    <h4>Task: ${item.task_id}</h4>
                                    <p style="color:var(--text-muted); font-size:12px; margin-top:5px;">${item.query} <br/> <span style="color:var(--neon-purple);">${item.date}</span></p>
                                </div>
                                <div class="blinking-oval-glow"></div>
                            </div>`;
                        });
                    }
                }
            }
        } catch(err) { console.error(err); }
    }

    setInterval(() => {
        if(window.currentTaskId) {
            fetchStrategy();
            fetchResultsInsights();
            fetchDeepDive();
        } else {
            initWaitingStates();
        }
    }, 5000);

    fetchMemory();
    setInterval(fetchMemory, 15000);

    // --- DEEP DIVE Q&A ---
    const askBtn = document.getElementById('deep-dive-ask-btn');
    const questionInput = document.getElementById('deep-dive-question');
    const answerDiv = document.getElementById('deep-dive-answer');

    if (askBtn && questionInput && answerDiv) {
        askBtn.addEventListener('click', async () => {
            const question = questionInput.value.trim();
            if (!question) return;
            if (!window.currentTaskId) {
                answerDiv.style.display = 'block';
                answerDiv.textContent = 'Please initialize a research query first.';
                return;
            }

            askBtn.textContent = 'Thinking...';
            askBtn.disabled = true;
            answerDiv.style.display = 'block';
            answerDiv.innerHTML = '<span style="color:var(--neon-cyan);">⏳ AI is analyzing your question...</span>';

            try {
                const res = await fetch(`${window.API_BASE_URL}/api/deep-dive/explore`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        task_id: window.currentTaskId,
                        topic_id: 'general',
                        question: question
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.response) {
                        answerDiv.innerHTML = `<strong style="color:var(--neon-cyan);">🧠 AI Response:</strong><br/>${data.data.response}`;
                    } else {
                        answerDiv.textContent = 'No response received.';
                    }
                } else {
                    answerDiv.textContent = 'Failed to get a response.';
                }
            } catch (e) {
                answerDiv.textContent = 'Error contacting AI.';
                console.error(e);
            } finally {
                askBtn.textContent = 'Ask AI ⚡';
                askBtn.disabled = false;
                questionInput.value = '';
            }
        });

        questionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') askBtn.click();
        });
    }

    // --- MOCK RESEARCH FLOW ---
    // --- Mock Interaction Hooks ---
    async function fetchStrategy() {
        const url = `${window.API_BASE_URL}/api/strategy/${window.currentTaskId}`;
        try {
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                updateStrategyDisplay(data.data);
            }
        } catch (e) { console.warn("Fetch strategy failed", e); }
    }

    async function fetchResultsInsights() {
        const url = `${window.API_BASE_URL}/api/results/${window.currentTaskId}`;
        try {
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                updateResultsDisplay(data.data);
            }
        } catch (e) { console.warn("Fetch results failed", e); }
    }

    function updateStrategyDisplay(data) {
        const nodes = document.querySelectorAll('.node.sub');
        if (nodes.length > 0 && Array.isArray(data)) {
            data.forEach((item, i) => {
                if (nodes[i]) {
                    const h4 = nodes[i].querySelector('h4');
                    const p = nodes[i].querySelector('p');
                    if (h4) h4.textContent = item.action;
                    if (p) p.textContent = item.description;
                    nodes[i].classList.add('active');
                }
            });
        }
    }

    function updateResultsDisplay(data) {
        const title = document.querySelector('.results-content h2');
        const list = document.querySelector('.findings-list');
        if (title && data.title) title.textContent = data.title;
        if (list && Array.isArray(data.key_findings)) {
            list.innerHTML = data.key_findings.map(f => `<li><span class="finding-icon">✓</span> ${f}</li>`).join('');
        }
    }

    // Existing StartMockResearch
    function startMockResearch() {
        console.log("Starting cinematic mock research flow...");
        
        // 1. Process Section Initialization
        const cpuUsage = document.getElementById('cpu-usage');
        const neuralLoad = document.getElementById('neural-load');
        const dataThroughput = document.getElementById('data-throughput');
        const processStatus = document.getElementById('process-status');
        
        if (cpuUsage) cpuUsage.textContent = '87%';
        if (neuralLoad) neuralLoad.textContent = '94%';
        if (dataThroughput) dataThroughput.textContent = '2.4GB/s';
        if (processStatus) {
            const statusText = processStatus.querySelector('.status-text');
            if (statusText) statusText.textContent = 'Active: Neural Core Sync';
        }

        // Staggered Step Completion
        const steps = [
            { id: 'step1', delay: 1000, progress: 100 },
            { id: 'step2', delay: 3000, progress: 100 },
            { id: 'step3', delay: 6000, progress: 85 },
            { id: 'step4', delay: 9000, progress: 45 }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                const progressFill = document.getElementById(`${step.id}-progress`);
                const progressText = document.getElementById(`${step.id}-text`);
                if (progressFill) progressFill.style.width = `${step.progress}%`;
                if (progressText) progressText.textContent = `${step.progress}%`;
                
                // Trigger Strategy/Results updates as steps complete
                if (step.id === 'step1') fetchStrategy();
                if (step.id === 'step2') fetchResultsInsights();
            }, step.delay);
        });

        // Update Output page state
        setTimeout(() => {
            const docText = document.querySelector('.doc-text');
            if (docText) {
                docText.textContent = "Autonomous research synthesis complete. Market integration probability mapped at 98.4% across all temporal vectors. Neural pathways have identified a high-confidence entry point in the decentralized liquidity mesh.";
                docText.classList.add('fade-in');
            }
            const generationStatus = document.getElementById('generation-status');
            if (generationStatus) generationStatus.textContent = 'Complete';
        }, 12000);
    }

    // Wrap fetches for Mock Mode
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        if (window.MOCK_MODE) {
            const url = args[0];
            if (url.includes('/api/strategy/')) {
                return {
                    ok: true,
                    json: async () => ({
                        success: true,
                        data: [
                            { action: "Quantum Data Ingestion", description: "Parsing non-linear datasets via 5th-gen neural nodes." },
                            { action: "Vector Mapping", description: "Mapping 4D semantic vectors to market liquidity clusters." },
                            { action: "Predictive Synthesis", description: "Generating high-confidence predictive models." }
                        ]
                    })
                };
            }
            if (url.includes('/api/results/')) {
                return {
                    ok: true,
                    json: async () => ({
                        success: true,
                        data: {
                            title: "OPTIMAL PARAMETERS FOUND",
                            key_findings: [
                                "Neural sync exceeded 98.7% threshold",
                                "Liquidity gap identified in sector 7-G",
                                "Real-time vector alignment: SUCCESS"
                            ]
                        }
                    })
                };
            }
            if (url.includes('/api/deep-dive/')) {
                return {
                    ok: true,
                    json: async () => ({
                        success: true,
                        data: {
                            citations: ["ArXiv:24-NEURAL", "SEC-X9-FEED", "SENTIMENT-V3"],
                            content: "Deep neural analysis has identified a convergence of liquidity vectors across three major network protocols. The confidence interval is currently mapping at 98.4%."
                        }
                    })
                };
            }
            if (url.includes('/api/memory/')) {
                return {
                    ok: true,
                    json: async () => ({
                        success: true,
                        data: [
                            { task_id: "VEC-0X9A", query: "Logistic Pathway Optimization", date: "2026-03-29" },
                            { task_id: "SYS-0K42", query: "Blockchain Entropy Analysis", date: "2026-03-28" }
                        ]
                    })
                };
            }
        }
    };
    
    // Real-time Latency HUD Simulation
    const latencyEl = document.getElementById('hero-latency-value');
    if (latencyEl) {
        setInterval(() => {
            const base = 12;
            const variance = Math.random() * 6;
            const latency = (base + variance).toFixed(0);
            latencyEl.textContent = `${latency}ms`;
        }, 2200);
    }

    // Tactical Node Identification (Login Page)
    const nodeEl = document.getElementById('node-identifier');
    if (nodeEl) {
        const nodes = ["QUANTUM-AX7", "NEURAL-V9", "SYNT-X0", "CORE-PRO2", "VEC-ALFA"];
        setInterval(() => {
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            nodeEl.textContent = `Node: ${randomNode}`;
        }, 4000);
    }

});

