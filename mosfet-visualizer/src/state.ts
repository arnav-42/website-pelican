export type DeviceType = 'nmos' | 'pmos';
export type OperatingMode = 'enhancement' | 'depletion';

export interface MosfetState {
  Vg: number;
  Vd: number;
  Vs: number;
  Vth: number;
  k: number;
  deviceType: DeviceType;
  operatingMode: OperatingMode;
}

const defaultState: MosfetState = {
  Vg: 3.0,
  Vd: 2.5,
  Vs: 0.0,
  Vth: 1.0,
  k: 0.5,
  deviceType: 'nmos',
  operatingMode: 'enhancement',
};

let state: MosfetState = { ...defaultState };

type StateListener = (state: MosfetState) => void;
const listeners: StateListener[] = [];

export function getState(): MosfetState {
  return { ...state };
}

export function setState(partial: Partial<MosfetState>): void {
  state = { ...state, ...partial };
  notifyListeners();
}

export function subscribe(listener: StateListener): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function notifyListeners(): void {
  const currentState = getState();
  for (const listener of listeners) {
    listener(currentState);
  }
}

export function getVgs(s: MosfetState = state): number {
  return s.Vg - s.Vs;
}

export function getVds(s: MosfetState = state): number {
  return s.Vd - s.Vs;
}

export function getDefaultVth(deviceType: DeviceType, operatingMode: OperatingMode): number {
  if (deviceType === 'nmos') {
    return operatingMode === 'enhancement' ? 1.0 : -1.0;
  } else {
    return operatingMode === 'enhancement' ? -1.0 : 1.0;
  }
}

export function getDefaultVoltages(deviceType: DeviceType, operatingMode: OperatingMode): { Vg: number; Vd: number; Vs: number; Vth: number } {
  const Vth = getDefaultVth(deviceType, operatingMode);
  
  if (deviceType === 'nmos') {
    return {
      Vg: 3.0,
      Vd: 2.5,
      Vs: 0.0,
      Vth,
    };
  } else {
    return {
      Vg: 2.0,
      Vd: 2.5,
      Vs: 5.0,
      Vth,
    };
  }
}

export function resetState(): void {
  setState(defaultState);
}
