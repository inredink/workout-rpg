# Workout RPG

A lightweight mobile fitness tracker with RPG progression, built with Expo + React Native + TypeScript.

## What this project includes
- Character screen with level, XP, and faction identity
- Workout logging with exercise and set tracking
- Saved workout history using SQLite
- Faction selection driven by a data file instead of hard-coded screens
- Centralized XP module with tunable constants

## Local setup
1. Install dependencies:
   npm install
2. Start the app:
   npm start
3. Open with Expo Go on your phone or run on a simulator:
   npm run ios
   npm run android

## Type check
npm run type-check

## Notes
- This is the first milestone for a private hobby app.
- Persistence currently uses local SQLite.
- The faction catalog is intentionally compact but extensible.
