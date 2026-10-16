import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getFactionCatalog } from '../../src/services/factionService';
import { updatePlayerFaction } from '../../src/services/workoutService';
import { Faction } from '../../src/types';

export default function FactionsScreen() {
  const [query, setQuery] = useState('');
  const [factions, setFactions] = useState<Faction[]>([]);

  useEffect(() => {
    setFactions(getFactionCatalog());
  }, []);

  const filtered = factions.filter((item) => {
    const text = `${item.name} ${item.faction}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const selectFaction = (id: string) => {
    updatePlayerFaction(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Factions</Text>
        <TextInput
          style={styles.input}
          value={query}
          placeholder="Search factions"
          placeholderTextColor="#94a3b8"
          onChangeText={setQuery}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => selectFaction(item.id)} activeOpacity={0.8}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>{item.faction}</Text>
              <Text style={styles.cardText}>{item.rankLadder.join(' • ')}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b1120' },
  container: { flex: 1, padding: 20 },
  title: { color: '#f8fafc', fontSize: 26, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    color: '#f8fafc',
    padding: 12,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  cardTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#cbd5e1', fontSize: 13, marginTop: 2 },
});
