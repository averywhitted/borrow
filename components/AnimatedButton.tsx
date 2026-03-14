import { useRef, useState } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Applied over the button style on press to make the shadow vanish
const SHADOW_PRESSED = {
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  elevation: 0,
};

/**
 * Drop-in replacement for TouchableOpacity.
 * On press: translates 4px right+down to the shadow position AND fades the
 * shadow to zero, so the button appears to physically sink into the surface.
 * Springs back with shadow on release.
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
  const [pressed, setPressed] = useState(false);

  return (
    <AnimatedTouchable
      activeOpacity={0.95}
      style={[
        style,
        // Override shadow to zero when pressed (non-animated, safe with useNativeDriver:true)
        pressed ? SHADOW_PRESSED : undefined,
        {
          transform: [
            { translateX: press.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
            { translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
          ],
        },
      ]}
      onPressIn={(e) => {
        setPressed(true);
        Animated.timing(press, { toValue: 1, duration: 60, useNativeDriver: true }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        Animated.spring(press, { toValue: 0, speed: 20, bounciness: 4, useNativeDriver: true }).start();
        onPressOut?.(e);
      }}
      {...props}
    />
  );
}
