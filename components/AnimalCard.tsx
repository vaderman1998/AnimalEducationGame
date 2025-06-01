import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Animal } from '@/constants/animals';
import { useGameStore } from '@/hooks/useGameStore';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type AnimalCardProps = {
  animal: Animal;
  onPress?: () => void;
  showDetails?: boolean;
};

export default function AnimalCard({ animal, onPress, showDetails = false }: AnimalCardProps) {
  const discoverAnimal = useGameStore((state) => state.discoverAnimal);
  const animalsDiscovered = useGameStore((state) => state.stats.animalsDiscovered);
  const isDiscovered = animalsDiscovered.includes(animal.id);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!isDiscovered) {
      discoverAnimal(animal.id);
    }
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={animal.imageUrl}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{animal.name}</Text>
        <Text style={styles.category}>{animal.category}</Text>
        
        {showDetails && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Habitat:</Text>
              <Text style={styles.detailValue}>{animal.habitat}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Diet:</Text>
              <Text style={styles.detailValue}>{animal.diet}</Text>
            </View>
            <View style={styles.funFactContainer}>
              <Text style={styles.funFactLabel}>Fun Fact:</Text>
              <Text style={styles.funFactText}>{animal.funFact}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.primary,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    width: 70,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  funFactContainer: {
    backgroundColor: `${colors.accent}20`,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  funFactLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
});