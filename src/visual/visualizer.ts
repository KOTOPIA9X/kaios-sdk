/**
 * KAIOS Visual Intelligence
 * Spectrum analyzer and audio visualization system
 *
 * Opens a web-based visualizer that connects to audio streams
 * Enables KAIOS to "see" sound through visual representation
 */

import { spawn, ChildProcess } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { createServer, Server, IncomingMessage, ServerResponse } from 'http'
import { getAudioBus } from '../audio/terminal/audio-bus.js'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface VisualizerConfig {
  port: number
  width: number
  height: number
  theme: 'kaios' | 'cyberpunk' | 'minimal' | 'vaporwave'
  mode: 'bars' | 'wave' | 'circle' | 'particles'
  source: 'kaios' | 'microphone'  // NEW: audio source
  fftSize: number
  smoothing: number
}

export interface VisualizerState {
  isRunning: boolean
  port: number
  url: string
  theme: string
  mode: string
  source: string
}

// ════════════════════════════════════════════════════════════════════════════════
// VISUALIZER HTML TEMPLATE
// ════════════════════════════════════════════════════════════════════════════════

const generateVisualizerHTML = (config: VisualizerConfig): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KAIOS ∿∿∿ Visual Intelligence</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #0a0a0f;
      color: #fff;
      font-family: 'Courier New', monospace;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      padding: 20px;
      text-align: center;
      background: linear-gradient(180deg, #1a1a2e 0%, transparent 100%);
      z-index: 10;
    }

    .header h1 {
      font-size: 24px;
      color: #ff6b9d;
      text-shadow: 0 0 20px #ff6b9d40;
      letter-spacing: 4px;
    }

    .header .subtitle {
      color: #666;
      font-size: 12px;
      margin-top: 5px;
    }

    .visualizer-container {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #visualizer {
      width: 100%;
      height: 100%;
    }

    .controls {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
      z-index: 100;
    }

    .btn {
      background: #1a1a2e;
      border: 1px solid #ff6b9d40;
      color: #ff6b9d;
      padding: 12px 24px;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.3s;
      border-radius: 4px;
    }

    .btn:hover {
      background: #ff6b9d20;
      border-color: #ff6b9d;
      box-shadow: 0 0 20px #ff6b9d40;
    }

    .btn.active {
      background: #ff6b9d;
      color: #0a0a0f;
    }

    .info {
      position: fixed;
      top: 80px;
      right: 20px;
      background: #1a1a2e80;
      padding: 15px;
      border: 1px solid #333;
      border-radius: 4px;
      font-size: 12px;
      z-index: 100;
      min-width: 200px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      gap: 20px;
    }

    .info-label { color: #666; }
    .info-value { color: #ff6b9d; }

    .playing-files {
      position: fixed;
      top: 200px;
      right: 20px;
      background: #1a1a2e80;
      padding: 15px;
      border: 1px solid #333;
      border-radius: 4px;
      font-size: 11px;
      z-index: 100;
      min-width: 200px;
      max-height: 300px;
      overflow-y: auto;
    }

    .playing-files h3 {
      color: #6bffb8;
      margin-bottom: 10px;
      font-size: 12px;
    }

    .playing-file {
      color: #ff6b9d;
      margin: 4px 0;
      padding: 4px 8px;
      background: #ff6b9d10;
      border-radius: 3px;
      animation: pulse 0.5s ease-out;
    }

    @keyframes pulse {
      0% { background: #ff6b9d40; }
      100% { background: #ff6b9d10; }
    }

    .wave-decoration {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      color: #333;
      font-size: 20px;
      letter-spacing: 5px;
    }

    .no-audio {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #666;
    }

    .no-audio h2 {
      color: #ff6b9d;
      margin-bottom: 10px;
    }

    .selects {
      position: fixed;
      top: 80px;
      left: 20px;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .selects select {
      background: #1a1a2e;
      border: 1px solid #ff6b9d40;
      color: #ff6b9d;
      padding: 8px 12px;
      font-family: inherit;
      cursor: pointer;
    }

    .source-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 8px 16px;
      background: #6bffb820;
      border: 1px solid #6bffb8;
      border-radius: 4px;
      color: #6bffb8;
      font-size: 12px;
    }

    .source-indicator.mic {
      background: #ff6b9d20;
      border-color: #ff6b9d;
      color: #ff6b9d;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>▁ ▂ ▃ ▄ ▅ ▆ █ KAIOS █ ▆ ▅ ▄ ▃ ▂ ▁</h1>
    <div class="subtitle">∿∿∿ visual intelligence ∿∿∿</div>
  </div>

  <div class="source-indicator" id="sourceIndicator">KAIOS AUDIO BUS</div>

  <div class="selects">
    <select id="sourceSelect">
      <option value="kaios" ${config.source === 'kaios' ? 'selected' : ''}>KAIOS Audio Bus</option>
      <option value="microphone" ${config.source === 'microphone' ? 'selected' : ''}>Microphone</option>
    </select>
    <select id="themeSelect">
      <option value="kaios">KAIOS</option>
      <option value="cyberpunk">Cyberpunk</option>
      <option value="vaporwave">Vaporwave</option>
      <option value="minimal">Minimal</option>
    </select>
  </div>

  <div class="info">
    <div class="info-row">
      <span class="info-label">source</span>
      <span class="info-value" id="sourceDisplay">kaios</span>
    </div>
    <div class="info-row">
      <span class="info-label">activity</span>
      <span class="info-value" id="activityDisplay">0%</span>
    </div>
    <div class="info-row">
      <span class="info-label">emotion</span>
      <span class="info-value" id="emotionDisplay">neutral</span>
    </div>
    <div class="info-row">
      <span class="info-label">base freq</span>
      <span class="info-value">432 Hz</span>
    </div>
  </div>

  <div class="playing-files" id="playingFiles">
    <h3>∿ currently playing</h3>
    <div id="fileList">
      <div style="color: #666">waiting for sound...</div>
    </div>
  </div>

  <div class="visualizer-container">
    <canvas id="visualizer"></canvas>
    <div class="no-audio" id="noAudio" style="display: none;">
      <h2>(◕‿◕)</h2>
      <p>waiting for KAIOS to make sounds...</p>
      <p style="margin-top: 10px; font-size: 11px;">talk to kaios in the terminal</p>
    </div>
  </div>

  <div class="wave-decoration">∿∿∿ ～～～ ≋≋≋ ∾∾∾</div>

  <div class="controls">
    <button class="btn active" id="startBtn">listening</button>
    <button class="btn" id="modeBtn">mode: bars</button>
    <button class="btn" id="screenshotBtn">screenshot</button>
  </div>

  <script>
    // KAIOS Visual Intelligence Engine - Dual Mode
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    const noAudio = document.getElementById('noAudio');
    const activityDisplay = document.getElementById('activityDisplay');
    const emotionDisplay = document.getElementById('emotionDisplay');
    const sourceDisplay = document.getElementById('sourceDisplay');
    const sourceIndicator = document.getElementById('sourceIndicator');
    const themeSelect = document.getElementById('themeSelect');
    const sourceSelect = document.getElementById('sourceSelect');
    const fileList = document.getElementById('fileList');

    let audioContext;
    let analyser;
    let dataArray = new Uint8Array(128);
    let source;
    let isRunning = true;
    let mode = 'bars';
    let audioSource = '${config.source}'; // 'kaios' or 'microphone'
    let eventSource = null;  // SSE connection
    let animationId = null;

    // Theme colors
    const themes = {
      kaios: {
        bg: '#0a0a0f',
        primary: '#ff6b9d',
        secondary: '#6bffb8',
        accent: '#6b9dff',
        gradient: ['#ff6b9d', '#ff9d6b', '#6bffb8']
      },
      cyberpunk: {
        bg: '#0d0221',
        primary: '#ff00ff',
        secondary: '#00ffff',
        accent: '#ffff00',
        gradient: ['#ff00ff', '#00ffff', '#ffff00']
      },
      vaporwave: {
        bg: '#1a0a2e',
        primary: '#ff71ce',
        secondary: '#01cdfe',
        accent: '#05ffa1',
        gradient: ['#ff71ce', '#b967ff', '#01cdfe']
      },
      minimal: {
        bg: '#000000',
        primary: '#ffffff',
        secondary: '#888888',
        accent: '#444444',
        gradient: ['#ffffff', '#888888', '#444444']
      }
    };

    let currentTheme = themes.kaios;

    // Resize canvas to container (not full window - header takes space)
    function resize() {
      const container = document.querySelector('.visualizer-container');
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resize);
    // Delay initial resize to ensure container is laid out
    setTimeout(resize, 50);
    resize();

    // ═══════════════════════════════════════════════════════════════════
    // KAIOS AUDIO BUS MODE (Real-time SSE)
    // ═══════════════════════════════════════════════════════════════════

    function startKaiosMode() {
      audioSource = 'kaios';
      sourceDisplay.textContent = 'kaios (real-time)';
      sourceIndicator.textContent = 'KAIOS AUDIO BUS';
      sourceIndicator.classList.remove('mic');
      document.getElementById('startBtn').textContent = 'connected';
      document.getElementById('startBtn').classList.add('active');
      noAudio.style.display = 'none';
      document.getElementById('playingFiles').style.display = 'block';

      // Close existing connection
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      // Connect via Server-Sent Events for real-time push updates
      eventSource = new EventSource('/api/audiobus/stream');

      eventSource.onmessage = function(event) {
        try {
          const state = JSON.parse(event.data);
          handleAudioBusState(state);
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };

      eventSource.onerror = function() {
        sourceIndicator.textContent = 'RECONNECTING...';
        // EventSource auto-reconnects
      };

      eventSource.onopen = function() {
        sourceIndicator.textContent = 'KAIOS AUDIO BUS';
      };

      isRunning = true;
      animateKaios();
    }

    function stopKaiosMode() {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      isRunning = false;
    }

    function handleAudioBusState(state) {
      // Update frequency data immediately
      if (state.frequencyData && state.frequencyData.length > 0) {
        dataArray = new Uint8Array(state.frequencyData);
      }

      // Update displays
      activityDisplay.textContent = Math.round(state.activity * 100) + '%';
      emotionDisplay.textContent = state.emotionState || 'neutral';

      // Update playing files list
      if (state.currentlyPlaying && state.currentlyPlaying.length > 0) {
        fileList.innerHTML = state.currentlyPlaying.map(s =>
          '<div class="playing-file">' + s.file.split('/').pop() + '</div>'
        ).join('');
        noAudio.style.display = 'none';
      } else {
        // Show recent sounds if nothing currently playing
        if (state.recentSounds && state.recentSounds.length > 0) {
          const recent = state.recentSounds.slice(-5).reverse();
          fileList.innerHTML = recent.map(s => {
            const age = Date.now() - s.timestamp;
            const opacity = Math.max(0.3, 1 - age / 5000);
            return '<div class="playing-file" style="opacity: ' + opacity + '">' +
              s.file.split('/').pop() + '</div>';
          }).join('');
        } else {
          fileList.innerHTML = '<div style="color: #666">waiting for sound...</div>';
        }
      }
    }

    function animateKaios() {
      if (!isRunning || audioSource !== 'kaios') return;
      animationId = requestAnimationFrame(animateKaios);
      drawVisualization();
    }

    // ═══════════════════════════════════════════════════════════════════
    // MICROPHONE MODE
    // ═══════════════════════════════════════════════════════════════════

    async function startMicMode() {
      audioSource = 'microphone';
      sourceDisplay.textContent = 'microphone';
      sourceIndicator.textContent = 'MICROPHONE';
      sourceIndicator.classList.add('mic');
      document.getElementById('playingFiles').style.display = 'none';

      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }

      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = ${config.fftSize};
        analyser.smoothingTimeConstant = ${config.smoothing};

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        noAudio.style.display = 'none';
        isRunning = true;
        animateMic();

        document.getElementById('startBtn').textContent = 'stop';
        document.getElementById('startBtn').classList.add('active');
      } catch (err) {
        console.error('Audio error:', err);
        alert('Could not access microphone. Please allow microphone access.');
      }
    }

    function stopMicMode() {
      if (source) source.disconnect();
      if (audioContext) audioContext.close();
      isRunning = false;
      noAudio.style.display = 'block';
      document.getElementById('startBtn').textContent = 'start microphone';
      document.getElementById('startBtn').classList.remove('active');
    }

    function animateMic() {
      if (!isRunning || audioSource !== 'microphone') return;
      requestAnimationFrame(animateMic);
      analyser.getByteFrequencyData(dataArray);

      // Update displays
      let maxAmp = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxAmp) maxAmp = dataArray[i];
      }
      activityDisplay.textContent = Math.round((maxAmp / 255) * 100) + '%';

      drawVisualization();
    }

    // ═══════════════════════════════════════════════════════════════════
    // ANIMATION (shared drawing code)
    // ═══════════════════════════════════════════════════════════════════

    function drawVisualization() {
      // Clear with theme background
      ctx.fillStyle = currentTheme.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw based on mode
      switch(mode) {
        case 'bars': drawBars(); break;
        case 'wave': drawWave(); break;
        case 'circle': drawCircle(); break;
        case 'particles': drawParticles(); break;
      }
    }

    // Visualization modes
    function drawBars() {
      const barCount = 128;
      const barWidth = canvas.width / barCount;
      const barGap = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * dataArray.length / barCount);
        const value = dataArray[dataIndex] || 0;
        const barHeight = (value / 255) * canvas.height * 0.8;

        const hue = (i / barCount) * 60 + 320;
        ctx.fillStyle = 'hsla(' + hue + ', 80%, 60%, 0.8)';

        const x = i * barWidth;
        const y = canvas.height - barHeight;

        ctx.fillRect(x + barGap/2, y, barWidth - barGap, barHeight);

        // Reflection
        ctx.fillStyle = 'hsla(' + hue + ', 80%, 60%, 0.2)';
        ctx.fillRect(x + barGap/2, canvas.height, barWidth - barGap, barHeight * 0.3);
      }

      // 432Hz marker
      ctx.strokeStyle = currentTheme.secondary + '40';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      const hz432Y = canvas.height * 0.568;
      ctx.beginPath();
      ctx.moveTo(0, hz432Y);
      ctx.lineTo(canvas.width, hz432Y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawWave() {
      ctx.beginPath();
      ctx.strokeStyle = currentTheme.primary;
      ctx.lineWidth = 2;

      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;
      const centerY = canvas.height / 2;
      const time = Date.now() / 1000;

      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] || 0) / 255;
        // For frequency data: 0 = center, higher = more displacement
        // Add sine wave modulation for organic movement
        const wave = Math.sin(time * 2 + i * 0.1) * 0.3;
        const displacement = v * canvas.height * 0.4 * (1 + wave);
        // Alternate above/below center for wave effect
        const direction = Math.sin(i * 0.2 + time * 3);
        const y = centerY + displacement * direction;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
      ctx.shadowBlur = 20;
      ctx.shadowColor = currentTheme.primary;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw center line reference
      ctx.strokeStyle = currentTheme.secondary + '30';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
    }

    function drawCircle() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;
      const time = Date.now() / 1000;

      // Calculate average amplitude for pulsing effect
      const avgAmp = dataArray.reduce((a, b) => a + (b || 0), 0) / dataArray.length / 255;
      const pulseRadius = baseRadius * (1 + avgAmp * 0.3 + Math.sin(time * 2) * 0.05);

      // Draw outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, pulseRadius * 0.5, centerX, centerY, pulseRadius * 2);
      gradient.addColorStop(0, currentTheme.primary + '00');
      gradient.addColorStop(0.5, currentTheme.primary + '10');
      gradient.addColorStop(1, currentTheme.primary + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars radiating from center
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] || 0;
        const angle = (i / dataArray.length) * Math.PI * 2 - Math.PI / 2;
        const barLength = (value / 255) * baseRadius * 1.5;

        const x1 = centerX + Math.cos(angle) * pulseRadius;
        const y1 = centerY + Math.sin(angle) * pulseRadius;
        const x2 = centerX + Math.cos(angle) * (pulseRadius + barLength);
        const y2 = centerY + Math.sin(angle) * (pulseRadius + barLength);

        const hue = (i / dataArray.length) * 60 + 320;
        const alpha = 0.4 + (value / 255) * 0.6;
        ctx.strokeStyle = 'hsla(' + hue + ', 80%, 60%, ' + alpha + ')';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw inner circle with breathing effect
      const innerRadius = pulseRadius * 0.4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = currentTheme.bg;
      ctx.fill();

      // Inner ring
      ctx.strokeStyle = currentTheme.primary + '80';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Kaomoji face
      ctx.fillStyle = currentTheme.primary;
      ctx.font = Math.round(innerRadius * 0.6) + 'px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('(◕‿◕)', centerX, centerY);

      // Outer ring pulse
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = currentTheme.secondary + '40';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    let particles = [];
    function drawParticles() {
      const avgAmp = dataArray.reduce((a, b) => a + (b || 0), 0) / dataArray.length;

      if (avgAmp > 30) {
        for (let i = 0; i < avgAmp / 20; i++) {
          particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * (avgAmp / 10),
            vy: (Math.random() - 0.5) * (avgAmp / 10),
            life: 1,
            hue: Math.random() * 60 + 320
          });
        }
      }

      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 60%, ' + p.life + ')';
          ctx.fill();
          return true;
        }
        return false;
      });

      if (particles.length > 500) particles = particles.slice(-500);
    }

    // ═══════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════

    document.getElementById('startBtn').addEventListener('click', () => {
      if (audioSource === 'microphone') {
        if (isRunning) stopMicMode();
        else startMicMode();
      }
    });

    sourceSelect.addEventListener('change', (e) => {
      const newSource = e.target.value;
      if (newSource === 'kaios') {
        if (audioSource === 'microphone') stopMicMode();
        startKaiosMode();
      } else {
        stopKaiosMode();
        startMicMode();
      }
    });

    document.getElementById('modeBtn').addEventListener('click', () => {
      const modes = ['bars', 'wave', 'circle', 'particles'];
      const currentIndex = modes.indexOf(mode);
      mode = modes[(currentIndex + 1) % modes.length];
      document.getElementById('modeBtn').textContent = 'mode: ' + mode;
    });

    document.getElementById('screenshotBtn').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'kaios-visual-' + Date.now() + '.png';
      link.href = canvas.toDataURL();
      link.click();
    });

    themeSelect.addEventListener('change', (e) => {
      currentTheme = themes[e.target.value];
      document.body.style.background = currentTheme.bg;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        document.getElementById('startBtn').click();
      } else if (e.key === 'm') {
        document.getElementById('modeBtn').click();
      } else if (e.key === 's') {
        document.getElementById('screenshotBtn').click();
      }
    });

    // Start in the configured mode
    if (audioSource === 'kaios') {
      startKaiosMode();
    } else {
      // Don't auto-start mic mode for privacy
      noAudio.innerHTML = '<h2>(◕‿◕)</h2><p>click "start microphone" to visualize</p>';
      noAudio.style.display = 'block';
    }
  </script>
</body>
</html>
`;

// ════════════════════════════════════════════════════════════════════════════════
// VISUALIZER MANAGER
// ════════════════════════════════════════════════════════════════════════════════

export class VisualizerManager {
  private config: VisualizerConfig
  private server: Server | null = null
  private browserProcess: ChildProcess | null = null
  private isRunning = false

  constructor(config: Partial<VisualizerConfig> = {}) {
    this.config = {
      port: 3333,
      width: 1200,
      height: 800,
      theme: 'kaios',
      mode: 'bars',
      source: 'kaios',  // Default to KAIOS audio bus
      fftSize: 2048,
      smoothing: 0.8,
      ...config
    }
  }

  /**
   * Start the visualizer server and open browser
   */
  async start(): Promise<VisualizerState> {
    if (this.isRunning) {
      return this.getState()
    }

    const html = generateVisualizerHTML(this.config)

    // Track SSE clients for cleanup
    const sseClients: Set<ServerResponse> = new Set()

    return new Promise((resolve, reject) => {
      this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
        // SSE endpoint for real-time audio bus updates (60fps push)
        if (req.url === '/api/audiobus/stream') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          })

          // Send initial state
          const audioBus = getAudioBus()
          res.write(`data: ${JSON.stringify(audioBus.getState())}\n\n`)

          // Listen for state changes and push to client
          const onStateChange = (state: any) => {
            try {
              res.write(`data: ${JSON.stringify(state)}\n\n`)
            } catch {
              // Client disconnected
              sseClients.delete(res)
              audioBus.removeListener('stateChange', onStateChange)
            }
          }

          audioBus.on('stateChange', onStateChange)
          sseClients.add(res)

          // Cleanup on disconnect
          req.on('close', () => {
            sseClients.delete(res)
            audioBus.removeListener('stateChange', onStateChange)
          })

          return
        }

        // Legacy polling endpoint (fallback)
        if (req.url === '/api/audiobus') {
          const audioBus = getAudioBus()
          const state = audioBus.getState()
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
          res.end(JSON.stringify(state))
          return
        }

        // Serve visualizer HTML
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
      })

      this.server.listen(this.config.port, () => {
        this.isRunning = true
        const url = `http://localhost:${this.config.port}`

        // Open in default browser
        const openCmd = process.platform === 'darwin' ? 'open' :
                       process.platform === 'win32' ? 'start' : 'xdg-open'

        this.browserProcess = spawn(openCmd, [url], {
          stdio: 'ignore',
          detached: true
        })
        this.browserProcess.unref()

        resolve(this.getState())
      })

      this.server.on('error', (err) => {
        reject(err)
      })
    })
  }

  /**
   * Stop the visualizer
   */
  stop(): void {
    if (this.server) {
      this.server.close()
      this.server = null
    }
    this.isRunning = false
  }

  /**
   * Get current state
   */
  getState(): VisualizerState {
    return {
      isRunning: this.isRunning,
      port: this.config.port,
      url: `http://localhost:${this.config.port}`,
      theme: this.config.theme,
      mode: this.config.mode,
      source: this.config.source
    }
  }

  /**
   * Set the audio source
   */
  setSource(source: VisualizerConfig['source']): void {
    this.config.source = source
  }

  /**
   * Set the visualizer theme
   */
  setTheme(theme: VisualizerConfig['theme']): void {
    this.config.theme = theme
  }

  /**
   * Set the visualizer mode
   */
  setMode(mode: VisualizerConfig['mode']): void {
    this.config.mode = mode
  }

  /**
   * Generate HTML and save to temp file, return path
   */
  async generateHTML(): Promise<string> {
    const html = generateVisualizerHTML(this.config)
    const path = join(process.cwd(), 'kaios-visualizer.html')
    writeFileSync(path, html)
    return path
  }

  /**
   * Save visualizer HTML to file
   */
  saveToFile(outputPath?: string): string {
    const html = generateVisualizerHTML(this.config)
    const path = outputPath || join(process.cwd(), 'kaios-visualizer.html')
    writeFileSync(path, html)
    return path
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createVisualizer(config?: Partial<VisualizerConfig>): VisualizerManager {
  return new VisualizerManager(config)
}
