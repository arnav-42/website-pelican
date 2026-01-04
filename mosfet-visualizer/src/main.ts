import './style.css';
import { subscribe, getState, setState } from './state';
import { initPlot, updatePlot } from './plot';
import { initUI, updateUI, setVdFromPlotClick } from './ui';
import { initDrag } from './drag';

function render(): void {
  const state = getState();
  updateUI(state);
  updatePlot(state);
}

function handleVdsChange(Vds: number): void {
  setVdFromPlotClick(Vds);
}

function handleVgChange(Vg: number): void {
  setState({ Vg });
}

function init(): void {
  initPlot(handleVdsChange, handleVgChange);
  initUI();
  initDrag();
  subscribe(render);
  render();
  console.log('MOSFET Visualizer initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
