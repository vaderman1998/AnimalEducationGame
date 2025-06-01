import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { GameType } from '@/constants/gameTypes';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Grid, HelpCircle, Move } from 'lucide-react-native';

type GameCardProps = {
  game: GameType;
};

export default function GameCard({ game }: GameCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(game.route);
  };

  const renderIcon = () => {
    switch (game.icon) {
      case 'grid':
        return <Grid size={24} color={colors.primary} />;
      case 'help-circle':
        return <HelpCircle size={24} color={colors.primary} />;
      case 'move':
        return <Move size={24} color={colors.primary} />;
      default:
        return <Grid size={24} color={colors.primary} />;
    }
  };

  const getDifficultyColor = () => {
    switch (game.difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.accent;
      case 'hard':
        return colors.error;
      default:
        return colors.accent;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{game.name}</Text>
        <Text style={styles.description}>{game.description}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>{game.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});