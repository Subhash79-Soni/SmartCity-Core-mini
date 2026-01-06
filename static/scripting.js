document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATE & GREETING
    const dateEl = document.getElementById('dateDisplay');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);

    // 2. CHART CONFIG (Professional Look)
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    
    // Traffic Chart (Area with Gradient)
    const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
    const gradient = ctxTraffic.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue fade
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    const trafficChart = new Chart(ctxTraffic, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
            datasets: [{
                label: 'Prediction',
                data: [1200, 1350, 1100, 1400, 1600, 1550],
                borderColor: '#3b82f6',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });

    // Energy Chart (Doughnut)
    const ctxEnergy = document.getElementById('energyPieChart').getContext('2d');
    new Chart(ctxEnergy, {
        type: 'doughnut',
        data: {
            labels: ['Industrial', 'Residential', 'Public'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
        }
    });

    // 3. LIVE DATA SIMULATION (Fetch from Python in real usage)
    function updateMetrics() {
        // Mock Data for UI demonstration
        const tVal = Math.floor(1000 + Math.random() * 500);
        const aVal = Math.floor(50 + Math.random() * 50);
        const eVal = (50 + Math.random() * 10).toFixed(1);
        
        document.getElementById('trafficValue').innerText = tVal.toLocaleString();
        document.getElementById('aqiValue').innerText = aVal;
        document.getElementById('energyValue').innerText = eVal;

        // Push new data to chart
        const newData = trafficChart.data.datasets[0].data;
        newData.shift();
        newData.push(tVal);
        trafficChart.update('none'); // 'none' for smooth animation
    }
    
    setInterval(updateMetrics, 3000);

    // 4. CAMERA & LOGS
    const video = document.getElementById('cameraFeed');
    const status = document.getElementById('aiStatus');
    const logList = document.getElementById('logList');
    let stream = null;

    document.getElementById('camStart').addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            status.innerText = "● LIVE ANALYSIS ON";
            status.style.color = "#10b981";
            status.style.borderColor = "#10b981";
            addLog("Camera Connected. AI Model Loading...");
        } catch(e) {
            alert("Camera access needed for demo");
        }
    });

    document.getElementById('camStop').addEventListener('click', () => {
        if(stream) stream.getTracks().forEach(t => t.stop());
        video.srcObject = null;
        status.innerText = "System Standby";
        status.style.color = "#ef4444";
        status.style.borderColor = "#ef4444";
        addLog("Feed Terminated.");
    });

    function addLog(msg) {
        const li = document.createElement('li');
        const time = new Date().toLocaleTimeString('en-US', {hour12: false});
        li.innerHTML = `<span class="time">${time}</span> ${msg}`;
        logList.prepend(li);
    }
});