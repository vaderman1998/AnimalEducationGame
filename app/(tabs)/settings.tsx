import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { useGameStore } from '@/hooks/useGameStore';
import { RefreshCw, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { resetStats } = useGameStore();

  const handleResetStats = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: resetStats,
          style: 'destructive',
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Animal Explorer',
      "Animal Explorer is an educational game designed to help children learn about animals in a fun and interactive way.\n\nVersion 1.0.0",
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>
        
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.card} onPress={handleResetStats}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <RefreshCw size={24} color={colors.error} />
              <Text style={[styles.settingLabel, { color: colors.error }]}>Reset Progress</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.card} onPress={handleAbout}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Info size={24} color={colors.primary} />
              <Text style={styles.settingLabel}>About Animal Explorer</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
});