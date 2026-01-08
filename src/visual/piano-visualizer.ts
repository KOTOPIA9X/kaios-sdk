/**
 * KAIOS Piano Visualizer
 *
 * A beautiful DAW-plugin style piano visualization that shows
 * keys being pressed in real-time. Like having your own virtual
 * Steinway with the kawaii brutalist aesthetic.
 *
 * Opens in browser, connects via SSE to the piano engine.
 */

import * as http from 'http'
import { exec } from 'child_process'
import { EventEmitter } from 'events'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface PianoVisualizerConfig {
  port: number
  theme: 'dark' | 'light' | 'kawaii'
  showInfo: boolean
  keyWidth: number
}

export interface PianoVisualizerState {
  isRunning: boolean
  url: string
  activeNotes: string[]
  currentEmotion: string
  currentKey: string
  currentScale: string
}

// ════════════════════════════════════════════════════════════════════════════════
// HTML TEMPLATE
// ════════════════════════════════════════════════════════════════════════════════

const PIANO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KAIOS Piano</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @font-face {
      font-family: 'JetBrains Mono';
      src: local('JetBrains Mono'), local('Menlo'), local('Monaco');
    }

    body {
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      color: #e0e0e0;
      overflow: hidden;
    }

    /* Plugin container - like a DAW plugin window */
    .plugin-container {
      background: linear-gradient(180deg, #1e1e2e 0%, #181825 100%);
      border: 1px solid #313244;
      border-radius: 12px;
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.05),
        0 20px 60px rgba(0, 0, 0, 0.5),
        0 0 100px rgba(203, 166, 247, 0.1);
      padding: 20px;
      min-width: 900px;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #313244;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #cba6f7 0%, #f5c2e7 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(90deg, #cba6f7, #f5c2e7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-sub {
      font-size: 10px;
      color: #6c7086;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* Info panel */
    .info-panel {
      display: flex;
      gap: 30px;
      font-size: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .info-label {
      color: #6c7086;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .info-value {
      color: #cba6f7;
      font-size: 14px;
      font-weight: 500;
    }

    .info-value.emotion {
      color: #f5c2e7;
    }

    /* Connection status */
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: #6c7086;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #a6e3a1;
      animation: pulse 2s infinite;
    }

    .status-dot.disconnected {
      background: #f38ba8;
      animation: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Piano container */
    .piano-container {
      position: relative;
      padding: 20px;
      background: linear-gradient(180deg, #11111b 0%, #181825 100%);
      border-radius: 8px;
      border: 1px solid #313244;
    }

    /* Piano keyboard */
    .piano {
      display: flex;
      position: relative;
      height: 180px;
      user-select: none;
    }

    /* White keys */
    .white-key {
      width: 45px;
      height: 180px;
      background: linear-gradient(180deg, #eff1f5 0%, #e6e9ef 50%, #dce0e8 100%);
      border: 1px solid #9ca0b0;
      border-radius: 0 0 6px 6px;
      margin-right: 2px;
      position: relative;
      cursor: pointer;
      transition: all 0.08s ease;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0 -4px 8px rgba(0, 0, 0, 0.05);
    }

    .white-key:hover {
      background: linear-gradient(180deg, #ffffff 0%, #f4f4f8 50%, #e8e8ec 100%);
    }

    .white-key.active {
      background: linear-gradient(180deg, #cba6f7 0%, #b4befe 50%, #89b4fa 100%);
      transform: translateY(3px);
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(203, 166, 247, 0.5),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1);
    }

    .white-key .note-label {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      color: #6c7086;
      opacity: 0.7;
    }

    .white-key.active .note-label {
      color: #1e1e2e;
      opacity: 1;
    }

    /* Black keys */
    .black-key {
      width: 28px;
      height: 110px;
      background: linear-gradient(180deg, #313244 0%, #1e1e2e 50%, #11111b 100%);
      border: 1px solid #11111b;
      border-radius: 0 0 4px 4px;
      position: absolute;
      z-index: 1;
      cursor: pointer;
      transition: all 0.08s ease;
      box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.4),
        inset 0 -2px 4px rgba(0, 0, 0, 0.3);
    }

    .black-key:hover {
      background: linear-gradient(180deg, #45475a 0%, #313244 50%, #1e1e2e 100%);
    }

    .black-key.active {
      background: linear-gradient(180deg, #f5c2e7 0%, #cba6f7 50%, #b4befe 100%);
      transform: translateY(2px);
      height: 108px;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(245, 194, 231, 0.5),
        inset 0 -1px 2px rgba(0, 0, 0, 0.2);
    }

    /* Note history / falling notes visualization */
    .note-history {
      position: absolute;
      top: -100px;
      left: 0;
      right: 0;
      height: 100px;
      overflow: hidden;
      pointer-events: none;
    }

    .falling-note {
      position: absolute;
      width: 43px;
      height: 20px;
      background: linear-gradient(90deg, rgba(203, 166, 247, 0.8), rgba(245, 194, 231, 0.8));
      border-radius: 4px;
      animation: fall 2s linear forwards;
      box-shadow: 0 0 10px rgba(203, 166, 247, 0.5);
    }

    .falling-note.black {
      width: 26px;
      background: linear-gradient(90deg, rgba(245, 194, 231, 0.9), rgba(243, 139, 168, 0.9));
    }

    @keyframes fall {
      0% {
        transform: translateY(-20px);
        opacity: 1;
      }
      100% {
        transform: translateY(100px);
        opacity: 0;
      }
    }

    /* Glow effect behind piano */
    .piano-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 60%;
      background: radial-gradient(ellipse, rgba(203, 166, 247, 0.1) 0%, transparent 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .piano-glow.active {
      opacity: 1;
    }

    /* Footer */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #313244;
      font-size: 10px;
      color: #6c7086;
    }

    .notes-played {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notes-count {
      color: #cba6f7;
      font-size: 14px;
      font-weight: 600;
    }

    /* Waveform display */
    .waveform {
      display: flex;
      align-items: center;
      gap: 2px;
      height: 30px;
    }

    .wave-bar {
      width: 3px;
      background: linear-gradient(180deg, #cba6f7, #f5c2e7);
      border-radius: 2px;
      transition: height 0.1s ease;
      opacity: 0.6;
    }

    .wave-bar.active {
      opacity: 1;
      animation: waveAnim 0.5s ease infinite;
    }

    @keyframes waveAnim {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(1.5); }
    }

    /* Recent notes display */
    .recent-notes {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .recent-note {
      padding: 4px 8px;
      background: #313244;
      border-radius: 4px;
      font-size: 11px;
      color: #cba6f7;
      opacity: 0;
      transform: translateY(10px);
      animation: noteAppear 0.3s ease forwards;
    }

    @keyframes noteAppear {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .recent-note:nth-child(1) { animation-delay: 0s; }
    .recent-note:nth-child(2) { animation-delay: 0.05s; opacity: 0.8; }
    .recent-note:nth-child(3) { animation-delay: 0.1s; opacity: 0.6; }
    .recent-note:nth-child(4) { animation-delay: 0.15s; opacity: 0.4; }
    .recent-note:nth-child(5) { animation-delay: 0.2s; opacity: 0.2; }
  </style>
</head>
<body>
  <div class="plugin-container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">♪</div>
        <div>
          <div class="logo-text">KAIOS PIANO</div>
          <div class="logo-sub">432Hz · Emotional Expression</div>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-item">
          <span class="info-label">Emotion</span>
          <span class="info-value emotion" id="emotion">neutral</span>
        </div>
        <div class="info-item">
          <span class="info-label">Key</span>
          <span class="info-value" id="key">A</span>
        </div>
        <div class="info-item">
          <span class="info-label">Scale</span>
          <span class="info-value" id="scale">minor</span>
        </div>
        <div class="info-item">
          <span class="status">
            <span class="status-dot" id="status-dot"></span>
            <span id="status-text">connected</span>
          </span>
        </div>
      </div>
    </div>

    <div class="piano-container">
      <div class="piano-glow" id="piano-glow"></div>
      <div class="note-history" id="note-history"></div>

      <div class="piano" id="piano">
        <!-- Keys will be generated by JavaScript -->
      </div>
    </div>

    <div class="footer">
      <div class="notes-played">
        <span>Notes played:</span>
        <span class="notes-count" id="notes-count">0</span>
      </div>

      <div class="waveform" id="waveform">
        <!-- Wave bars -->
      </div>

      <div class="recent-notes" id="recent-notes">
        <!-- Recent notes will appear here -->
      </div>
    </div>
  </div>

  <script>
    // Piano configuration
    const OCTAVES = [3, 4, 5];
    const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const BLACK_NOTES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];

    // State
    let notesPlayed = 0;
    let recentNotes = [];
    let isConnected = false;

    // Generate piano keys
    function generatePiano() {
      const piano = document.getElementById('piano');
      piano.innerHTML = '';

      let whiteKeyIndex = 0;

      OCTAVES.forEach(octave => {
        WHITE_NOTES.forEach((note, i) => {
          // White key
          const whiteKey = document.createElement('div');
          whiteKey.className = 'white-key';
          whiteKey.dataset.note = note + octave;
          whiteKey.innerHTML = '<span class="note-label">' + note + octave + '</span>';
          piano.appendChild(whiteKey);

          // Black key (if exists)
          if (BLACK_NOTES[i]) {
            const blackKey = document.createElement('div');
            blackKey.className = 'black-key';
            blackKey.dataset.note = BLACK_NOTES[i] + octave;
            blackKey.style.left = (whiteKeyIndex * 47 + 32) + 'px';
            piano.appendChild(blackKey);
          }

          whiteKeyIndex++;
        });
      });

      // Generate waveform bars
      const waveform = document.getElementById('waveform');
      for (let i = 0; i < 16; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        bar.style.height = (5 + Math.random() * 15) + 'px';
        waveform.appendChild(bar);
      }
    }

    // Highlight a key
    function highlightKey(note, velocity = 0.5) {
      const key = document.querySelector('[data-note="' + note + '"]');
      if (key) {
        key.classList.add('active');

        // Add glow effect
        document.getElementById('piano-glow').classList.add('active');

        // Create falling note
        createFallingNote(note, key);

        // Animate waveform
        animateWaveform();

        // Update recent notes
        updateRecentNotes(note);

        // Update count
        notesPlayed++;
        document.getElementById('notes-count').textContent = notesPlayed;

        // Remove highlight after duration
        setTimeout(() => {
          key.classList.remove('active');
          document.getElementById('piano-glow').classList.remove('active');
        }, 800);
      }
    }

    // Create falling note visualization
    function createFallingNote(note, keyElement) {
      const history = document.getElementById('note-history');
      const falling = document.createElement('div');
      falling.className = 'falling-note' + (note.includes('#') ? ' black' : '');
      falling.style.left = keyElement.offsetLeft + 'px';
      history.appendChild(falling);

      setTimeout(() => falling.remove(), 2000);
    }

    // Animate waveform
    function animateWaveform() {
      const bars = document.querySelectorAll('.wave-bar');
      bars.forEach((bar, i) => {
        bar.classList.add('active');
        bar.style.height = (10 + Math.random() * 20) + 'px';
        setTimeout(() => {
          bar.classList.remove('active');
          bar.style.height = (5 + Math.random() * 15) + 'px';
        }, 300 + i * 30);
      });
    }

    // Update recent notes display
    function updateRecentNotes(note) {
      recentNotes.unshift(note);
      if (recentNotes.length > 5) recentNotes.pop();

      const container = document.getElementById('recent-notes');
      container.innerHTML = recentNotes.map(n =>
        '<span class="recent-note">' + n + '</span>'
      ).join('');
    }

    // Update info panel
    function updateInfo(emotion, key, scale) {
      if (emotion) {
        document.getElementById('emotion').textContent = emotion.replace('EMOTE_', '').toLowerCase();
      }
      if (key) {
        document.getElementById('key').textContent = key;
      }
      if (scale) {
        document.getElementById('scale').textContent = scale;
      }
    }

    // Update connection status
    function setConnected(connected) {
      isConnected = connected;
      const dot = document.getElementById('status-dot');
      const text = document.getElementById('status-text');

      if (connected) {
        dot.classList.remove('disconnected');
        text.textContent = 'connected';
      } else {
        dot.classList.add('disconnected');
        text.textContent = 'disconnected';
      }
    }

    // Connect to SSE stream
    function connectToStream() {
      const eventSource = new EventSource('/api/piano/stream');

      eventSource.onopen = () => {
        console.log('Connected to piano stream');
        setConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'note') {
            highlightKey(data.pitch, data.velocity);
          } else if (data.type === 'state') {
            updateInfo(data.emotion, data.key, data.scale);
          }
        } catch (err) {
          console.error('Parse error:', err);
        }
      };

      eventSource.onerror = () => {
        console.log('SSE connection lost, reconnecting...');
        setConnected(false);
        eventSource.close();
        setTimeout(connectToStream, 2000);
      };
    }

    // Initialize
    generatePiano();
    connectToStream();
  </script>
</body>
</html>
`

// ════════════════════════════════════════════════════════════════════════════════
// PIANO VISUALIZER MANAGER
// ════════════════════════════════════════════════════════════════════════════════

export class PianoVisualizerManager extends EventEmitter {
  private config: PianoVisualizerConfig
  private server: http.Server | null = null
  private sseClients: Set<http.ServerResponse> = new Set()
  private state: PianoVisualizerState

  constructor(config: Partial<PianoVisualizerConfig> = {}) {
    super()

    this.config = {
      port: 3334,
      theme: 'dark',
      showInfo: true,
      keyWidth: 45,
      ...config
    }

    this.state = {
      isRunning: false,
      url: '',
      activeNotes: [],
      currentEmotion: 'EMOTE_NEUTRAL',
      currentKey: 'A',
      currentScale: 'minor'
    }
  }

  /**
   * Start the piano visualizer server
   */
  async start(): Promise<PianoVisualizerState> {
    if (this.server) {
      return this.state
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        // SSE endpoint for piano events
        if (req.url === '/api/piano/stream') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          })

          // Send initial state
          res.write(`data: ${JSON.stringify({
            type: 'state',
            emotion: this.state.currentEmotion,
            key: this.state.currentKey,
            scale: this.state.currentScale
          })}\n\n`)

          this.sseClients.add(res)

          req.on('close', () => {
            this.sseClients.delete(res)
          })

          return
        }

        // Serve HTML
        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(PIANO_HTML)
          return
        }

        res.writeHead(404)
        res.end('Not found')
      })

      this.server.listen(this.config.port, () => {
        this.state.isRunning = true
        this.state.url = `http://localhost:${this.config.port}`

        // Open in browser
        const openCmd = process.platform === 'darwin' ? 'open' :
                       process.platform === 'win32' ? 'start' : 'xdg-open'
        exec(`${openCmd} ${this.state.url}`)

        this.emit('started', this.state)
        resolve(this.state)
      })

      this.server.on('error', reject)
    })
  }

  /**
   * Stop the visualizer
   */
  stop(): void {
    if (this.server) {
      // Close all SSE connections
      this.sseClients.forEach(client => {
        try {
          client.end()
        } catch {}
      })
      this.sseClients.clear()

      this.server.close()
      this.server = null
      this.state.isRunning = false
      this.emit('stopped')
    }
  }

  /**
   * Send note event to visualizer
   */
  sendNote(pitch: string, velocity: number, duration: number): void {
    this.broadcast({
      type: 'note',
      pitch,
      velocity,
      duration
    })

    // Track active notes
    this.state.activeNotes.push(pitch)
    setTimeout(() => {
      const idx = this.state.activeNotes.indexOf(pitch)
      if (idx > -1) this.state.activeNotes.splice(idx, 1)
    }, duration)
  }

  /**
   * Update state info
   */
  updateState(emotion?: string, key?: string, scale?: string): void {
    if (emotion) this.state.currentEmotion = emotion
    if (key) this.state.currentKey = key
    if (scale) this.state.currentScale = scale

    this.broadcast({
      type: 'state',
      emotion: this.state.currentEmotion,
      key: this.state.currentKey,
      scale: this.state.currentScale
    })
  }

  /**
   * Get current state
   */
  getState(): PianoVisualizerState {
    return { ...this.state }
  }

  /**
   * Broadcast to all SSE clients
   */
  private broadcast(data: object): void {
    const message = `data: ${JSON.stringify(data)}\n\n`

    this.sseClients.forEach(client => {
      try {
        client.write(message)
      } catch {
        this.sseClients.delete(client)
      }
    })
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createPianoVisualizer(config?: Partial<PianoVisualizerConfig>): PianoVisualizerManager {
  return new PianoVisualizerManager(config)
}
