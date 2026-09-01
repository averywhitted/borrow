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
  /** Color of the month portion (first word) of selected item. Defaults to white. */
  monthColor?: string;
  /** Color of the day portion (second word) of selected item. Defaults to white. */
  dayColor?: string;
  /** Color of non-selected items. Defaults to rgba(255,255,255,0.3). */
  dimColor?: string;
  /** Border color of the selection highlight bar. */
  indicatorBorder?: string;
  /** Background color of the selection highlight bar. */
  indicatorBg?: string;
}

export function WheelPicker({
  items,
  selectedIndex,
  onSelect,
  monthColor,
  dayColor,
  dimColor = 'rgba(255, 255, 255, 0.3)',
  indicatorBorder = 'rgba(255, 255, 255, 0.3)',
  indicatorBg = 'rgba(255,255,255,0.06)',
}: Props) {
  const ref = useRef<ScrollView>(null);
  const committedIndex = useRef(selectedIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
      committedIndex.current = selectedIndex;
    }, 50);
    return () => clearTimeout(timer);
  }, []);

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
      ref.current?.scrollTo({ y: clamped * ITEM_H, animated: false });
      if (clamped !== committedIndex.current) {
        committedIndex.current = clamped;
        onSelect(clamped);
      }
    },
    [items.length, onSelect],
  );

  const hasSplitColors = monthColor !== undefined && dayColor !== undefined;

  return (
    <View style={styles.container}>
      {/* Selection highlight bar */}
      <View
        style={[
          styles.indicator,
          { borderColor: indicatorBorder, backgroundColor: indicatorBg },
        ]}
        style={{ pointerEvents: 'none' }}
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={snapToNearest}
        onScrollEndDrag={snapToNearest}
        scrollEventThrottle={16}
        bounces={false}
        overScrollMode="never"
      >
        <View style={{ height: ITEM_H * PAD }} />
        {items.map((item, i) => {
          const isSelected = i === selectedIndex;
          if (hasSplitColors && isSelected) {
            const parts = item.split(' ');
            const month = parts[0];
            const day = parts.slice(1).join(' ');
            return (
              <View key={i} style={styles.item}>
                <Text style={styles.selectedSplit}>
                  <Text style={{ color: monthColor }}>{month} </Text>
                  <Text style={{ color: dayColor }}>{day}</Text>
                </Text>
              </View>
            );
          }
          return (
            <View key={i} style={styles.item}>
              <Text
                style={[
                  styles.text,
                  { color: dimColor },
                  isSelected && !hasSplitColors && styles.selectedText,
                ]}
              >
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
    zIndex: 1,
  },
  item: {
    height: ITEM_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontFamily: Font.regular,
  },
  selectedText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: Font.extraBold,
  },
  selectedSplit: {
    fontSize: 22,
    fontFamily: Font.extraBold,
  },
});
