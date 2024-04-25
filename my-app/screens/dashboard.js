import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
const Dashboard = () => {
  const [data, setData] = useState([])
  const [happie, setHappie] = useState(0)
  useEffect(() => {
    axios.get('http://localhost:6969/emotions').then(response => {
      // console.log(response.data)
      let dataa = []
      let positive = 0
      let negative = 0
      let happiness = 0
      // store all the keys and values of the response in an array
      for (const [key, value] of Object.entries(response.data[0])) {
        if(key !== '_id' && key !== '__v')
        dataa.push({ label: key, value: parseInt(value) });
          if(key === 'HAPPY' || key === 'CALM' || key === 'SURPRISED'){
            positive += parseInt(value)
          }
          else{
            negative += parseInt(value)
          }
      }
      happiness = parseInt((positive/(positive+negative))*100)
      setHappie(happiness)
      setData(dataa)
      // console.log(dataa)
    }).catch(error => {
      console.log(error);
    });
  }, []);
  
  // console.log(data)
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Happiness Tracker</Text>
      <View style={styles.happinessBarContainer}>
        
        <View style={{...styles.happinessBar, width: `${happie}%`}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>{happie}%</Text>
        </View>
      </View>
      <View style={styles.barsContainer}>
        {data && data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.barValue}>{item.value}%</Text>
            <View
              style={[
                styles.bar,
                {
                  height: item.value * 2,
                  backgroundColor: `#${Math.floor(Math.random() * 16777215 % 14999999).toString(16)}`
                }
              ]}
            />
            <Text style={styles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  happinessBarContainer: {
    width: '100%',
    height: 20,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
  },
  happinessBar: {
    height: '100%',
    backgroundColor: 'green',
  },
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

export default Dashboard;