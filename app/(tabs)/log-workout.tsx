import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { createWorkout, initializeDatabase, getPlayer, updatePlayerUnits } from '../../src/services/workoutService';
import { emit } from '../../src/services/events';

export default function LogWorkoutScreen() {
  const [exerciseName, setExerciseName] = useState('Bench Press');
  const [sets, setSets] = useState([{ reps: '8', weight: '135' }]);
  const [status, setStatus] = useState('');
  const [units, setUnits] = useState<'lb' | 'kg'>('lb');

  useEffect(() => {
    initializeDatabase();
    const player = getPlayer();
    if (player && player.units) setUnits(player.units === 'kg' ? 'kg' : 'lb');
  }, []);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    setSets((current) => current.map((set, i) => (i === index ? { ...set, [field]: value } : set)));
  };

  const addSet = () => setSets((current) => [...current, { reps: '10', weight: '0' }]);
  const removeSet = (index: number) => setSets((current) => current.filter((_, i) => i !== index));

  const changeUnits = (u: 'lb' | 'kg') => {
    setUnits(u);
    updatePlayerUnits(u);
    emit('playerUpdated');
  };

  const saveWorkout = () => {
    const cleanExerciseName = exerciseName.trim();
    const parsedSets = sets
      .map((set) => ({
        reps: Math.max(0, Math.floor(Number(set.reps || 0))),
        weight: Math.max(0, Number(set.weight || 0)),
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

    const { workoutId, xpAwarded } = createWorkout({
      notes: 'Session logged from starter workflow',
      units,
      exercises: [exercise],
    });

    // Notify other parts of the app the player was updated
    emit('playerUpdated');

    setStatus(`Workout saved. ${parsedSets.length} set(s) recorded. ${xpAwarded} XP awarded.`);
    setExerciseName('');
    setSets([{ reps: '8', weight: units === 'kg' ? '60' : '135' }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log Workout</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => changeUnits('lb')}
          style={[styles.unitButton, units === 'lb' ? styles.unitButtonActive : null]}
        >
          <Text style={units === 'lb' ? styles.unitTextActive : styles.unitText}>lb</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeUnits('kg')}
          style={[styles.unitButton, units === 'kg' ? styles.unitButtonActive : null]}
        >
          <Text style={units === 'kg' ? styles.unitTextActive : styles.unitText}>kg</Text>
        </TouchableOpacity>
      </View>

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
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
  },
  unitButtonActive: { backgroundColor: '#1f2937', borderColor: '#60a5fa' },
  unitText: { color: '#9ca3af' },
  unitTextActive: { color: '#dbeafe', fontWeight: '700' },
});
