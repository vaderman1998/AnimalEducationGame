import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { useGameStore } from '@/hooks/useGameStore';
import ProgressBar from '@/components/ProgressBar';
import { animals } from '@/constants/animals';
import { Award, Brain, Target, Zap } from 'lucide-react-native';

export default function AchievementsScreen() {
  const stats = useGameStore((state) => state.stats);
  
  // Calculate percentages
  const animalsDiscoveredPercentage = stats.animalsDiscovered.length / animals.length;
  const correctAnswerPercentage = stats.correctAnswers / (stats.correctAnswers + stats.incorrectAnswers || 1);
  
  // Define achievements
  const achievements = [
    {
      id: 'games_played',
      title: 'Game Explorer',
      description: 'Play 10 games',
      progress: Math.min(stats.gamesPlayed / 10, 1),
      icon: <Zap size={24} color={colors.primary} />,
      completed: stats.gamesPlayed >= 10,
    },
    {
      id: 'animals_discovered',
      title: 'Animal Enthusiast',
      description: `Discover ${animals.length} animals`,
      progress: animalsDiscoveredPercentage,
      icon: <Target size={24} color={colors.secondary} />,
      completed: stats.animalsDiscovered.length >= animals.length,
    },
    {
      id: 'correct_answers',
      title: 'Knowledge Master',
      description: 'Get 20 correct answers',
      progress: Math.min(stats.correctAnswers / 20, 1),
      icon: <Brain size={24} color={colors.accent} />,
      completed: stats.correctAnswers >= 20,
    },
    {
      id: 'memory_score',
      title: 'Memory Champion',
      description: 'Score 10 points in Memory Match',
      progress: Math.min(stats.memoryHighScore / 10, 1),
      icon: <Award size={24} color={colors.success} />,
      completed: stats.memoryHighScore >= 10,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct Answers</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.animalsDiscovered.length}/{animals.length}</Text>
              <Text style={styles.statLabel}>Animals Discovered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(correctAnswerPercentage * 100)}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <View style={styles.achievementIconContainer}>
                {achievement.icon}
              </View>
              <View style={styles.achievementTitleContainer}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              {achievement.completed && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}
            </View>
            
            <ProgressBar 
              progress={achievement.progress} 
              color={achievement.completed ? colors.success : colors.primary}
              height={8}
              showPercentage
            />
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>High Scores</Text>
        
        <View style={styles.highScoresCard}>
          <View style={styles.highScoreItem}>
            <Text style={styles.highScoreLabel}>Memory Match</Text>
            <Text style={styles.highScoreValue}>{stats.memoryHighScore}</Text>
          </View>
          <View style={styles.highScoreDivider} />
          <View style={styles.highScoreItem}>
            <Text style={styles.highScoreLabel}>Animal Quiz</Text>
            <Text style={styles.highScoreValue}>{stats.quizHighScore}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  achievementCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTitleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  completedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  highScoresCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  highScoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  highScoreLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  highScoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  highScoreDivider: {
    width: 1,
    height: '80%',
    backgroundColor: `${colors.textLight}30`,
    marginHorizontal: 8,
  },
});