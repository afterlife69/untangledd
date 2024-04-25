import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const exercises = [
  { id: 1, name: 'Breathing Meditation', duration: 1 },
  // Add more exercises as needed
];

const MeditationExercises = () => {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [breathState, setBreathState] = useState('Breathe In');
  const [started, setStarted] = useState(false);
  const startExercise = (exercise) => {
    setStarted(true);
  };
  const stopExcercise = () => {
    setStarted(false);
  }

  useEffect(() => {
    let interval;
    if (started) {
      interval = setInterval(() => {
        setBreathState(breathState === 'Breathe In' ? 'Breathe Out' : 'Breathe In');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [currentExercise, breathState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Exercises</Text>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exercise}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {started ? (
            <Button title="Stop" onPress={stopExcercise} />
          ) : (
            <Button title="Start" onPress={startExercise} />
          )}
        </View>
      ))}
      {started && (
        <Text style={styles.breathingText}>{breathState}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exercise: {
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseDuration: {
    marginBottom: 10,
  },
  breathingText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MeditationExercises;