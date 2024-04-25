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
  ScrollView
} from "react-native";
export default function Signup({navigation}) {
    const [data, setData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const handleSubmit = async () => {
        if(data.password != data.confirmPassword){
            alert("Passwords do not match");
        }
        axios.post('http://localhost:6969/signup', data).then((res) => {
            if(res.status == 200){
                alert('registered successfully');
                navigation.navigate('Login')
            }
        }).catch((err) => alert(err))
    }
    return (
        <View style={styles.container} >
            <Image style={styles.image} source={require("../assets/image.png")} />
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Name"
                    placeholderTextColor="#003f5c"
                    onChangeText={(name) => setData({ ...data, name })}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setData({ ...data, email })}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    onChangeText={(username) => setData({ ...data, username })}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setData({ ...data, password })}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Confirm Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) =>
                        setData({ ...data, confirmPassword })
                    }
                />
            </View>
            <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
                <Text style={styles.loginText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.alr}>Already have an account?</Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
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
    navBtn: {
        width: "70%",
        height: 45,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#787198",
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
        flex: 1,
        fontSize: 16,
        padding: 10,
        marginLeft: 20,
    },
    forgot_button: {
        height: 30,
        marginBottom: 20,
    },
    loginBtn: {
        width: "70%",
        borderRadius: 25,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#787198",
    },
    loginText: {
        color: "white",
    },
    alr: {
        marginTop: 20,
    },

});
 