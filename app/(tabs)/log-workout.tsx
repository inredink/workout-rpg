import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createWorkout, initializeDatabase } from '../../src/services/workoutService';
import { calculateWorkoutXp } from '../../src/services/xp';

export default function LogWorkoutScreen() {
  const [exerciseName, setExerciseName] = useState('Bench Press');
  const [sets, setSets] = useState([{ reps: '8', weight: '135' }]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    initializeDatabase();
  }, []);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    setSets((current) => current.map((set, i) => (i === index ? { ...set, [field]: value } : set)));
  };

  const addSet = () => setSets((current) => [...current, { reps: '10', weight: '0' }]);
  const removeSet = (index: number) => setSets((current) => current.filter((_, i) => i !== index));

  const saveWorkout = () => {
    const cleanExerciseName = exerciseName.trim();
    const parsedSets = sets
      .map((set) => ({
        reps: Number(set.reps || 0),
        weight: Number(set.weight || 0),
      }))
      .filter((set) => set.reps > 0);
    if (!cleanExerciseName || parsedSets.length === 0) {
      setStatus('Please add an exercise name and at least one completed set.');
      return;
    }

    const exercise = {
      id: `exercise-${Date.now()}`,
      name: cleanExerciseName,
      sets: parsedSets,
    };

    const workoutId = createWorkout({
      notes: 'Session logged from starter workflow',
      units: 'lb',
      exercises: [exercise],
    });

    const xp = calculateWorkoutXp(parsedSets.length, parsedSets.reduce((sum, set) => sum + set.reps, 0), parsedSets.reduce((sum, set) => sum + set.weight, 0));

    setStatus(`Workout saved. ${parsedSets.length} set(s) recorded. ${xp} XP awarded.`);
    setExerciseName('');
    setSets([{ reps: '8', weight: '135' }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log Workout</Text>
      <TextInput
        style={styles.input}
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="Exercise name"
        placeholderTextColor="#94a3b8"
      />

      {sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={styles.rowLabel}>Set {index + 1}</Text>
          <TextInput
            style={styles.inlineInput}
            keyboardType="numeric"
            value={set.reps}
            onChangeText={(value) => updateSet(index, 'reps', value)}
            placeholder="Reps"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={styles.inlineInput}
            keyboardType="numeric"
            value={set.weight}
            onChangeText={(value) => updateSet(index, 'weight', value)}
            placeholder="Weight"
            placeholderTextColor="#94a3b8"
          />
          {sets.length > 1 && (
            <Button title="Remove" onPress={() => removeSet(index)} />
          )}
        </View>
      ))}

      <View style={styles.buttonRow}>
        <Button title="Add Set" onPress={addSet} />
        <Button title="Save Workout" onPress={saveWorkout} />
      </View>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1120' },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#f8fafc', marginBottom: 8 },
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
  },
  setRow: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderColor: '#1f2937',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: { color: '#cbd5e1', fontSize: 12, minWidth: 48 },
  inlineInput: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    minWidth: 80,
    flex: 1,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  status: { color: '#86efac', fontSize: 14, marginTop: 8 },
});
