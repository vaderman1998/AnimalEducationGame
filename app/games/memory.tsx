import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { animals } from '@/constants/animals';
import { useGameStore } from '@/hooks/useGameStore';
import ConfettiEffect from '@/components/ConfettiEffect';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Image } from 'expo-image';
import { RefreshCw } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 64) / 4;
const CARD_MARGIN = 4;

type MemoryCard = {
  id: string;
  animalId: string;
  imageUrl: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryGameScreen() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  const { 
    incrementGamesPlayed, 
    incrementCorrectAnswers, 
    incrementIncorrectAnswers,
    updateMemoryHighScore,
    discoverAnimal
  } = useGameStore();

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.animalId === secondCard.animalId) {
        // Match found
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setScore(prev => prev + 10);
        incrementCorrectAnswers();
        discoverAnimal(firstCard.animalId);
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        // No match
        incrementIncorrectAnswers();
        setScore(prev => Math.max(0, prev - 2));
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        
        // Flip cards back after a delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              flippedCards.includes(card.id) && !card.isMatched
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
      
      setMoves(prev => prev + 1);
      setFlippedCards([]);
      
      // Check if game is complete
      if (matchedPairs === 7) { // 8 pairs total, but we check before the state updates
        setGameComplete(true);
        incrementGamesPlayed();
        updateMemoryHighScore(score);
      }
    }
  }, [flippedCards]);

  const initializeGame = () => {
    // Select 8 random animals
    const shuffledAnimals = [...animals].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    // Create pairs
    let cardPairs: MemoryCard[] = [];
    shuffledAnimals.forEach(animal => {
      // Create two cards for each animal
      for (let i = 0; i < 2; i++) {
        cardPairs.push({
          id: `${animal.id}-${i}`,
          animalId: animal.id,
          imageUrl: animal.imageUrl,
          isFlipped: false,
          isMatched: false,
        });
      }
    });
    
    // Shuffle the cards
    cardPairs = cardPairs.sort(() => 0.5 - Math.random());
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setGameComplete(false);
  };

  const handleCardPress = (cardId: string) => {
    // Ignore if already two cards flipped or this card is already flipped/matched
    if (
      flippedCards.length === 2 || 
      flippedCards.includes(cardId) ||
      cards.find(card => card.id === cardId)?.isFlipped ||
      cards.find(card => card.id === cardId)?.isMatched
    ) {
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId
          ? { ...card, isFlipped: true }
          : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, cardId]);
  };

  const renderCard = (card: MemoryCard) => {
    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.card,
          card.isFlipped && styles.cardFlipped,
          card.isMatched && styles.cardMatched,
        ]}
        onPress={() => handleCardPress(card.id)}
        disabled={card.isFlipped || card.isMatched}
        activeOpacity={0.8}
      >
        {card.isFlipped || card.isMatched ? (
          <Image
            source={card.imageUrl}
            style={styles.cardImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.cardBack}>
            <Text style={styles.cardBackText}>?</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.movesContainer}>
          <Text style={styles.movesLabel}>Moves</Text>
          <Text style={styles.movesValue}>{moves}</Text>
        </View>
      </View>
      
      <View style={styles.gameBoard}>
        {cards.map(card => renderCard(card))}
      </View>
      
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
            <Text style={styles.gameCompleteMoves}>Moves: {moves}</Text>
            <TouchableOpacity 
              style={styles.playAgainButton}
              onPress={initializeGame}
            >
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
          <ConfettiEffect visible={gameComplete} />
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
  movesContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  movesLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  movesValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardFlipped: {
    backgroundColor: colors.card,
  },
  cardMatched: {
    backgroundColor: `${colors.success}20`,
    borderColor: colors.success,
    borderWidth: 2,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardImage: {
    width: '100%',
    height: '100%',
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
    color: colors.text,
    marginBottom: 8,
  },
  gameCompleteMoves: {
    fontSize: 18,
    color: colors.text,
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