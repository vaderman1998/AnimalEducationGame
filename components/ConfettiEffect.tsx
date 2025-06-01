import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONFETTI_COLORS = [colors.primary, colors.secondary, colors.accent, colors.success];
const CONFETTI_COUNT = 50;

type ConfettiPieceProps = {
  color: string;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
};

const ConfettiPiece = ({ color, x, y, rotation, scale }: ConfettiPieceProps) => {
  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          transform: [
            { translateX: x },
            { translateY: y },
            { rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            },
            { scale },
          ],
        },
      ]}
    />
  );
};

type ConfettiEffectProps = {
  visible: boolean;
  duration?: number;
};

export default function ConfettiEffect({ visible, duration = 2000 }: ConfettiEffectProps) {
  const confettiPieces = useRef<Array<{
    color: string;
    x: Animated.Value;
    y: Animated.Value;
    rotation: Animated.Value;
    scale: Animated.Value;
  }>>([]);

  // Initialize confetti pieces
  useEffect(() => {
    if (visible && confettiPieces.current.length === 0) {
      for (let i = 0; i < CONFETTI_COUNT; i++) {
        confettiPieces.current.push({
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          x: new Animated.Value(Math.random() * SCREEN_WIDTH),
          y: new Animated.Value(-20),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(Math.random() * 0.5 + 0.5),
        });
      }
    }
  }, [visible]);

  // Animate confetti
  useEffect(() => {
    if (visible) {
      const animations = confettiPieces.current.map((piece) => {
        const xDestination = piece.x._value + (Math.random() * 200 - 100);
        
        return Animated.parallel([
          Animated.timing(piece.y, {
            toValue: SCREEN_HEIGHT + 20,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(piece.x, {
            toValue: xDestination,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: 1,
            duration: duration * (0.5 + Math.random() * 0.5),
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(50, animations).start();
    }
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece, index) => (
        <ConfettiPiece key={index} {...piece} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});