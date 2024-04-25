import React, { Component } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
class FadeInView extends Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 4500,
        useNativeDriver: true,
      }
    ).start();
  }

  render() {
    const { fadeAnim } = this.state;

    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: fadeAnim,
        }}
      >
        {/* Render the Image directly */}
        <Image
          source={this.props.imageSource}
          style={styles.image}
        />
      </Animated.View>
    );
  }
}
export default function Loading() {
    const navigation = useNavigation();
  
    setTimeout(() => {
      navigation.navigate('Login');
    }, 4500);
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FadeInView style={{ width: 250, height: 250 }} imageSource={require('../logo.png')} />
      </View>
    );
  }
const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });