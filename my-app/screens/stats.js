import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const [data,setData] = useState([])
useEffect(() => {
    axios.get('http://localhost:6969/emotions')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []); 
const Stats = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Happiness Tracker</Text>
      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.barValue}>{item.happiness}%</Text>
            <View
              style={[
                styles.bar,
                { height: item.happiness * 2, backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }
              ]}
            />
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    maxWidth: 800,
    width: '100%',
    height: 300, // Set a fixed height for the bars container
  },
  barContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flex: 1, // Each bar container should take equal space in the row
  },
  bar: {
    width: 30,
    marginBottom: 5,
  },
  barLabel: {
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'purole',
    padding: 5,
  },
  barValue: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    padding: 5,
  },
});

export default Stats;