/**
 * WaveSPSAI Application Logic
 * Structure: Modular Object-Oriented Style
 */

const App = {
    init() {
        this.setupNavigation();
        this.setupTheme();
        this.setupAuthModal();
        this.setupPremiumModal();
        this.setupCharts();
        this.setupSimulation();
        this.startMetricsLoop();
        this.setupForms();
    },

    // --- 1. Navigation Logic ---
    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking a link (Mobile UX)
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => navLinks.classList.remove('active'));
            });
        }
    },

    // --- 2. Theme Toggle Logic ---
    setupTheme() {
        const toggleBtn = document.getElementById('themeToggle');
        const html = document.documentElement;

        if (toggleBtn) {
            // Check local storage preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) html.setAttribute('data-theme', savedTheme);

            toggleBtn.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Update button icon
                toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
            });
        }
    },

    // --- 3. Auth Modal Logic ---
    setupAuthModal() {
        const modal = document.getElementById('authModal');
        if (!modal) return;

        const triggers = {
            login: document.getElementById('showLoginBtn'),
            signup: document.getElementById('showSignupBtn'),
            close: document.getElementById('closeModalBtn'),
            switchLogin: document.getElementById('switchLogin'),
            switchSignup: document.getElementById('switchSignup')
        };

        const forms = {
            login: document.getElementById('loginForm'),
            signup: document.getElementById('signupForm')
        };

        const openModal = (type) => {
            modal.classList.add('visible');
            if(type === 'signup') {
                forms.signup.classList.remove('hidden');
                forms.login.classList.add('hidden');
                triggers.switchSignup.classList.add('active');
                triggers.switchLogin.classList.remove('active');
            } else {
                forms.login.classList.remove('hidden');
                forms.signup.classList.add('hidden');
                triggers.switchLogin.classList.add('active');
                triggers.switchSignup.classList.remove('active');
            }
        };

        if (triggers.login) triggers.login.addEventListener('click', () => openModal('login'));
        if (triggers.signup) triggers.signup.addEventListener('click', () => openModal('signup'));
        
        if (triggers.close) triggers.close.addEventListener('click', () => modal.classList.remove('visible'));
        
        // Switch tabs inside modal
        if (triggers.switchLogin) triggers.switchLogin.addEventListener('click', () => openModal('login'));
        if (triggers.switchSignup) triggers.switchSignup.addEventListener('click', () => openModal('signup'));

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('visible');
        });
    },
        // --- YEH NAYA FUNCTION HAI ---
    setupPremiumModal() {
        const premiumBtn = document.getElementById('premiumBtn');
        const qrModal = document.getElementById('qrModal');
        const closeQrBtn = document.getElementById('closeQrBtn');
        const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

        if (premiumBtn) {
            premiumBtn.addEventListener('click', (e) => {
                e.preventDefault();
                qrModal.classList.add('visible');
            });
        }

        if (closeQrBtn) {
            closeQrBtn.addEventListener('click', () => {
                qrModal.classList.remove('visible');
            });
        }

        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => {
                confirmPaymentBtn.innerText = "Verifying...";
                setTimeout(() => {
                    const targetUrl = premiumBtn.getAttribute('data-url');
                    window.location.href = targetUrl; 
                }, 1500);
            });
        }

        if (qrModal) {
            qrModal.addEventListener('click', (e) => {
                if (e.target === qrModal) qrModal.classList.remove('visible');
            });
        }
    },
    // --- 4. Chart.js Configuration ---
    setupCharts() {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        };

        // Traffic Chart
        const trafficCtx = document.getElementById('trafficChart');
        if (trafficCtx) {
            new Chart(trafficCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                    datasets: [{
                        label: 'Traffic Density',
                        data: [120, 180, 150, 190, 160, 130, 145],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: commonOptions
            });
        }

        // Pollution Chart
        const pollutionCtx = document.getElementById('pollutionChart');
        if (pollutionCtx) {
            new Chart(pollutionCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['North', 'Central', 'South', 'Ind. Area'],
                    datasets: [{
                        label: 'PM2.5 (µg/m³)',
                        data: [55, 120, 40, 150],
                        backgroundColor: ['#3b82f6', '#fbbf24', '#10b981', '#ef4444'],
                        borderRadius: 4
                    }]
                },
                options: { ...commonOptions, plugins: { legend: { display: false } } }
            });
        }

        // Energy Chart
        const energyCtx = document.getElementById('energyPieChart');
        if (energyCtx) {
            new Chart(energyCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Street Lights', 'Homes', 'Offices', 'Transit'],
                    datasets: [{
                        data: [25, 45, 20, 10],
                        backgroundColor: ['#3b82f6', '#10b981', '#fbbf24', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
                }
            });
        }
    },

    // --- 5. Simulation Logic (Camera & Geo) ---
    setupSimulation() {
        const cameraBtn = document.getElementById('cameraOnBtn');
        const cameraStopBtn = document.getElementById('cameraOffBtn');
        const videoEl = document.getElementById('cameraFeed');
        const overlay = document.getElementById('aiOverlay');
        let mediaStream = null;

        // Camera Logic
        if (cameraBtn) {
            cameraBtn.addEventListener('click', async () => {
                try {
                    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoEl.srcObject = mediaStream;
                    overlay.textContent = "Processing: 24 Objects detected...";
                    overlay.style.color = "#34d399";
                    overlay.style.borderColor = "#34d399";
                } catch (err) {
                    console.error("Camera Error:", err);
                    overlay.textContent = "Error: Camera Access Denied";
                    overlay.style.color = "#ef4444";
                }
            });
        }

        if (cameraStopBtn) {
            cameraStopBtn.addEventListener('click', () => {
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    videoEl.srcObject = null;
                    overlay.textContent = "AI System Offline";
                    overlay.style.color = "#ef4444";
                    overlay.style.borderColor = "#ef4444";
                }
            });
        }

        // Geolocation Logic
        const locateBtn = document.getElementById('locateBtn');
        const statusEl = document.getElementById('locationStatus');
        const coordsEl = document.getElementById('locationCoords');

        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                if (!navigator.geolocation) {
                    statusEl.textContent = "Geo-API Not Supported";
                    return;
                }
                statusEl.textContent = "Locating Sensors...";
                
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        statusEl.textContent = "Status: Connected";
                        coordsEl.textContent = `Lat:${pos.coords.latitude.toFixed(4)}, Lng:${pos.coords.longitude.toFixed(4)}`;
                        statusEl.style.color = "#34d399";
                    },
                    (err) => {
                        statusEl.textContent = "Status: Failed";
                        statusEl.style.color = "#ef4444";
                    }
                );
            });
        }
    },

   // --- 6. Live Metrics Loop (Connected to Flask) ---
startMetricsLoop() {
    const update = async () => {
        try {
            // Python Backend se data mangwana
            const response = await fetch('/api/metrics'); 
            const data = await response.json();

            // UI Update karna
            const tEl = document.getElementById('trafficValue');
            const aEl = document.getElementById('aqiValue');
            const eEl = document.getElementById('energyValue');

            if (tEl) tEl.textContent = `${data.traffic} veh/hr`;
            if (aEl) aEl.textContent = `${data.aqi} AQI`;
            if (eEl) eEl.textContent = `${data.energy} MW`;
            
            // Color change logic (Optional)
            if(data.aqi > 200) aEl.style.color = "#ef4444"; // Red if pollution high

        } catch (error) {
            console.error("Backend Error:", error);
        }
    };

    update();
    setInterval(update, 4000); // Har 4 second mein refresh
}};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// --- 3. REAL-TIME AI METRICS (Updated for ML Models) ---

async function updateMetrics() {
    try {
        // Backend API call karein
        const response = await fetch('/api/live-prediction');
        const data = await response.json();

        // 1. Traffic Update
        const trafficEl = document.getElementById('trafficValue');
        if (trafficEl) {
            trafficEl.textContent = `${data.traffic} Vehicles/hr`;
            // Color logic: Zyada traffic = Red
            trafficEl.style.color = data.traffic > 1600 ? '#ef4444' : '#10b981'; 
        }

        // 2. AQI Update
        const aqiEl = document.getElementById('aqiValue');
        if (aqiEl) {
            aqiEl.textContent = `${data.aqi} AQI`;
            // Color logic: Kharab hawa = Orange/Red
            aqiEl.style.color = data.aqi > 150 ? '#f59e0b' : '#34d399';
        }

        // 3. Energy Update
        const energyEl = document.getElementById('energyValue');
        if (energyEl) {
            energyEl.textContent = `${data.energy} MW`;
        }

        console.log(`AI Prediction Updated: Hour ${data.hour}`);

    } catch (error) {
        console.error('AI Backend Error:', error);
        // Agar error aaye to user ko batayein
        document.getElementById('trafficValue').textContent = "Connecting...";
    }
}
// --- 7. FORM HANDLING (Login, Signup, Contact) ---
    setupForms() 
        // --- SIGNUP LOGIC ---
        const signupForm = document.getElementById('frmSignup');
        if(signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault(); // Page refresh hone se rokein
                
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPass').value;

                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const result = await response.json();
                alert(result.message);
                
                if(result.status === 'success') {
                    // Signup ke baad login tab par switch karein
                    document.getElementById('switchLogin').click();
                }
            });
        }

        // --- LOGIN LOGIC ---
        const loginForm = document.getElementById('frmLogin');
        if(loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                
                if(result.status === 'success') {
                    window.location.href = result.redirect; // Dashboard par le jayein
                } else {
                    alert(result.message);
                }
            });
        }

        // --- CONTACT FORM LOGIC ---
        const contactForm = document.getElementById('frmContact');
        if(contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = document.getElementById('contactName').value;
                const email = document.getElementById('contactEmail').value;
                const message = document.getElementById('contactMsg').value;

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();
                alert(result.message);
                contactForm.reset(); // Form khali kar dein
            });
        }
    



// Initial call
updateMetrics();
// Har 5 second mein naya AI prediction lein
setInterval(updateMetrics, 5000);