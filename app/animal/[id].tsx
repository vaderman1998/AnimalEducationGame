import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { animals } from '@/constants/animals';
import AnimalCard from '@/components/AnimalCard';
import { MapPin, Utensils, Info } from 'lucide-react-native';

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const animal = animals.find((a) => a.id === id);
  
  if (!animal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Animal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimalCard animal={animal} showDetails />
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Habitat</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <Text style={styles.infoText}>{animal.habitat}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Diet</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Utensils size={24} color={colors.primary} />
            </View>
            <Text style={styles.infoText}>{animal.diet}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Fun Fact</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Info size={24} color={colors.primary} />
            </View>
            <Text style={styles.infoText}>{animal.funFact}</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  image: {
    width: '100%',
    height: 300,
  },
});