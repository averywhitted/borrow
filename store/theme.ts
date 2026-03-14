import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

export type ThemePref = 'light' | 'dark' | 'system';

let _pref: ThemePref = 'system';
const _listeners = new Set<() => void>();

export function getThemePref(): ThemePref {
  return _pref;
}

export function setThemePref(pref: ThemePref) {
  _pref = pref;
  _listeners.forEach(fn => fn());
}

export function subscribeThemePref(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function useThemePref(): ThemePref {
  const [pref, setPref] = useState<ThemePref>(_pref);
  useEffect(() => subscribeThemePref(() => setPref(getThemePref())), []);
  return pref;
}

/** Returns true when dark mode is active, based on preference + device scheme. */
export function useIsDark(): boolean {
  const deviceScheme = useColorScheme();
  const pref = useThemePref();
  if (pref === 'dark') return true;
  if (pref === 'light') return false;
  return deviceScheme === 'dark';
}
