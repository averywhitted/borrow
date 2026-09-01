/**
 * Shared animated pill-style tab/option selector.
 * Same sliding-indicator pattern used in the Library and Messages tabs.
 *
 * Usage (labels only):
 *   <SlidingSelector options={['1 week','2 weeks','1 month']} selected={v} onSelect={setV} />
 *
 * Usage (with icons):
 *   <SlidingSelector
 *     options={[{ key:'light', label:'Light', icon:'light-mode' }, ...]}
 *     selected={pref}
 *     onSelect={setPref}
 *   />
 */

import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Colors, DarkColors, Radius, Font, getShadow } from '../constants/theme';
import { useIsDark } from '../store/theme';

export type SelectorOption =
  | string
  | { key: string; label: string; icon?: React.ComponentProps<typeof MaterialIcons>['name'] };

function optKey(o: SelectorOption): string {
  return typeof o === 'string' ? o : o.key;
}
function optLabel(o: SelectorOption): string {
  return typeof o === 'string' ? o : o.label;
}
function optIcon(o: SelectorOption): React.ComponentProps<typeof MaterialIcons>['name'] | undefined {
  return typeof o === 'string' ? undefined : o.icon;
}

interface Props {
  options: SelectorOption[];
  selected: string;
  onSelect: (key: string) => void;
  /** Active indicator colour. Defaults to '#555' in light mode, '#888' in dark. */
  color?: string;
  /** If true forces dark palette regardless of system theme. */
  dark?: boolean;
}

export function SlidingSelector({ options, selected, onSelect, color, dark }: Props) {
  const systemDark = useIsDark();
  const isDark = dark !== undefined ? dark : systemDark;
  const C = isDark ? DarkColors : Colors;
  const activeColor = color ?? (isDark ? '#888' : '#555');

  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  // Subtract 2 for the 1px border on each side so the last option aligns correctly
  const slotW = barWidth > 0 ? (barWidth - 10) / options.length : 0;

  const handleLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    const w = e.nativeEvent.layout.width;
    setBarWidth(w);
    const tw = (w - 10) / options.length;
    const idx = options.findIndex(o => optKey(o) === selected);
    indicatorX.setValue((idx < 0 ? 0 : idx) * tw);
  };

  const handleSelect = (key: string, idx: number) => {
    if (slotW === 0) return;
    Animated.timing(indicatorX, {
      toValue: idx * slotW,
      duration: 160,
      useNativeDriver: false,
    }).start();
    onSelect(key);
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: C.black, backgroundColor: C.white },
        getShadow(isDark),
      ]}
      onLayout={handleLayout}
    >
      {slotW > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { width: slotW, backgroundColor: activeColor, transform: [{ translateX: indicatorX }] },
          ]}
        />
      )}
      {options.map((opt, idx) => {
        const key = optKey(opt);
        const label = optLabel(opt);
        const icon = optIcon(opt);
        const isActive = selected === key;
        return (
          <TouchableOpacity
            key={key}
            style={styles.tab}
            onPress={() => handleSelect(key, idx)}
            activeOpacity={0.7}
          >
            {icon && (
              <MaterialIcons
                name={icon}
                size={15}
                color={isActive ? C.white : C.gray}
              />
            )}
            <Text style={[styles.tabText, { color: isActive ? C.white : C.gray }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', position: 'relative',
    borderWidth: 1, borderRadius: Radius.pill,
    padding: 4,
  },
  indicator: {
    position: 'absolute', top: 4, bottom: 4, left: 4,
    borderRadius: Radius.pill,
  },
  tab: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 8, zIndex: 1,
  },
  tabText: { fontSize: 13, fontFamily: Font.bold, fontWeight: '600' },
});
