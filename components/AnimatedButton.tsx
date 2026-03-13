import { useRef } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Drop-in replacement for TouchableOpacity.
 * On press: translates 4px right+down (matching Shadow offset) then springs back.
 * Pass Shadow + all other styles exactly as you would to TouchableOpacity.
 */
export function AnimatedButton({
  style,
  onPressIn,
  onPressOut,
  ...props
}: TouchableOpacityProps) {
  const press = useRef(new Animated.Value(0)).current;

  return (
    <AnimatedTouchable
      activeOpacity={0.95}
      style={[
        style,
        {
          transform: [
            { translateX: press.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
            { translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
          ],
        },
      ]}
      onPressIn={(e) => {
        Animated.timing(press, { toValue: 1, duration: 60, useNativeDriver: true }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(press, { toValue: 0, speed: 20, bounciness: 4, useNativeDriver: true }).start();
        onPressOut?.(e);
      }}
      {...props}
    />
  );
}
