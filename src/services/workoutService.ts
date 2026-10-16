import * as SQLite from 'expo-sqlite';
import { calculateWorkoutXp } from './xp';

const database = SQLite.openDatabaseSync('workout_rpg.db');

// Run initial schema on module load as a safety-net. initializeDatabase also runs the same statements.
database.execSync(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    factionId TEXT,
    rankId TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    units TEXT DEFAULT 'lb',
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    notes TEXT,
    units TEXT,
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    workoutId TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY(workoutId) REFERENCES workouts(id)
  );

  CREATE TABLE IF NOT EXISTS exercise_sets (
    id TEXT PRIMARY KEY,
    exerciseId TEXT NOT NULL,
    reps INTEGER NOT NULL,
    weight REAL NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY(exerciseId) REFERENCES exercises(id)
  );

  CREATE TABLE IF NOT EXISTS xp_transactions (
    id TEXT PRIMARY KEY,
    playerId TEXT NOT NULL,
    workoutId TEXT,
    xpDelta INTEGER NOT NULL,
    reason TEXT,
    createdAt INTEGER NOT NULL
  );
`);

export const initializeDatabase = () => {
  database.execSync(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      factionId TEXT,
      rankId TEXT,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      units TEXT DEFAULT 'lb',
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      notes TEXT,
      units TEXT,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      workoutId TEXT NOT NULL,
      name TEXT NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY(workoutId) REFERENCES workouts(id)
    );

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id TEXT PRIMARY KEY,
      exerciseId TEXT NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY(exerciseId) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS xp_transactions (
      id TEXT PRIMARY KEY,
      playerId TEXT NOT NULL,
      workoutId TEXT,
      xpDelta INTEGER NOT NULL,
      reason TEXT,
      createdAt INTEGER NOT NULL
    );
  `);
};

export function getOrCreatePlayer() {
  const existing = database.getFirstSync('SELECT * FROM players LIMIT 1;');
  if (existing) {
    return existing;
  }

  const id = `player-${Date.now()}`;
  const createdAt = Date.now();
  database.runSync(
    'INSERT INTO players (id, name, factionId, rankId, level, xp, units, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [id, 'Acolyte', 'ultramarines', 'recruit', 1, 0, 'lb', createdAt],
  );

  return database.getFirstSync('SELECT * FROM players LIMIT 1;');
}

export function getPlayer() {
  return database.getFirstSync('SELECT * FROM players LIMIT 1;');
}

export function updatePlayerFaction(factionId: string) {
  const player = getOrCreatePlayer();
  database.runSync('UPDATE players SET factionId = ? WHERE id = ?;', [factionId, player.id]);
}

export function updatePlayerUnits(units: 'lb' | 'kg') {
  const player = getOrCreatePlayer();
  database.runSync('UPDATE players SET units = ? WHERE id = ?;', [units, player.id]);
}

export function createWorkout({
  notes,
  units,
  exercises,
}: {
  notes: string;
  units: string;
  exercises: Array<{ id: string; name: string; sets: Array<{ reps: number; weight: number }> }>;
}) {
  const workoutId = `workout-${Date.now()}`;
  const createdAt = Date.now();
  database.runSync('INSERT INTO workouts (id, notes, units, createdAt) VALUES (?, ?, ?, ?);', [workoutId, notes, units, createdAt]);

  let totalSets = 0;
  let totalReps = 0;
  let totalWeight = 0;

  exercises.forEach((exercise, position) => {
    database.runSync('INSERT INTO exercises (id, workoutId, name, position) VALUES (?, ?, ?, ?);', [exercise.id, workoutId, exercise.name, position]);
    exercise.sets.forEach((set, setPosition) => {
      const setId = `${exercise.id}-set-${setPosition}-${Date.now()}`;
      database.runSync(
        'INSERT INTO exercise_sets (id, exerciseId, reps, weight, position) VALUES (?, ?, ?, ?, ?);',
        [setId, exercise.id, set.reps, set.weight, setPosition],
      );
      totalSets += 1;
      totalReps += Number(set.reps || 0);
      totalWeight += Number(set.weight || 0);
    });
  });

  // Compute XP using centralized calculator
  const xpAwarded = calculateWorkoutXp(totalSets, totalReps, totalWeight);

  // Persist XP transaction and update player XP
  const player = getOrCreatePlayer();
  const xpTxId = `xp-${Date.now()}`;
  database.runSync('INSERT INTO xp_transactions (id, playerId, workoutId, xpDelta, reason, createdAt) VALUES (?, ?, ?, ?, ?, ?);', [
    xpTxId,
    player.id,
    workoutId,
    xpAwarded,
    'workout completion',
    Date.now(),
  ]);

  // Update player's XP and potentially level (simple level by 100xp per level for now)
  const newXp = (player.xp || 0) + xpAwarded;
  let newLevel = player.level || 1;
  while (newXp >= newLevel * 100) {
    newLevel += 1;
  }

  database.runSync('UPDATE players SET xp = ?, level = ? WHERE id = ?;', [newXp, newLevel, player.id]);

  return { workoutId, xpAwarded };
}

export function getWorkouts() {
  const rows = database.getAllSync('SELECT * FROM workouts ORDER BY createdAt DESC;');
  return rows.map((row) => {
    const exercises = database.getAllSync('SELECT * FROM exercises WHERE workoutId = ? ORDER BY position ASC;', [row.id]).map((ex: any) => {
      const sets = database.getAllSync('SELECT * FROM exercise_sets WHERE exerciseId = ? ORDER BY position ASC;', [ex.id]).map((s: any) => ({
        id: s.id,
        reps: s.reps,
        weight: s.weight,
        position: s.position,
      }));
      return {
        id: ex.id,
        name: ex.name,
        position: ex.position,
        sets,
      };
    });

    return {
      id: row.id,
      notes: row.notes,
      units: row.units,
      createdAt: row.createdAt,
      exercises,
    };
  });
}
