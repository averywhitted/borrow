export const Colors = {
  teal: '#237490',
  purple: '#8F52E0',
  gray: '#737373',
  lightGray: '#D9D9D9',
  black: '#000000',
  white: '#FFFFFF',
  background: '#FFFFFF',
};

export const DarkColors = {
  teal: '#3AABCC',
  purple: '#B07EED',
  gray: '#909090',
  lightGray: '#3C3C3C',
  black: '#E8E8E8',
  white: '#1C1C1C',
  background: '#141414',
};

// Only apply to interactive button elements (TouchableOpacity), not cards/containers
export const Shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
};

export const DarkShadow = {
  shadowColor: '#FFFFFF',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 0,
  elevation: 4,
};

export function getShadow(isDark: boolean) {
  return isDark ? DarkShadow : Shadow;
}

export function getColors(isDark: boolean) {
  const colors = isDark ? DarkColors : Colors;
  const shadow = isDark ? DarkShadow : Shadow;
  const pillActive = isDark ? '#666' : '#333';
  return { ...colors, shadow, pillActive };
}

export const Radius = {
  card: 10,
  pill: 999,
};

export const Font = {
  regular: 'JetBrainsMono_400Regular',
  bold: 'JetBrainsMono_700Bold',
  extraBold: 'JetBrainsMono_800ExtraBold',
};
