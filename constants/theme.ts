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

export function getColors(isDark: boolean) {
  return isDark ? DarkColors : Colors;
}

// Only apply to interactive button elements (TouchableOpacity), not cards/containers
export const Shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
};

export const Radius = {
  card: 10,
  pill: 999,
};

export const Font = {
  regular: 'JetBrainsMono_400Regular',
  bold: 'JetBrainsMono_700Bold',
  extraBold: 'JetBrainsMono_800ExtraBold',
};
