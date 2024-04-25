import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';

const Sidebar = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetch('https://api.api-ninjas.com/v1/quotes?category=success')
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex].quote);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={() => console.log('Home pressed')}>
        <View style={styles.item}>
          <Icon name="home" style={styles.icon} />
          <Text>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Services pressed')}>
        <View style={styles.item}>
          <Icon name="wrench" style={styles.icon} />
          <Text>Services</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Clients pressed')}>
        <View style={styles.item}>
          <Icon name="user" style={styles.icon} />
          <Text>Clients</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Contact pressed')}>
        <View style={styles.item}>
          <Icon name="envelope" style={styles.icon} />
          <Text>Contact</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 50,
    margintop: 0,
    backgroundColor: '#fff', // Set your desired background color
    paddingTop: 20, // Adjust as needed
    paddingHorizontal: 20, // Adjust as needed
    //height: '10%', // Set sidebar height to 100% of the screen
    width: '50%', // Set sidebar width to 50% of the screen
    justifyContent: 'flex-start', // Align items to the top
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 15,
    fontSize: 25, // Adjust as needed
  },
  quote: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sidebar;