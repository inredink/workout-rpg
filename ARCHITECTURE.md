# Architecture

## Core layout
- `app/` contains the Expo Router screens and tab-based navigation
- `src/services/` stores domain logic
- `src/data/` holds data-driven catalogs such as factions
- `src/services/workoutService.ts` handles SQLite and persistence
- `src/services/xp.ts` holds XP formula constants and calculation logic

## Data flow
- Users create workouts through the log screen
- Workout data is inserted into SQLite tables: workouts, exercises, and exercise_sets
- History reads those rows back to show saved sessions
- Character and factions are driven from a lightweight local profile and faction catalog

## Future extension points
- Add rank progression rules by faction in a dedicated rules module
- Expand the reward catalog and portrait unlock system
- Separate reward logic from battle/training logic
- Add more advanced consistency bonus rules later
