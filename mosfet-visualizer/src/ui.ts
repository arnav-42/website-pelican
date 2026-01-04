import { setState, getState, getVgs, getVds, getDefaultVoltages } from './state';
import type { MosfetState, DeviceType, OperatingMode } from './state';
import { calculateId, getOperatingRegion, getOverdriveVoltage } from './mosfet';

const INPUT_IDS = {
  Vg: 'input-vg',
  Vd: 'input-vd',
  Vs: 'input-vs',
  Vth: 'input-vth',
  k: 'input-k',
} as const;

const DISPLAY_IDS = {
  Vgs: 'display-vgs',
  Vds: 'display-vds',
  Id: 'display-id',
  region: 'display-region',
} as const;

const TOGGLE_IDS = {
  deviceType: 'device-type-toggle',
  operatingMode: 'operating-mode-toggle',
} as const;

let isProgrammaticUpdate = false;

export function initUI(): void {
  bindInput(INPUT_IDS.Vg, 'Vg');
  bindInput(INPUT_IDS.Vd, 'Vd');
  bindInput(INPUT_IDS.Vs, 'Vs');
  bindInput(INPUT_IDS.Vth, 'Vth');
  bindInput(INPUT_IDS.k, 'k');
  bindSpinnerButtons();
  bindDeviceTypeToggle();
  bindOperatingModeToggle();
}

function bindInput(inputId: string, stateKey: keyof MosfetState): void {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input) {
    console.error(`Input element not found: ${inputId}`);
    return;
  }

  const state = getState();
  const value = state[stateKey];
  if (typeof value === 'number') {
    input.value = value.toString();
  }

  input.addEventListener('input', () => {
    if (isProgrammaticUpdate) return;

    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      setState({ [stateKey]: value });
    }
  });
}

function bindSpinnerButtons(): void {
  const groups = document.querySelectorAll<HTMLElement>('.spin-btns');
  groups.forEach(group => {
    const targetId = group.getAttribute('data-target');
    if (!targetId) return;
    const input = document.getElementById(targetId) as HTMLInputElement | null;
    if (!input) return;

    const upBtn = group.querySelector<HTMLButtonElement>('.spin.up');
    const downBtn = group.querySelector<HTMLButtonElement>('.spin.down');
    if (!upBtn || !downBtn) return;

    attachSpinHandler(upBtn, input, +1);
    attachSpinHandler(downBtn, input, -1);
  });
}

function attachSpinHandler(btn: HTMLButtonElement, input: HTMLInputElement, direction: 1 | -1): void {
  const step = parseFloat(input.step || '0.1') || 0.1;
  let holdTimer: number | undefined;
  let repeatTimer: number | undefined;

  const increment = () => {
    const current = parseFloat(input.value);
    const next = (isNaN(current) ? 0 : current) + direction * step;
    input.value = next.toFixed(2);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const clearTimers = () => {
    if (holdTimer !== undefined) {
      window.clearTimeout(holdTimer);
      holdTimer = undefined;
    }
    if (repeatTimer !== undefined) {
      window.clearInterval(repeatTimer);
      repeatTimer = undefined;
    }
  };

  btn.addEventListener('mousedown', e => {
    e.preventDefault();
    increment();
    holdTimer = window.setTimeout(() => {
      repeatTimer = window.setInterval(() => increment(), 80);
    }, 300);
  });

  btn.addEventListener('mouseup', clearTimers);
  btn.addEventListener('mouseleave', clearTimers);
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    increment();
    holdTimer = window.setTimeout(() => {
      repeatTimer = window.setInterval(() => increment(), 80);
    }, 300);
  }, { passive: false });
  btn.addEventListener('touchend', clearTimers);
  btn.addEventListener('touchcancel', clearTimers);
}

function bindDeviceTypeToggle(): void {
  const toggle = document.getElementById(TOGGLE_IDS.deviceType);
  if (!toggle) return;

  const nmosBtn = toggle.querySelector('[data-value="nmos"]');
  const pmosBtn = toggle.querySelector('[data-value="pmos"]');

  if (!nmosBtn || !pmosBtn) return;

  const updateToggleUI = (deviceType: DeviceType) => {
    nmosBtn.classList.toggle('active', deviceType === 'nmos');
    pmosBtn.classList.toggle('active', deviceType === 'pmos');
  };

  const state = getState();
  updateToggleUI(state.deviceType);

  nmosBtn.addEventListener('click', () => {
    const state = getState();
    if (state.deviceType === 'nmos') return;
    
    const defaults = getDefaultVoltages('nmos', state.operatingMode);
    setState({
      deviceType: 'nmos',
      ...defaults,
    });
    updateToggleUI('nmos');
  });

  pmosBtn.addEventListener('click', () => {
    const state = getState();
    if (state.deviceType === 'pmos') return;
    
    const defaults = getDefaultVoltages('pmos', state.operatingMode);
    setState({
      deviceType: 'pmos',
      ...defaults,
    });
    updateToggleUI('pmos');
  });
}

function bindOperatingModeToggle(): void {
  const toggle = document.getElementById(TOGGLE_IDS.operatingMode);
  if (!toggle) return;

  const enhBtn = toggle.querySelector('[data-value="enhancement"]');
  const depBtn = toggle.querySelector('[data-value="depletion"]');

  if (!enhBtn || !depBtn) return;

  const updateToggleUI = (mode: OperatingMode) => {
    enhBtn.classList.toggle('active', mode === 'enhancement');
    depBtn.classList.toggle('active', mode === 'depletion');
  };

  const state = getState();
  updateToggleUI(state.operatingMode);

  enhBtn.addEventListener('click', () => {
    const state = getState();
    if (state.operatingMode === 'enhancement') return;
    
    const defaults = getDefaultVoltages(state.deviceType, 'enhancement');
    setState({
      operatingMode: 'enhancement',
      Vth: defaults.Vth,
    });
    updateToggleUI('enhancement');
  });

  depBtn.addEventListener('click', () => {
    const state = getState();
    if (state.operatingMode === 'depletion') return;
    
    const defaults = getDefaultVoltages(state.deviceType, 'depletion');
    setState({
      operatingMode: 'depletion',
      Vth: defaults.Vth,
    });
    updateToggleUI('depletion');
  });
}

export function updateUI(state: MosfetState): void {
  isProgrammaticUpdate = true;

  const { deviceType } = state;
  const isPmos = deviceType === 'pmos';

  updateInputValue(INPUT_IDS.Vg, state.Vg);
  updateInputValue(INPUT_IDS.Vd, state.Vd);
  updateInputValue(INPUT_IDS.Vs, state.Vs);
  updateInputValue(INPUT_IDS.Vth, state.Vth);
  updateInputValue(INPUT_IDS.k, state.k);

  const Vgs = getVgs(state);
  const Vds = getVds(state);
  const kAmperes = state.k * 1e-3;
  const Id = calculateId(Vgs, Vds, state.Vth, deviceType, kAmperes);
  const region = getOperatingRegion(Vgs, Vds, state.Vth, deviceType);
  const Vov = getOverdriveVoltage(Vgs, state.Vth, deviceType);

  if (isPmos) {
    const Vsg = -Vgs;
    const Vsd = -Vds;
    updateDisplay(DISPLAY_IDS.Vgs, `${Vsg.toFixed(2)} V`, undefined, 'Vsg');
    updateDisplay(DISPLAY_IDS.Vds, `${Vsd.toFixed(2)} V`, undefined, 'Vsd');
    updateDisplay(DISPLAY_IDS.Id, `${(Id * 1000).toFixed(3)} mA`, undefined, '|Id|');
  } else {
    updateDisplay(DISPLAY_IDS.Vgs, `${Vgs.toFixed(2)} V`, undefined, 'Vgs');
    updateDisplay(DISPLAY_IDS.Vds, `${Vds.toFixed(2)} V`, undefined, 'Vds');
    updateDisplay(DISPLAY_IDS.Id, `${(Id * 1000).toFixed(3)} mA`, undefined, 'Id');
  }
  
  updateDisplay(DISPLAY_IDS.region, formatRegion(region), getRegionClass(region));

  const vovEl = document.getElementById('display-vov');
  if (vovEl) {
    vovEl.textContent = `${Vov.toFixed(2)} V`;
    vovEl.style.color = Vov > 0 ? 'var(--accent-cyan)' : 'var(--accent-red)';
  }

  updateRegionIndicator(region);
  updateToggleButtons(state);
  updateDisplayLabels(state);

  isProgrammaticUpdate = false;
}

function updateRegionIndicator(activeRegion: string): void {
  const sections = document.querySelectorAll('.region-section');
  sections.forEach(section => {
    const regionName = section.getAttribute('data-region');
    section.classList.toggle('active', regionName === activeRegion);
  });
}

function updateToggleButtons(state: MosfetState): void {
  const deviceToggle = document.getElementById(TOGGLE_IDS.deviceType);
  if (deviceToggle) {
    const nmosBtn = deviceToggle.querySelector('[data-value="nmos"]');
    const pmosBtn = deviceToggle.querySelector('[data-value="pmos"]');
    nmosBtn?.classList.toggle('active', state.deviceType === 'nmos');
    pmosBtn?.classList.toggle('active', state.deviceType === 'pmos');
  }

  const modeToggle = document.getElementById(TOGGLE_IDS.operatingMode);
  if (modeToggle) {
    const enhBtn = modeToggle.querySelector('[data-value="enhancement"]');
    const depBtn = modeToggle.querySelector('[data-value="depletion"]');
    enhBtn?.classList.toggle('active', state.operatingMode === 'enhancement');
    depBtn?.classList.toggle('active', state.operatingMode === 'depletion');
  }
}

function updateDisplayLabels(state: MosfetState): void {
  const isPmos = state.deviceType === 'pmos';
  
  const vgsLabelEl = document.getElementById('label-vgs');
  const vdsLabelEl = document.getElementById('label-vds');
  const idLabelEl = document.getElementById('label-id');

  if (vgsLabelEl) {
    vgsLabelEl.innerHTML = isPmos ? 'V<sub>SG</sub>' : 'V<sub>GS</sub>';
  }
  if (vdsLabelEl) {
    vdsLabelEl.innerHTML = isPmos ? 'V<sub>SD</sub>' : 'V<sub>DS</sub>';
  }
  if (idLabelEl) {
    idLabelEl.innerHTML = isPmos ? '|I<sub>D</sub>|' : 'I<sub>D</sub>';
  }

  const nmosInfo = document.getElementById('model-info-nmos');
  const pmosInfo = document.getElementById('model-info-pmos');
  if (nmosInfo) {
    nmosInfo.style.display = isPmos ? 'none' : 'block';
  }
  if (pmosInfo) {
    pmosInfo.style.display = isPmos ? 'block' : 'none';
  }
}

function updateInputValue(inputId: string, value: number): void {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (input && document.activeElement !== input) {
    input.value = value.toFixed(2);
  }
}

function updateDisplay(displayId: string, text: string, className?: string, _label?: string): void {
  const element = document.getElementById(displayId);
  if (element) {
    element.textContent = text;
    if (className) {
      element.className = `value ${className}`;
    }
  }
}

function formatRegion(region: string): string {
  switch (region) {
    case 'cutoff':
      return 'Cutoff';
    case 'triode':
      return 'Triode (Linear)';
    case 'saturation':
      return 'Saturation';
    default:
      return region;
  }
}

function getRegionClass(region: string): string {
  return `region-${region}`;
}

export function setVdFromPlotClick(voltageMagnitude: number): void {
  const state = getState();
  
  if (state.deviceType === 'pmos') {
    const newVd = state.Vs - voltageMagnitude;
    setState({ Vd: newVd });
  } else {
    const newVd = voltageMagnitude + state.Vs;
    setState({ Vd: newVd });
  }
}
