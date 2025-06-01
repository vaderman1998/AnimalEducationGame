import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { animals, Animal } from '@/constants/animals';
import { useGameStore } from '@/hooks/useGameStore';
import ConfettiEffect from '@/components/ConfettiEffect';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react-native';
import ProgressBar from '@/components/ProgressBar';

type QuestionType = 
  | 'image-identification' 
  | 'diet' 
  | 'habitat' 
  | 'category' 
  | 'fact-true-false'
  | 'comparison'
  | 'habitat-match';

type Question = {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  options: string[];
  animal: Animal;
  imageUrl?: number;
  secondAnimal?: Animal;
};

export default function QuizGameScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const { 
    incrementGamesPlayed, 
    incrementCorrectAnswers, 
    incrementIncorrectAnswers,
    updateQuizHighScore,
    discoverAnimal
  } = useGameStore();

  // Initialize quiz
  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = () => {
    // Get a random subset of animals to use for the quiz
    const shuffledAnimals = [...animals].sort(() => 0.5 - Math.random());
    const quizQuestions: Question[] = [];
    
    // Generate 10 questions with different types
    for (let i = 0; i < 10; i++) {
      // Use modulo to cycle through question types
      const questionType = getRandomQuestionType();
      const animal = shuffledAnimals[i % shuffledAnimals.length];
      
      switch (questionType) {
        case 'image-identification':
          quizQuestions.push(createImageIdentificationQuestion(animal, i, shuffledAnimals));
          break;
        case 'diet':
          quizQuestions.push(createDietQuestion(animal, i));
          break;
        case 'habitat':
          quizQuestions.push(createHabitatQuestion(animal, i, shuffledAnimals));
          break;
        case 'category':
          quizQuestions.push(createCategoryQuestion(animal, i));
          break;
        case 'fact-true-false':
          quizQuestions.push(createFactTrueFalseQuestion(animal, i, shuffledAnimals));
          break;
        case 'comparison':
          quizQuestions.push(createComparisonQuestion(animal, i, shuffledAnimals));
          break;
        case 'habitat-match':
          quizQuestions.push(createHabitatMatchQuestion(animal, i, shuffledAnimals));
          break;
      }
    }
    
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuizComplete(false);
  };

  const getRandomQuestionType = (): QuestionType => {
    const types: QuestionType[] = [
      'image-identification', 
      'diet', 
      'habitat', 
      'category', 
      'fact-true-false',
      'comparison',
      'habitat-match'
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  const createImageIdentificationQuestion = (animal: Animal, index: number, allAnimals: Animal[]): Question => {
    // Get 3 random animals different from the current one
    const otherAnimals = getRandomAnimals(animal, 3, allAnimals);
    
    return {
      id: `q${index}`,
      type: 'image-identification',
      question: 'What animal is this?',
      correctAnswer: animal.name,
      options: shuffleArray([animal.name, ...otherAnimals.map(a => a.name)]),
      animal,
      imageUrl: animal.imageUrl
    };
  };

  const createDietQuestion = (animal: Animal, index: number): Question => {
    const allDiets = ['Herbivore', 'Carnivore', 'Omnivore', 'Insectivore'];
    const otherDiets = allDiets.filter(diet => diet !== animal.diet);
    
    return {
      id: `q${index}`,
      type: 'diet',
      question: `What is the diet of a ${animal.name}?`,
      correctAnswer: animal.diet,
      options: shuffleArray([animal.diet, ...shuffleArray(otherDiets).slice(0, 3)]),
      animal
    };
  };

  const createHabitatQuestion = (animal: Animal, index: number, allAnimals: Animal[]): Question => {
    // Get habitats from other animals
    const otherHabitats = allAnimals
      .filter(a => a.id !== animal.id && !a.habitat.includes(animal.habitat.split(',')[0].trim()))
      .map(a => a.habitat.split(',')[0].trim())
      .filter((habitat, i, self) => self.indexOf(habitat) === i) // Remove duplicates
      .slice(0, 3);
    
    return {
      id: `q${index}`,
      type: 'habitat',
      question: `Where does a ${animal.name} typically live?`,
      correctAnswer: animal.habitat.split(',')[0].trim(),
      options: shuffleArray([animal.habitat.split(',')[0].trim(), ...otherHabitats.slice(0, 3)]),
      animal
    };
  };

  const createCategoryQuestion = (animal: Animal, index: number): Question => {
    const allCategories = ['mammal', 'bird', 'reptile', 'fish', 'amphibian', 'insect'];
    const otherCategories = allCategories.filter(category => category !== animal.category);
    
    return {
      id: `q${index}`,
      type: 'category',
      question: `Which category does a ${animal.name} belong to?`,
      correctAnswer: animal.category,
      options: shuffleArray([animal.category, ...shuffleArray(otherCategories).slice(0, 3)]),
      animal
    };
  };

  const createFactTrueFalseQuestion = (animal: Animal, index: number, allAnimals: Animal[]): Question => {
    // 50% chance of true or false question
    const isTrueQuestion = Math.random() > 0.5;
    
    if (isTrueQuestion) {
      return {
        id: `q${index}`,
        type: 'fact-true-false',
        question: `True or False: ${animal.funFact}`,
        correctAnswer: 'True',
        options: ['True', 'False'],
        animal
      };
    } else {
      // Get a random animal different from the current one
      const otherAnimal = getRandomAnimals(animal, 1, allAnimals)[0];
      
      return {
        id: `q${index}`,
        type: 'fact-true-false',
        question: `True or False: ${animal.name}s ${otherAnimal.funFact.substring(otherAnimal.funFact.indexOf(' ') + 1)}`,
        correctAnswer: 'False',
        options: ['True', 'False'],
        animal
      };
    }
  };

  const createComparisonQuestion = (animal: Animal, index: number, allAnimals: Animal[]): Question => {
    // Get a random animal with a different category
    const otherAnimals = allAnimals.filter(a => a.category !== animal.category);
    const otherAnimal = otherAnimals[Math.floor(Math.random() * otherAnimals.length)];
    
    // Create a comparison question
    const isFirstAnimal = Math.random() > 0.5;
    const correctAnswer = isFirstAnimal ? animal.name : otherAnimal.name;
    
    let question = '';
    if (animal.category === 'mammal' && otherAnimal.category === 'bird') {
      question = `Which animal can fly?`;
      return {
        id: `q${index}`,
        type: 'comparison',
        question,
        correctAnswer: otherAnimal.name,
        options: [animal.name, otherAnimal.name],
        animal,
        secondAnimal: otherAnimal
      };
    } else if (animal.category === 'bird' && otherAnimal.category === 'mammal') {
      question = `Which animal can fly?`;
      return {
        id: `q${index}`,
        type: 'comparison',
        question,
        correctAnswer: animal.name,
        options: [animal.name, otherAnimal.name],
        animal,
        secondAnimal: otherAnimal
      };
    } else if (animal.diet === 'Herbivore' && otherAnimal.diet === 'Carnivore') {
      question = `Which animal eats meat?`;
      return {
        id: `q${index}`,
        type: 'comparison',
        question,
        correctAnswer: otherAnimal.name,
        options: [animal.name, otherAnimal.name],
        animal,
        secondAnimal: otherAnimal
      };
    } else if (animal.diet === 'Carnivore' && otherAnimal.diet === 'Herbivore') {
      question = `Which animal eats plants?`;
      return {
        id: `q${index}`,
        type: 'comparison',
        question,
        correctAnswer: otherAnimal.name,
        options: [animal.name, otherAnimal.name],
        animal,
        secondAnimal: otherAnimal
      };
    } else {
      // Default comparison
      question = `Which animal is a ${isFirstAnimal ? animal.category : otherAnimal.category}?`;
      return {
        id: `q${index}`,
        type: 'comparison',
        question,
        correctAnswer,
        options: [animal.name, otherAnimal.name],
        animal,
        secondAnimal: otherAnimal
      };
    }
  };

  const createHabitatMatchQuestion = (animal: Animal, index: number, allAnimals: Animal[]): Question => {
    // Get animals with different habitats
    const habitatTypes = ['forest', 'ocean', 'desert', 'grassland', 'arctic', 'rainforest', 'savanna'];
    
    // Find the primary habitat of the animal
    const primaryHabitat = animal.habitat.toLowerCase().split(',')[0].trim();
    let matchingHabitat = '';
    
    for (const habitat of habitatTypes) {
      if (primaryHabitat.includes(habitat)) {
        matchingHabitat = habitat;
        break;
      }
    }
    
    if (!matchingHabitat) {
      // Fallback if no matching habitat found
      return createCategoryQuestion(animal, index);
    }
    
    // Find other animals that share this habitat
    const animalsWithSameHabitat = allAnimals.filter(a => 
      a.id !== animal.id && 
      a.habitat.toLowerCase().includes(matchingHabitat)
    );
    
    if (animalsWithSameHabitat.length === 0) {
      // Fallback if no animals with same habitat
      return createCategoryQuestion(animal, index);
    }
    
    // Get animals with different habitats
    const animalsWithDifferentHabitat = allAnimals.filter(a => 
      !a.habitat.toLowerCase().includes(matchingHabitat)
    );
    
    if (animalsWithDifferentHabitat.length < 3) {
      // Fallback if not enough animals with different habitats
      return createCategoryQuestion(animal, index);
    }
    
    // Select one animal with same habitat and three with different habitats
    const sameHabitatAnimal = animalsWithSameHabitat[Math.floor(Math.random() * animalsWithSameHabitat.length)];
    const differentHabitatAnimals = shuffleArray(animalsWithDifferentHabitat).slice(0, 3);
    
    return {
      id: `q${index}`,
      type: 'habitat-match',
      question: `Which animal shares the same habitat as the ${animal.name}?`,
      correctAnswer: sameHabitatAnimal.name,
      options: shuffleArray([sameHabitatAnimal.name, ...differentHabitatAnimals.map(a => a.name)]),
      animal,
      imageUrl: animal.imageUrl
    };
  };

  const getRandomAnimals = (excludeAnimal: Animal, count: number, sourceAnimals: Animal[] = animals): Animal[] => {
    const filteredAnimals = sourceAnimals.filter(a => a.id !== excludeAnimal.id);
    return shuffleArray([...filteredAnimals]).slice(0, count);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => 0.5 - Math.random());
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 10);
      incrementCorrectAnswers();
      discoverAnimal(currentQuestion.animal.id);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      incrementIncorrectAnswers();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Quiz complete
      setQuizComplete(true);
      incrementGamesPlayed();
      updateQuizHighScore(score);
    }
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <ProgressBar progress={progress} color={colors.primary} height={8} />
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {currentQuestion.imageUrl && (
            <Image
              source={currentQuestion.imageUrl}
              style={styles.questionImage}
              contentFit="cover"
            />
          )}
          
          {currentQuestion.type === 'comparison' && currentQuestion.secondAnimal && (
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonItem}>
                <Image
                  source={currentQuestion.animal.imageUrl}
                  style={styles.comparisonImage}
                  contentFit="cover"
                />
                <Text style={styles.comparisonName}>{currentQuestion.animal.name}</Text>
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={currentQuestion.secondAnimal.imageUrl}
                  style={styles.comparisonImage}
                  contentFit="cover"
                />
                <Text style={styles.comparisonName}>{currentQuestion.secondAnimal.name}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && 
                    (option === currentQuestion.correctAnswer 
                      ? styles.correctOption 
                      : styles.incorrectOption),
                  selectedAnswer !== null && 
                    option === currentQuestion.correctAnswer && 
                    styles.correctOption,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <Text 
                  style={[
                    styles.optionText,
                    (selectedAnswer === option && option === currentQuestion.correctAnswer) || 
                    (selectedAnswer !== null && option === currentQuestion.correctAnswer)
                      ? styles.correctOptionText
                      : selectedAnswer === option
                        ? styles.incorrectOptionText
                        : null,
                  ]}
                >
                  {option}
                </Text>
                
                {selectedAnswer !== null && option === currentQuestion.correctAnswer && (
                  <CheckCircle size={20} color={colors.success} style={styles.optionIcon} />
                )}
                
                {selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <XCircle size={20} color={colors.error} style={styles.optionIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {selectedAnswer !== null && (
          <View style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackText,
              isCorrect ? styles.correctFeedbackText : styles.incorrectFeedbackText
            ]}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </Text>
            
            {!isCorrect && (
              <Text style={styles.correctAnswerText}>
                The correct answer is: {currentQuestion.correctAnswer}
              </Text>
            )}
            
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Text>
              <ArrowRight size={20} color="white" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={generateQuiz}
      >
        <RefreshCw size={20} color="white" />
        <Text style={styles.resetButtonText}>Reset Quiz</Text>
      </TouchableOpacity>
      
      {quizComplete && (
        <View style={styles.quizCompleteOverlay}>
          <View style={styles.quizCompleteCard}>
            <Text style={styles.quizCompleteTitle}>Quiz Complete!</Text>
            <Text style={styles.quizCompleteScore}>Your Score: {score}/{questions.length * 10}</Text>
            <Text style={styles.quizCompleteMessage}>
              {score === questions.length * 10
                ? 'Perfect! You are an animal expert!'
                : score >= questions.length * 7
                ? 'Great job! You know a lot about animals!'
                : score >= questions.length * 5
                ? 'Good effort! Keep learning about animals!'
                : 'Keep practicing to learn more about animals!'}
            </Text>
            <TouchableOpacity 
              style={styles.playAgainButton}
              onPress={generateQuiz}
            >
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
          <ConfettiEffect visible={quizComplete && score >= questions.length * 7} />
        </View>
      )}
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
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
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
  questionContainer: {
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
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  questionImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  comparisonImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  comparisonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  correctOption: {
    backgroundColor: `${colors.success}20`,
    borderColor: colors.success,
    borderWidth: 1,
  },
  incorrectOption: {
    backgroundColor: `${colors.error}20`,
    borderColor: colors.error,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  correctOptionText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  incorrectOptionText: {
    color: colors.error,
  },
  optionIcon: {
    marginLeft: 8,
  },
  feedbackContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  correctFeedbackText: {
    color: colors.success,
  },
  incorrectFeedbackText: {
    color: colors.error,
  },
  correctAnswerText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quizCompleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  quizCompleteCard: {
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
  quizCompleteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  quizCompleteScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  quizCompleteMessage: {
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