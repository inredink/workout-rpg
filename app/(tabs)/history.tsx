import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { initializeDatabase, getWorkouts } from '../../src/services/workoutService';

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    initializeDatabase();
    setWorkouts(getWorkouts());
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Workout History</Text>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.cardText}>{item.exercises.length} exercise(s)</Text>
              <Text style={styles.cardText}>{item.notes}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No workouts saved yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b1120' },
  container: { flex: 1, padding: 20 },
  title: { color: '#f8fafc', fontSize: 26, fontWeight: '700', marginBottom: 16 },
  card: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#cbd5e1', fontSize: 13 },
  empty: { color: '#94a3b8', fontSize: 14 },
});
