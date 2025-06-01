import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { animals, Animal } from '@/constants/animals';
import AnimalCard from '@/components/AnimalCard';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { TextInput } from 'react-native';

type CategoryFilter = 'all' | 'mammal' | 'bird' | 'reptile' | 'fish' | 'amphibian' | 'insect';

export default function LearnScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const handleAnimalPress = (animal: Animal) => {
    router.push(`/animal/${animal.id}`);
  };

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || animal.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories: CategoryFilter[] = ['all', 'mammal', 'bird', 'reptile', 'fish', 'amphibian', 'insect'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Discover Animals</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search animals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                categoryFilter === category && styles.categoryButtonActive,
              ]}
              onPress={() => setCategoryFilter(category)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  categoryFilter === category && styles.categoryButtonTextActive,
                ]}
              >
                {category === 'all' ? 'All' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
            <AnimalCard 
              key={animal.id} 
              animal={animal} 
              onPress={() => handleAnimalPress(animal)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Filter size={48} color={`${colors.textLight}80`} />
            <Text style={styles.emptyText}>No animals found</Text>
            <Text style={styles.emptySubtext}>Try changing your search or filter</Text>
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    color: colors.textLight,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});