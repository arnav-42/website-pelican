import type { DeviceType } from './state';

export const K = 0.5e-3;

export type OperatingRegion = 'cutoff' | 'triode' | 'saturation';

export function getOperatingRegion(
  Vgs: number,
  Vds: number,
  Vth: number,
  deviceType: DeviceType = 'nmos'
): OperatingRegion {
  if (deviceType === 'nmos') {
    if (Vgs <= Vth) {
      return 'cutoff';
    }
    
    const Vov = Vgs - Vth;
    
    if (Vds < 0) {
      return 'cutoff';
    }
    
    if (Vds < Vov) {
      return 'triode';
    }
    
    return 'saturation';
  } else {
    if (Vgs >= Vth) {
      return 'cutoff';
    }
    
    const Vov = Vth - Vgs;
    const Vsd = -Vds;
    
    if (Vsd < 0) {
      return 'cutoff';
    }
    
    if (Vsd < Vov) {
      return 'triode';
    }
    
    return 'saturation';
  }
}

export function calculateId(
  Vgs: number,
  Vds: number,
  Vth: number,
  deviceType: DeviceType = 'nmos',
  k: number = K
): number {
  const region = getOperatingRegion(Vgs, Vds, Vth, deviceType);
  
  if (region === 'cutoff') {
    return 0;
  }
  
  if (deviceType === 'nmos') {
    const Vov = Vgs - Vth;
    
    if (region === 'triode') {
      return k * (Vov * Vds - 0.5 * Vds * Vds);
    } else {
      return 0.5 * k * Vov * Vov;
    }
  } else {
    const Vov = Vth - Vgs;
    const Vsd = -Vds;
    
    if (region === 'triode') {
      return k * (Vov * Vsd - 0.5 * Vsd * Vsd);
    } else {
      return 0.5 * k * Vov * Vov;
    }
  }
}

export function getOverdriveVoltage(
  Vgs: number,
  Vth: number,
  deviceType: DeviceType = 'nmos'
): number {
  if (deviceType === 'nmos') {
    return Vgs - Vth;
  } else {
    return Vth - Vgs;
  }
}

export function generateIdVdsCurve(
  Vgs: number,
  Vth: number,
  sweepArray: readonly number[],
  deviceType: DeviceType = 'nmos',
  k: number = K
): number[] {
  if (deviceType === 'nmos') {
    return sweepArray.map(Vds => calculateId(Vgs, Vds, Vth, deviceType, k));
  } else {
    return sweepArray.map(Vsd => {
      const Vds = -Vsd;
      return calculateId(Vgs, Vds, Vth, deviceType, k);
    });
  }
}

export function createVdsSweep(start: number, end: number, points: number): number[] {
  const step = (end - start) / (points - 1);
  return Array.from({ length: points }, (_, i) => start + i * step);
}

export function getEffectiveVdsForPlot(Vds: number, deviceType: DeviceType): number {
  if (deviceType === 'nmos') {
    return Math.max(0, Vds);
  } else {
    return Math.max(0, -Vds);
  }
}

export function isValidOperation(
  Vgs: number,
  Vds: number,
  deviceType: DeviceType
): boolean {
  if (deviceType === 'nmos') {
    return Vds >= 0;
  } else {
    return Vds <= 0;
  }
}
