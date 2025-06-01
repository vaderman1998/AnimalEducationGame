import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { animals, Animal } from '@/constants/animals';
import { useGameStore } from '@/hooks/useGameStore';
import ConfettiEffect from '@/components/ConfettiEffect';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Image } from 'expo-image';
import { RefreshCw, Clock } from 'lucide-react-native';
import ProgressBar from '@/components/ProgressBar';

type AnimalToSort = Animal & {
  sorted: boolean;
  correctCategory: boolean;
};

type Category = 'mammal' | 'bird' | 'reptile' | 'fish' | 'amphibian' | 'insect';

export default function SortingGameScreen() {
  const [animalsToSort, setAnimalsToSort] = useState<AnimalToSort[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalToSort | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds game
  const [gameActive, setGameActive] = useState(false);
  
  const { 
    incrementGamesPlayed, 
    incrementCorrectAnswers, 
    incrementIncorrectAnswers,
    discoverAnimal
  } = useGameStore();

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const initializeGame = () => {
    // Select random animals
    const shuffledAnimals = [...animals]
      .sort(() => 0.5 - Math.random())
      .slice(0, 12)
      .map(animal => ({
        ...animal,
        sorted: false,
        correctCategory: false,
      }));
    
    setAnimalsToSort(shuffledAnimals);
    setSelectedAnimal(null);
    setScore(0);
    setGameComplete(false);
    setTimeLeft(60);
    setGameActive(true);
  };

  const endGame = () => {
    setGameActive(false);
    setGameComplete(true);
    incrementGamesPlayed();
  };

  const handleAnimalSelect = (animal: AnimalToSort) => {
    if (!gameActive || animal.sorted) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedAnimal(animal);
  };

  const handleCategorySelect = (category: Category) => {
    if (!selectedAnimal || !gameActive) return;
    
    const isCorrect = selectedAnimal.category === category;
    
    // Update animal as sorted
    setAnimalsToSort(prev => 
      prev.map(animal => 
        animal.id === selectedAnimal.id
          ? { ...animal, sorted: true, correctCategory: isCorrect }
          : animal
      )
    );
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 10);
      incrementCorrectAnswers();
      discoverAnimal(selectedAnimal.id);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      incrementIncorrectAnswers();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
    
    setSelectedAnimal(null);
    
    // Check if all animals are sorted
    const allSorted = animalsToSort.every(animal => 
      animal.id === selectedAnimal.id ? true : animal.sorted
    );
    
    if (allSorted) {
      endGame();
    }
  };

  const categories: Category[] = ['mammal', 'bird', 'reptile', 'fish', 'amphibian', 'insect'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Clock size={20} color={timeLeft < 10 ? colors.error : colors.text} />
          <Text 
            style={[
              styles.timerText,
              timeLeft < 10 && styles.timerWarning
            ]}
          >
            {timeLeft}s
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>
      
      <Text style={styles.instructionText}>
        {selectedAnimal 
          ? 'Select the correct category for this animal:' 
          : 'Tap on an animal to sort it into the correct category'}
      </Text>
      
      {selectedAnimal ? (
        <View style={styles.selectedAnimalContainer}>
          <Image
            source={selectedAnimal.imageUrl}
            style={styles.selectedAnimalImage}
            contentFit="cover"
          />
          <Text style={styles.selectedAnimalName}>{selectedAnimal.name}</Text>
          
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryButton}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.animalsGrid}
          showsVerticalScrollIndicator={false}
        >
          {animalsToSort.map((animal) => (
            <TouchableOpacity
              key={animal.id}
              style={[
                styles.animalCard,
                animal.sorted && (
                  animal.correctCategory 
                    ? styles.animalCardCorrect 
                    : styles.animalCardIncorrect
                ),
              ]}
              onPress={() => handleAnimalSelect(animal)}
              disabled={animal.sorted}
            >
              <Image
                source={animal.imageUrl}
                style={styles.animalImage}
                contentFit="cover"
              />
              <Text 
                style={[
                  styles.animalName,
                  animal.sorted && (
                    animal.correctCategory 
                      ? styles.animalNameCorrect 
                      : styles.animalNameIncorrect
                  ),
                ]}
              >
                {animal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={initializeGame}
      >
        <RefreshCw size={20} color="white" />
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
      
      {gameComplete && (
        <View style={styles.gameCompleteOverlay}>
          <View style={styles.gameCompleteCard}>
            <Text style={styles.gameCompleteTitle}>Game Complete!</Text>
            <Text style={styles.gameCompleteScore}>Score: {score}</Text>
            <Text style={styles.gameCompleteMessage}>
              {score >= 100
                ? 'Amazing! You are a sorting master!'
                : score >= 70
                ? 'Great job! You know your animal categories!'
                : score >= 40
                ? 'Good effort! Keep learning about animals!'
                : 'Keep practicing to learn more about animal categories!'}
            </Text>
            <TouchableOpacity 
              style={styles.playAgainButton}
              onPress={initializeGame}
            >
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
          <ConfettiEffect visible={gameComplete && score >= 70} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  timerWarning: {
    color: colors.error,
  },
  scoreContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animalCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  animalCardCorrect: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  animalCardIncorrect: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  animalImage: {
    width: '100%',
    height: 150,
  },
  animalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    padding: 8,
    textAlign: 'center',
  },
  animalNameCorrect: {
    color: colors.success,
  },
  animalNameIncorrect: {
    color: colors.error,
  },
  selectedAnimalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectedAnimalImage: {
    width: '80%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedAnimalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  categoriesContainer: {
    width: '100%',
  },
  categoryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    alignSelf: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gameCompleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gameCompleteCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gameCompleteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  gameCompleteScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  gameCompleteMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  playAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});