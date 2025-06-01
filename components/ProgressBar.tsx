import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

type ProgressBarProps = {
  progress: number; // 0 to 1
  label?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
};

export default function ProgressBar({
  progress,
  label,
  color = colors.primary,
  height = 8,
  showPercentage = false,
}: ProgressBarProps) {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressContainer, { height }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${percentage}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
      {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  progressContainer: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
});