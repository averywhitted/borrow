import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Font, Radius, Shadow } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';

export default function ScanBarcodeScreen() {
  const [flash, setFlash] = useState(false);
  const [scanning, setScanning] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Dark camera viewport */}
      <View style={styles.camera}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Scan Barcode</Text>
          <TouchableOpacity
            style={[styles.iconButton, flash && styles.iconButtonActive]}
            onPress={() => setFlash((f) => !f)}
          >
            <MaterialIcons name={flash ? 'flash-on' : 'flash-off'} size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Scanning frame */}
        <View style={styles.frameWrapper}>
          {/* Corner brackets — neo-brutalist style */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Scan line */}
          <View style={styles.scanLine} />

          <Text style={styles.frameLabel}>
            {scanning ? 'Point at a book barcode' : 'Hold still…'}
          </Text>
        </View>

        {/* Bottom hint */}
        <View style={styles.bottomHint}>
          <MaterialIcons name="info-outline" size={14} color="rgba(255,255,255,0.5)" />
          <Text style={styles.hintText}>
            ISBN barcode is usually on the back cover
          </Text>
        </View>
      </View>

      {/* Controls bar */}
      <View style={styles.controls}>
        <AnimatedButton
          style={[styles.controlButton, Shadow]}
          onPress={() => router.replace('/add-book-manual')}
        >
          <MaterialIcons name="edit" size={18} color={Colors.black} />
          <Text style={styles.controlButtonText}>Enter Manually</Text>
        </AnimatedButton>
        <AnimatedButton
          style={[styles.controlButtonPrimary, Shadow]}
          onPress={() => {
            // Simulate a scan result and return to add-book
            router.back();
          }}
        >
          <MaterialCommunityIcons name="barcode-scan" size={18} color={Colors.white} />
          <Text style={styles.controlButtonPrimaryText}>Searching…</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const FRAME = 240;
const CORNER = 24;
const THICK = 3;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0A0A' },

  // Camera area
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },

  // Top bar
  topBar: {
    width: '100%', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBarTitle: {
    fontSize: 16, fontWeight: '700', fontFamily: Font.bold, color: Colors.white,
  },
  iconButton: {
    width: 40, height: 40, borderRadius: Radius.card,
    alignItems: 'center', justifyContent: 'center',
  },
  iconButtonActive: { backgroundColor: 'rgba(255,255,255,0.2)' },

  // Scanning frame
  frameWrapper: {
    width: FRAME, height: FRAME,
    alignItems: 'center', justifyContent: 'center',
  },
  corner: {
    position: 'absolute', width: CORNER, height: CORNER,
    borderColor: Colors.white,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: THICK, borderLeftWidth: THICK },
  cornerTR: { top: 0, right: 0, borderTopWidth: THICK, borderRightWidth: THICK },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: THICK, borderLeftWidth: THICK },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: THICK, borderRightWidth: THICK },
  scanLine: {
    width: FRAME - 20, height: 2,
    backgroundColor: Colors.teal,
    opacity: 0.9,
  },
  frameLabel: {
    position: 'absolute', bottom: -32,
    fontSize: 13, fontFamily: Font.regular,
    color: 'rgba(255,255,255,0.6)', textAlign: 'center',
  },

  // Bottom hint
  bottomHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 32,
  },
  hintText: {
    fontSize: 12, fontFamily: Font.regular,
    color: 'rgba(255,255,255,0.4)', textAlign: 'center',
  },

  // Controls
  controls: {
    flexDirection: 'row', gap: 10,
    padding: 16, borderTopWidth: 1, borderTopColor: '#222',
    backgroundColor: '#111',
  },
  controlButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.white,
    borderRadius: Radius.card, paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  controlButtonText: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  controlButtonPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.teal,
    borderRadius: Radius.card, paddingVertical: 12,
    backgroundColor: Colors.teal,
  },
  controlButtonPrimaryText: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
});
