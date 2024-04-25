import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
export default function Login({navigation}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async () => {
    axios.post('http://localhost:6969/login', {username,password}).then((res) => {
        if(res.status == 200){
            alert('logged in successfully');
            navigation.navigate('Home')
        }
    }).catch((err) => alert(err))
  }
  return (
    <View style={styles.container} contentContainerStyle={{minHeight: '100%'}}>
      <Image style={styles.image} source={require("../assets/image.png")} />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setUsername(email)}
        /> 
      </View> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        /> 
      </View> 
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
        <Text style={styles.loginText}>Login</Text> 
      </TouchableOpacity> 
      <Text style={styles.dont}>Dont have an account ?</Text>
      <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
    </View> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    
  },
  image: {
    height : 200,
    width : 200,
  },
  inputView: {
    backgroundColor: "#F2F2F2",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "left",
  },
TextInput: {
    height: 50,
    fontSize: 16, // Increase the font size here
    flex: 1,
    padding: 10,
    marginLeft: 20,
},
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  navBtn: {
    width: "70%",
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#787198",
  },
  loginBtn: {
    width: "70%",
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#787198",
  },
  loginText: {
    color: "white",
  },
  dont: {
    marginTop: 30,
    color: "black",
  }
});