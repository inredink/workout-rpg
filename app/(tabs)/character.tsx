import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getOrCreatePlayer, getPlayerFaction } from '../../src/services/workoutService';
import { Faction } from '../../src/types';
import { getFactionCatalog } from '../../src/services/factionService';

export default function CharacterScreen() {
  const [player, setPlayer] = useState<any>(null);
  const [faction, setFaction] = useState<Faction | null>(null);

  useEffect(() => {
    const data = getOrCreatePlayer();
    setPlayer(data);
    const catalog = getFactionCatalog();
    const selected = catalog.find((item) => item.id === data.factionId) ?? catalog[0];
    setFaction(selected ?? null);
  }, []);

  if (!player || !faction) {
    return <SafeAreaView style={styles.safeArea}><Text style={styles.text}>Loading character...</Text></SafeAreaView>;
  }

  const progress = Math.min((player.xp / Math.max(player.level * 100, 1)) * 100, 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.portrait}>
            <Text style={styles.portraitText}>{faction.name.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.identityWrap}>
            <Text style={styles.title}>{player.name}</Text>
            <Text style={styles.subtitle}>{faction.name}</Text>
            <Text style={styles.rank}>Rank: {faction.rankLadder[0]}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{player.level}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{player.xp}</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress to next level</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% / {player.level * 100} XP</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Equipment</Text>
          <Text style={styles.panelText}>Starter armor set unlocked</Text>
          <Text style={styles.panelText}>Portrait: Recruit Issue</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b1120' },
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 18,
    borderColor: '#334155',
    borderWidth: 1,
    alignItems: 'center',
  },
  portrait: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  portraitText: { fontSize: 22, fontWeight: '700', color: '#e5e7eb' },
  identityWrap: { flex: 1 },
  title: { fontSize: 26, fontWeight: '700', color: '#f8fafc' },
  subtitle: { fontSize: 14, color: '#90cdf4', marginTop: 4 },
  rank: { fontSize: 14, color: '#cbd5e1', marginTop: 6 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  statLabel: { color: '#9ca3af', fontSize: 12 },
  statValue: { color: '#f8fafc', fontSize: 26, fontWeight: '700', marginTop: 8 },
  progressCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  progressTitle: { fontSize: 14, color: '#e2e8f0', marginBottom: 10 },
  progressBar: {
    height: 12,
    backgroundColor: '#0f172a',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#2dd4bf', borderRadius: 999 },
  progressText: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
  panel: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  panelTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  panelText: { color: '#cbd5e1', fontSize: 14, marginTop: 6 },
  text: { color: '#f8fafc', fontSize: 16 },
});
