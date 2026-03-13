import { useRef, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Font } from '../constants/theme';

const ITEM_H = 56;
const VISIBLE = 5;
const PAD = Math.floor(VISIBLE / 2); // 2

interface Props {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function WheelPicker({ items, selectedIndex, onSelect }: Props) {
  const ref = useRef<ScrollView>(null);
  // Track the "committed" index separately from the live scroll position
  const committedIndex = useRef(selectedIndex);

  // Scroll to initial position once mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
      committedIndex.current = selectedIndex;
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Sync when parent drives selectedIndex externally
  useEffect(() => {
    if (selectedIndex !== committedIndex.current) {
      committedIndex.current = selectedIndex;
      ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: true });
    }
  }, [selectedIndex]);

  const snapToNearest = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      // Force-snap to the exact pixel boundary
      ref.current?.scrollTo({ y: clamped * ITEM_H, animated: false });
      if (clamped !== committedIndex.current) {
        committedIndex.current = clamped;
        onSelect(clamped);
      }
    },
    [items.length, onSelect],
  );

  return (
    <View style={styles.container}>
      {/* Selection highlight bar */}
      <View style={styles.indicator} pointerEvents="none" />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={snapToNearest}
        onScrollEndDrag={snapToNearest}
        scrollEventThrottle={16}
        // Disable bouncing so it can't rest between items at edges
        bounces={false}
        overScrollMode="never"
      >
        <View style={{ height: ITEM_H * PAD }} />
        {items.map((item, i) => {
          const isSelected = i === selectedIndex;
          return (
            <View key={i} style={styles.item}>
              <Text style={[styles.text, isSelected && styles.selectedText]}>
                {item}
              </Text>
            </View>
          );
        })}
        <View style={{ height: ITEM_H * PAD }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_H * VISIBLE,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_H * PAD,
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    zIndex: 1,
  },
  item: {
    height: ITEM_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: Font.regular,
  },
  selectedText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: Font.extraBold,
  },
});
