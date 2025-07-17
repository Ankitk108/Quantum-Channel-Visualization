class QuantumChannelVisualizer {
  constructor() {
    this.blochVectors = [];
    this.transformedVectors = [];
    this.currentChannel = 'bit';
    this.currentP = 0.1;
    this.currentGamma = 0.5;
    this.vectorCount = 1000;
    this.animationSpeed = 1.0;
    this.colorScheme = 'default';
    this.showTrails = true;
    this.showSphere = false;
    this.animateTransition = true;
    this.isAnimating = false;
    
    this.colorSchemes = {
      default: {
        original: 'rgba(0, 212, 255, 0.6)',
        transformed: 'rgba(255, 0, 255, 0.6)',
        trail: 'rgba(255, 255, 0, 0.3)'
      },
      quantum: {
        original: 'rgba(0, 255, 136, 0.6)',
        transformed: 'rgba(255, 68, 68, 0.6)',
        trail: 'rgba(255, 255, 255, 0.3)'
      },
      thermal: {
        original: 'rgba(255, 165, 0, 0.6)',
        transformed: 'rgba(255, 69, 0, 0.6)',
        trail: 'rgba(255, 255, 0, 0.3)'
      },
      neon: {
        original: 'rgba(57, 255, 20, 0.6)',
        transformed: 'rgba(255, 20, 147, 0.6)',
        trail: 'rgba(0, 255, 255, 0.3)'
      }
    };
    
    this.init();
  }

  init() {
    this.generateVectors();
    this.bindEvents();
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      this.updatePlot();
    }, 100);
  }

  generateVectors(num = this.vectorCount) {
    this.blochVectors = [];
    for (let i = 0; i < num; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      this.blochVectors.push([x, y, z]);
    }
  }

  applyChannel(vector, p, gamma, channel) {
    const [x, y, z] = vector;
    const noiseGroup = document.getElementById("noise-group")
    const gammaGroup = document.getElementById("gamma-group")
    
    switch (channel) {
      case 'bit':
        noiseGroup.style.display = 'block'
        gammaGroup.style.display = 'none'
        return [x, (1 - 2 * p) * y, (1 - 2 * p) * z];
      
      case 'phase':
        noiseGroup.style.display = 'block'
        gammaGroup.style.display = 'none'
        return [(1 - 2 * p) * x, (1 - 2 * p) * y, z];

      case 'bit-phase':
        noiseGroup.style.display = 'block'
        gammaGroup.style.display = 'none'
        return [(1 - 2 * p) * x, y, (1 - 2 * p) * z];
      
      case 'depol':
        noiseGroup.style.display = 'block'
        gammaGroup.style.display = 'none'
        const s = 1 - (4 * p) / 3;
        return [s * x, s * y, s * z];
      
      case 'amplitude':
        noiseGroup.style.display = 'none'
        gammaGroup.style.display = 'block'
        const sqrtGamma = Math.sqrt(gamma);
        const newZ = (1 - gamma) * z + gamma;
        const shrinkFactor = Math.sqrt(1 - gamma);
        return [shrinkFactor * x, shrinkFactor * y, newZ];
      
      case 'phase-damping':
        noiseGroup.style.display = 'none'
        gammaGroup.style.display = 'block'
        const expGamma = Math.exp(-gamma);
        return [expGamma * x, expGamma * y, z];
      
      default:
        noiseGroup.style.display = 'block'
        gammaGroup.style.display = 'none'
        return [x, y, z];
    }
  }

  calculateStats() {
    if (this.blochVectors.length === 0 || this.transformedVectors.length === 0) {
      return { fidelity: 1.0, avgDistance: 0.0, volumeRatio: 1.0 };
    }

    let totalDistance = 0;
    let originalVolume = 0;
    let transformedVolume = 0;

    for (let i = 0; i < this.blochVectors.length; i++) {
      const orig = this.blochVectors[i];
      const trans = this.transformedVectors[i];
      
      const distance = Math.sqrt(
        Math.pow(orig[0] - trans[0], 2) + 
        Math.pow(orig[1] - trans[1], 2) + 
        Math.pow(orig[2] - trans[2], 2)
      );
      totalDistance += distance;
      
      originalVolume += Math.sqrt(orig[0] * orig[0] + orig[1] * orig[1] + orig[2] * orig[2]);
      transformedVolume += Math.sqrt(trans[0] * trans[0] + trans[1] * trans[1] + trans[2] * trans[2]);
    }

    const avgDistance = totalDistance / this.blochVectors.length;
    const fidelity = Math.max(0, 1 - avgDistance / 2);
    const volumeRatio = originalVolume > 0 ? transformedVolume / originalVolume : 1.0;

    return {
      fidelity: fidelity.toFixed(3),
      avgDistance: avgDistance.toFixed(3),
      volumeRatio: volumeRatio.toFixed(3)
    };
  }

  updateStats() {
    const stats = this.calculateStats();
    document.getElementById('fidelity').textContent = stats.fidelity;
    document.getElementById('avgDistance').textContent = stats.avgDistance;
    document.getElementById('volumeRatio').textContent = stats.volumeRatio;
  }

  createSphereTrace() {
    const phi = [];
    const theta = [];
    const x = [];
    const y = [];
    const z = [];

    for (let i = 0; i <= 20; i++) {
      for (let j = 0; j <= 20; j++) {
        const phiVal = (i / 20) * Math.PI * 2;
        const thetaVal = (j / 20) * Math.PI;
        
        phi.push(phiVal);
        theta.push(thetaVal);
        
        x.push(Math.sin(thetaVal) * Math.cos(phiVal));
        y.push(Math.sin(thetaVal) * Math.sin(phiVal));
        z.push(Math.cos(thetaVal));
      }
    }

    return {
      x: x,
      y: y,
      z: z,
      type: 'scatter3d',
      mode: 'markers',
      marker: {
        size: 1,
        color: 'rgba(255, 255, 255, 0.1)',
        symbol: 'circle'
      },
      name: 'Bloch Sphere',
      hoverinfo: 'skip',
      showlegend: false
    };
  }

  createTrailTraces() {
    if (!this.showTrails) return [];

    const trails = [];
    const trailLength = Math.min(20, this.blochVectors.length);
    
    for (let i = 0; i < trailLength; i++) {
      const orig = this.blochVectors[i];
      const trans = this.transformedVectors[i];
      
      trails.push({
        x: [orig[0], trans[0]],
        y: [orig[1], trans[1]],
        z: [orig[2], trans[2]],
        type: 'scatter3d',
        mode: 'lines',
        line: {
          color: this.colorSchemes[this.colorScheme].trail,
          width: 2
        },
        showlegend: false,
        hoverinfo: 'skip'
      });
    }
    
    return trails;
  }

  async updatePlot() {
    this.transformedVectors = this.blochVectors.map(v => 
      this.applyChannel(v, this.currentP, this.currentGamma, this.currentChannel)
    );

    const traces = [];

    // Add sphere if enabled
    if (this.showSphere) {
      traces.push(this.createSphereTrace());
    }

    // Add trail traces
    traces.push(...this.createTrailTraces());

    // Original vectors
    traces.push({
      x: this.blochVectors.map(v => v[0]),
      y: this.blochVectors.map(v => v[1]),
      z: this.blochVectors.map(v => v[2]),
      mode: 'markers',
      type: 'scatter3d',
      name: 'Original States',
      marker: {
        size: 3,
        color: this.colorSchemes[this.colorScheme].original,
        symbol: 'circle'
      },
      hovertemplate: 'Original<br>x: %{x:.3f}<br>y: %{y:.3f}<br>z: %{z:.3f}<extra></extra>'
    });

    // Transformed vectors
    traces.push({
      x: this.transformedVectors.map(v => v[0]),
      y: this.transformedVectors.map(v => v[1]),
      z: this.transformedVectors.map(v => v[2]),
      mode: 'markers',
      type: 'scatter3d',
      name: 'Transformed States',
      marker: {
        size: 3,
        color: this.colorSchemes[this.colorScheme].transformed,
        symbol: 'diamond'
      },
      hovertemplate: 'Transformed<br>x: %{x:.3f}<br>y: %{y:.3f}<br>z: %{z:.3f}<extra></extra>'
    });

    const layout = {
      scene: {
        xaxis: { 
          range: [-1.2, 1.2], 
          title: 'X',
          backgroundcolor: 'rgba(0, 0, 0, 0)',
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'rgba(255,255,255,0.3)'
        },
        yaxis: { 
          range: [-1.2, 1.2], 
          title: 'Y',
          backgroundcolor: 'rgba(0,0,0,0)',
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'rgba(255,255,255,0.3)'
        },
        zaxis: { 
          range: [-1.2, 1.2], 
          title: 'Z',
          backgroundcolor: 'rgba(0,0,0,0)',
          gridcolor: 'rgba(255,255,255,0.1)',
          zerolinecolor: 'rgba(255,255,255,0.3)'
        },
        aspectmode: 'cube',
        bgcolor: 'rgba(0, 0, 0, 0)',
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 }
        }
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: 'white' },
      margin: { t: 0, b: 0, l: 0, r: 0 },
      showlegend: true,
      legend: {
        x: 0,
        y: 1,
        bgcolor: 'rgba(0,0,0,0.7)',
        bordercolor: 'rgba(255,255,255,0.2)',
        borderwidth: 1
      },
      autosize: true
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };

    try {
      if (this.animateTransition && !this.isAnimating) {
        this.isAnimating = true;
        await Plotly.newPlot('plot', traces, layout, config);
        this.isAnimating = false;
      } else {
        await Plotly.newPlot('plot', traces, layout, config);
      }
      
      // Force a resize to ensure proper display
      setTimeout(() => {
        Plotly.Plots.resize('plot');
      }, 100);
      
    } catch (error) {
      console.error('Error updating plot:', error);
    }

    this.updateStats();
  }

  bindEvents() {
    // Channel selection
    document.getElementById('channel').addEventListener('change', (e) => {
      this.currentChannel = e.target.value;
      this.updatePlot();
    });

    // Noise probability slider
    document.getElementById('p').addEventListener('input', (e) => {
      this.currentP = parseFloat(e.target.value);
      document.getElementById('pval').textContent = this.currentP.toFixed(3);
      this.updatePlot();
    });

    // Noise probability input
    document.getElementById('pval').addEventListener('input', (e) => {
      const newVal = parseFloat(e.target.textContent);

      if (!isNaN(newVal) && newVal >= 0 && newVal <= 1) {
        this.currentP = newVal;
        document.getElementById('p').value = newVal;
        this.updatePlot();
      }
    });


    // Gamma parameter slider
    document.getElementById('gamma').addEventListener('input', (e) => {
      this.currentGamma = parseFloat(e.target.value);
      document.getElementById('gammaval').textContent = this.currentGamma.toFixed(3);
      this.updatePlot();
    });

    // Gamma parameter input
    document.getElementById('gammaval').addEventListener('input', (e) => {
      const newVal = parseFloat(e.target.textContent);

      if (!isNaN(newVal) && newVal >= 0 && newVal <= 1) {
        this.currentP = newVal;
        document.getElementById('gamma').value = newVal;
        this.updatePlot();
      }
    });

    // Vector count input
    document.getElementById('vectorCount').addEventListener('input', (e) => {
      this.vectorCount = parseInt(e.target.value);
      document.getElementById('vectorCountVal').textContent = this.vectorCount;
      this.generateVectors();
      this.updatePlot();
    });

    // Gamma parameter input
    document.getElementById('vectorCountVal').addEventListener('input', (e) => {
      const newVal = parseFloat(e.target.textContent);

      if (!isNaN(newVal) && newVal >= 1 && newVal <= 5000) {
        this.currentP = newVal;
        document.getElementById('vectorCount').value = newVal;
        this.updatePlot();
      }
    });
    // Animation speed
    document.getElementById('animationSpeed').addEventListener('input', (e) => {
      this.animationSpeed = parseFloat(e.target.value);
      document.getElementById('animSpeedVal').textContent = this.animationSpeed.toFixed(1) + 'x';
    });

    // Color scheme
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.colorScheme = e.target.dataset.scheme;
        this.updatePlot();
      });
    });

    // Checkboxes
    document.getElementById('showstats').addEventListener('change', (e) => {
      document.querySelector('.stats-panel').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('showTrails').addEventListener('change', (e) => {
      this.showTrails = e.target.checked;
      this.updatePlot();
    });

    document.getElementById('showSphere').addEventListener('change', (e) => {
      this.showSphere = e.target.checked;
      this.updatePlot();
    });

    document.getElementById('animateTransition').addEventListener('change', (e) => {
      this.animateTransition = e.target.checked;
    });

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.dataset.preset;
        this.applyPreset(preset);
      });
    });

    // Action buttons
    document.getElementById('regenerate').addEventListener('click', () => {
      this.generateVectors();
      this.updatePlot();
    });

    document.getElementById('reset').addEventListener('click', () => {
      this.resetToDefault();
    });

    document.getElementById('export').addEventListener('click', () => {
      this.exportPlot();
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      setTimeout(() => {
        Plotly.Plots.resize('plot');
      }, 100);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        this.generateVectors();
        this.updatePlot();
      } else if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault();
        this.exportPlot();
      }
    });
  }

  applyPreset(preset) {
    const presets = {
      minimal: { p: 0.05, gamma: 0.1, channel: 'bit' },
      moderate: { p: 0.25, gamma: 0.4, channel: 'depol' },
      strong: { p: 0.5, gamma: 0.7, channel: 'amplitude' },
      extreme: { p: 0.8, gamma: 0.9, channel: 'depol' }
    };

    if (presets[preset]) {
      const config = presets[preset];
      this.currentP = config.p;
      this.currentGamma = config.gamma;
      this.currentChannel = config.channel;

      document.getElementById('p').value = config.p;
      document.getElementById('pval').textContent = config.p.toFixed(3);
      document.getElementById('gamma').value = config.gamma;
      document.getElementById('gammaval').textContent = config.gamma.toFixed(3);
      document.getElementById('channel').value = config.channel;

      this.updatePlot();
    }
  }

  resetToDefault() {
    this.currentP = 0.1;
    this.currentGamma = 0.5;
    this.currentChannel = 'bit';
    this.vectorCount = 1000;
    this.animationSpeed = 1.0;
    this.colorScheme = 'default';
    this.showTrails = true;
    this.showSphere = false;
    this.animateTransition = true;

    document.getElementById('p').value = 0.1;
    document.getElementById('pval').textContent = '0.100';
    document.getElementById('gamma').value = 0.5;
    document.getElementById('gammaval').textContent = '0.500';
    document.getElementById('channel').value = 'bit';
    document.getElementById('vectorCount').value = 1000;
    document.getElementById('vectorCountVal').textContent = '1000';
    document.getElementById('animationSpeed').value = 1.0;
    document.getElementById('animSpeedVal').textContent = '1.0x';
    document.getElementById('showTrails').checked = true;
    document.getElementById('showSphere').checked = false;
    document.getElementById('animateTransition').checked = true;

    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.scheme === 'default') {
        btn.classList.add('active');
      }
    });

    this.generateVectors();
    this.updatePlot();
  }

  exportPlot() {
    Plotly.downloadImage('plot', {
      format: 'png',
      width: 1200,
      height: 800,
      filename: 'quantum_channel_visualization'
    });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new QuantumChannelVisualizer();
});

// Add some CSS animations for loading
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .control-section {
    animation: fadeIn 0.6s ease-out;
  }
  
  .control-section:nth-child(1) { animation-delay: 0.1s; }
  .control-section:nth-child(2) { animation-delay: 0.2s; }
  .control-section:nth-child(3) { animation-delay: 0.3s; }
  .control-section:nth-child(4) { animation-delay: 0.4s; }
  
  .plot-container {
    animation: fadeIn 0.8s ease-out 0.2s both;
  }
`;
document.head.appendChild(style);