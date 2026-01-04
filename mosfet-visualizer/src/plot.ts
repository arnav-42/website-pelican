import Plotly from 'plotly.js-dist-min';
import type { PlotData, Layout, Config, Shape, Annotations } from 'plotly.js';
import { generateIdVdsCurve, createVdsSweep, calculateId, getOperatingRegion, getOverdriveVoltage, getEffectiveVdsForPlot } from './mosfet';
import type { MosfetState } from './state';
import { getVgs, getVds } from './state';

const VDS_POINTS = 200;
const VDS_SWEEP = createVdsSweep(0, 5, VDS_POINTS);

const PLOT_DIV_ID = 'plot';

let plotInitialized = false;

type VdsCallback = (Vds: number) => void;
type VgCallback = (Vg: number) => void;
let vdsCallback: VdsCallback | null = null;
let vgCallback: VgCallback | null = null;

let isDragging = false;
let dragStartY = 0;
let dragStartVg = 0;

let currentState: MosfetState | null = null;

let handlersAttached = false;

export function initPlot(onVdsChange?: VdsCallback, onVgChange?: VgCallback): void {
  vdsCallback = onVdsChange ?? null;
  vgCallback = onVgChange ?? null;
  plotInitialized = false;
  isDragging = false;
  handlersAttached = false;
}

function pixelToVoltage(plotDiv: HTMLElement, clientX: number): number | null {
  const gd = plotDiv as HTMLElement & { 
    _fullLayout?: { 
      xaxis: { range: [number, number]; _length: number };
      margin: { l: number };
    } 
  };
  
  const fullLayout = gd._fullLayout;
  if (!fullLayout?.xaxis) return null;

  const xaxis = fullLayout.xaxis;
  const rect = plotDiv.getBoundingClientRect();
  const plotLeft = rect.left + fullLayout.margin.l;
  const pixelX = clientX - plotLeft;
  const xRange = xaxis.range;
  const plotWidth = xaxis._length;
  
  if (plotWidth <= 0) return null;
  
  const ratio = pixelX / plotWidth;
  return xRange[0] + ratio * (xRange[1] - xRange[0]);
}

function pixelDeltaToVgDelta(deltaY: number): number {
  const vgPerPixel = 0.02;
  return -deltaY * vgPerPixel;
}

function handleVdsInteraction(clientX: number): void {
  const plotDiv = document.getElementById(PLOT_DIV_ID);
  if (!plotDiv || !vdsCallback || !currentState) return;
  
  const voltageMagnitude = pixelToVoltage(plotDiv, clientX);
  if (voltageMagnitude !== null && !isNaN(voltageMagnitude)) {
    const clampedMagnitude = Math.max(0, Math.min(5, voltageMagnitude));
    vdsCallback(clampedMagnitude);
  }
}

function handleVgInteraction(clientY: number): void {
  const plotDiv = document.getElementById(PLOT_DIV_ID);
  if (!plotDiv || !vgCallback || !currentState) return;
  
  const deltaY = clientY - dragStartY;
  const deltaVg = pixelDeltaToVgDelta(deltaY);
  
  let newVg: number;
  if (currentState.deviceType === 'pmos') {
    newVg = Math.max(-5, Math.min(10, dragStartVg - deltaVg));
  } else {
    newVg = Math.max(-5, Math.min(10, dragStartVg + deltaVg));
  }
  
  vgCallback(newVg);
}

function setupDragHandlers(): void {
  if (handlersAttached) return;
  handlersAttached = true;
  
  const plotDiv = document.getElementById(PLOT_DIV_ID);
  if (!plotDiv) return;
  
  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    
    const voltage = pixelToVoltage(plotDiv, e.clientX);
    if (voltage === null || voltage < -0.5 || voltage > 5.5) return;
    
    isDragging = true;
    dragStartY = e.clientY;
    dragStartVg = currentState?.Vg ?? 3.0;
    
    plotDiv.classList.add('dragging');
    const container = plotDiv.closest('.plot-container');
    if (container) {
      container.classList.add('dragging');
    }
    
    handleVdsInteraction(e.clientX);
    
    e.preventDefault();
    e.stopPropagation();
  };
  
  plotDiv.addEventListener('mousedown', onMouseDown, true);
  
  const svg = plotDiv.querySelector('svg.main-svg');
  if (svg) {
    svg.addEventListener('mousedown', onMouseDown as EventListener, true);
  }
  
  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;
    handleVdsInteraction(e.clientX);
    handleVgInteraction(e.clientY);
  });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    const plotDiv = document.getElementById(PLOT_DIV_ID);
    if (plotDiv) {
      plotDiv.classList.remove('dragging');
      const container = plotDiv.closest('.plot-container');
      if (container) {
        container.classList.remove('dragging');
      }
    }
    
    if (currentState) {
      requestAnimationFrame(() => {
        if (currentState) {
          updatePlot(currentState);
        }
      });
    }
  });
  
  plotDiv.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const voltage = pixelToVoltage(plotDiv, touch.clientX);
    if (voltage === null || voltage < -0.5 || voltage > 5.5) return;
    
    isDragging = true;
    dragStartY = touch.clientY;
    dragStartVg = currentState?.Vg ?? 3.0;
    
    plotDiv.classList.add('dragging');
    const container = plotDiv.closest('.plot-container');
    if (container) {
      container.classList.add('dragging');
    }
    
    handleVdsInteraction(touch.clientX);
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    handleVdsInteraction(touch.clientX);
    handleVgInteraction(touch.clientY);
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    const plotDiv = document.getElementById(PLOT_DIV_ID);
    if (plotDiv) {
      plotDiv.classList.remove('dragging');
      const container = plotDiv.closest('.plot-container');
      if (container) {
        container.classList.remove('dragging');
      }
    }
    
    if (currentState) {
      requestAnimationFrame(() => {
        if (currentState) {
          updatePlot(currentState);
        }
      });
    }
  });
  
  plotDiv.style.cursor = 'move';
}

export function updatePlot(state: MosfetState): void {
  const plotDiv = document.getElementById(PLOT_DIV_ID);
  if (!plotDiv) {
    console.error('Plot div not found');
    return;
  }

  currentState = state;

  const Vgs = getVgs(state);
  const Vds = getVds(state);
  const { Vth, deviceType, operatingMode } = state;

  const kAmperes = state.k * 1e-3;

  const idData = generateIdVdsCurve(Vgs, Vth, VDS_SWEEP, deviceType, kAmperes);
  const idDataMa = idData.map(id => id * 1000);

  const currentId = calculateId(Vgs, Vds, Vth, deviceType, kAmperes);
  const currentIdMa = currentId * 1000;
  const region = getOperatingRegion(Vgs, Vds, Vth, deviceType);
  const markerColor = getRegionColor(region);

  const effectiveVds = getEffectiveVdsForPlot(Vds, deviceType);

  const Vov = getOverdriveVoltage(Vgs, Vth, deviceType);

  const maxId = Math.max(2, currentIdMa * 1.5, Math.max(...idDataMa) * 1.1);

  const isPmos = deviceType === 'pmos';
  const deviceLabel = isPmos ? 'PMOS' : 'NMOS';
  const modeLabel = operatingMode === 'enhancement' ? 'Enhancement' : 'Depletion';
  const xAxisLabel = isPmos ? '|Vds| = Vsd (V)' : 'Vds (V)';
  const yAxisLabel = isPmos ? '|Id| (mA)' : 'Id (mA)';
  
  const vgsDisplayValue = Vgs.toFixed(2);
  const vgsLabel = isPmos ? `Vsg = ${(-Vgs).toFixed(2)}V` : `Vgs = ${vgsDisplayValue}V`;

  const curveTrace: Partial<PlotData> = {
    x: VDS_SWEEP as number[],
    y: idDataMa,
    type: 'scatter',
    mode: 'lines',
    name: isPmos ? `|Id| (Vsg=${(-Vgs).toFixed(2)}V)` : `Id (Vgs=${Vgs.toFixed(2)}V)`,
    line: {
      color: isPmos ? '#e74c3c' : '#00d4aa',
      width: 4,
    },
    hovertemplate: isPmos 
      ? '|Vds|: %{x:.2f}V<br>|Id|: %{y:.3f}mA<extra></extra>'
      : 'Vds: %{x:.2f}V<br>Id: %{y:.3f}mA<extra></extra>',
  };

  const markerTrace: Partial<PlotData> = {
    x: [effectiveVds],
    y: [currentIdMa],
    type: 'scatter',
    mode: 'markers+text' as 'markers',
    name: 'Operating Point',
    marker: {
      color: markerColor,
      size: 20,
      symbol: 'circle',
      line: { color: '#ffffff', width: 3 },
    },
    text: [`${region.charAt(0).toUpperCase() + region.slice(1)}`],
    textposition: 'top center',
    textfont: {
      color: '#e0e0e0',
      size: 12,
      family: 'JetBrains Mono, Consolas, monospace',
    },
    hovertemplate: isPmos
      ? `<b>|Vds|: ${effectiveVds.toFixed(2)}V</b><br>|Id|: ${currentIdMa.toFixed(3)}mA<br>Region: ${region}<extra></extra>`
      : `<b>Vds: ${effectiveVds.toFixed(2)}V</b><br>Id: ${currentIdMa.toFixed(3)}mA<br>Region: ${region}<extra></extra>`,
  };

  const boundaryTrace: Partial<PlotData> = {
    x: Vov > 0 ? [Vov, Vov] : [],
    y: Vov > 0 ? [0, maxId] : [],
    type: 'scatter',
    mode: 'lines',
    name: isPmos ? '|Vds| = Vov' : 'Vds = Vov',
    line: {
      color: '#ff6b6b',
      width: 2,
      dash: 'dash',
    },
    hovertemplate: `Triode/Sat boundary<br>Vov = ${Vov.toFixed(2)}V<extra></extra>`,
  };

  const vthIndicatorTrace: Partial<PlotData> = {
    x: [0, 5],
    y: [0, 0],
    type: 'scatter',
    mode: 'lines',
    name: `Vth = ${Vth.toFixed(2)}V`,
    line: {
      color: '#9b59b6',
      width: 2,
      dash: 'dot',
    },
    hovertemplate: `Vth = ${Vth.toFixed(2)}V<extra></extra>`,
    visible: true,
  };

  const data = [curveTrace, boundaryTrace, vthIndicatorTrace, markerTrace];

  const shapes: Partial<Shape>[] = [];

  const annotations: Partial<Annotations>[] = [
    {
      x: 0.3,
      y: maxId * 0.05,
      xref: 'x',
      yref: 'y',
      text: `Vth = ${Vth.toFixed(2)}V`,
      showarrow: false,
      font: {
        color: '#9b59b6',
        size: 11,
        family: 'JetBrains Mono, Consolas, monospace',
      },
      bgcolor: 'rgba(22, 33, 62, 0.9)',
      borderpad: 4,
      yshift: 10,
    },
    {
      x: 4.5,
      y: idDataMa[idDataMa.length - 1] || maxId * 0.8,
      xref: 'x',
      yref: 'y',
      text: vgsLabel,
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      arrowcolor: isPmos ? '#e74c3c' : '#00d4aa',
      ax: 30,
      ay: -30,
      font: {
        color: isPmos ? '#e74c3c' : '#00d4aa',
        size: 12,
        family: 'JetBrains Mono, Consolas, monospace',
      },
      bgcolor: 'rgba(22, 33, 62, 0.9)',
      borderpad: 4,
    },
  ];

  const isInCutoff = region === 'cutoff';
  const cutoffCondition = isPmos 
    ? `Vgs ≥ Vth (${Vgs.toFixed(2)} ≥ ${Vth.toFixed(2)})`
    : `Vgs ≤ Vth (${Vgs.toFixed(2)} ≤ ${Vth.toFixed(2)})`;

  if (isInCutoff) {
    annotations.push({
      x: 0.5,
      y: 0.5,
      xref: 'paper',
      yref: 'paper',
      text: `⚠️ CUTOFF: ${cutoffCondition}`,
      showarrow: false,
      font: {
        color: '#ff4757',
        size: 14,
        family: 'JetBrains Mono, Consolas, monospace',
      },
      bgcolor: 'rgba(255, 71, 87, 0.2)',
      bordercolor: '#ff4757',
      borderwidth: 2,
      borderpad: 10,
    });
  }

  const layout: Partial<Layout> = {
    title: {
      text: `${deviceLabel} ${modeLabel} Mode`,
      font: {
        color: '#e0e0e0',
        size: 18,
        family: 'JetBrains Mono, Consolas, monospace',
      },
    },
    xaxis: {
      title: { text: xAxisLabel, font: { color: '#b0b0b0', size: 14 } },
      range: [0, 5],
      gridcolor: '#3a3a3a',
      zerolinecolor: '#4a4a4a',
      tickfont: { color: '#b0b0b0' },
      tickformat: '.1f',
      fixedrange: true,
    },
    yaxis: {
      title: { text: yAxisLabel, font: { color: '#b0b0b0', size: 14 } },
      range: [0, maxId],
      gridcolor: '#3a3a3a',
      zerolinecolor: '#4a4a4a',
      tickfont: { color: '#b0b0b0' },
      tickformat: '.2f',
      fixedrange: true,
    },
    paper_bgcolor: '#1a1a2e',
    plot_bgcolor: isPmos ? '#1e1a2e' : '#16213e',
    font: {
      family: 'JetBrains Mono, Consolas, monospace',
      color: '#e0e0e0',
    },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(22, 33, 62, 0.9)',
      bordercolor: '#3a3a3a',
      borderwidth: 1,
      font: { color: '#b0b0b0', size: 10 },
    },
    margin: { t: 60, r: 30, b: 60, l: 70 },
    hovermode: 'closest',
    dragmode: false,
    shapes: shapes,
    annotations: annotations,
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoom2d', 'pan2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
    displaylogo: false,
    scrollZoom: false,
    staticPlot: false,
  };

  if (!plotInitialized) {
    Plotly.newPlot(plotDiv, data, layout, config).then(() => {
      plotInitialized = true;
      setupDragHandlers();
    });
  } else {
    Plotly.react(plotDiv, data, layout, config);
  }
}

function getRegionColor(region: string): string {
  switch (region) {
    case 'cutoff':
      return '#ff4757';
    case 'triode':
      return '#ffa502';
    case 'saturation':
      return '#2ed573';
    default:
      return '#ffffff';
  }
}

export function getVdsSweep(): readonly number[] {
  return VDS_SWEEP;
}

export function isDraggingPlot(): boolean {
  return isDragging;
}
