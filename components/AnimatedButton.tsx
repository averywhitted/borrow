import { useRef } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Drop-in replacement for TouchableOpacity.
 * On press: translates 4px right+down (to shadow position) and fades shadow to 0,
 * creating the illusion the button physically presses down into the surface.
 * Springs back on release.
 *
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
          // Shadow fades away as button translates to its position
          shadowOpacity: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          elevation: press.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }),
        },
      ]}
      onPressIn={(e) => {
        Animated.timing(press, { toValue: 1, duration: 60, useNativeDriver: false }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(press, { toValue: 0, speed: 20, bounciness: 4, useNativeDriver: false }).start();
        onPressOut?.(e);
      }}
      {...props}
    />
  );
}
