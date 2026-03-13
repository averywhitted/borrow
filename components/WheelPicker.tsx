import { useRef, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
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
  const [localIndex, setLocalIndex] = useState(selectedIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Sync if parent changes selectedIndex externally
  useEffect(() => {
    setLocalIndex(selectedIndex);
    ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: true });
  }, [selectedIndex]);

  const handleScrollEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    setLocalIndex(clamped);
    onSelect(clamped);
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicator} pointerEvents="none" />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
      >
        <View style={{ height: ITEM_H * PAD }} />
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.text, i === localIndex && styles.selectedText]}>
              {item}
            </Text>
          </View>
        ))}
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
    borderColor: 'rgba(255, 255, 255, 0.25)',
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
