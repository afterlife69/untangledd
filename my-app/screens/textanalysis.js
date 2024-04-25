import axios from "axios"; 
import { useState } from "react";
import {View, Text, TextInput, Button} from "react-native";
export default function TextAnalysis() {
    const [inp, setInp] = useState('');

    const handleSubmit = async () => {   
        const apiKey = "YybyAoql88GkUTvk99dAUuSOD548SUrV";
        const url = "https://mymodel-mgxnd.eastus2.inference.ml.azure.com/score";
        const data = JSON.stringify({inputs:inp});
        const headers ={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey,
            "azureml-model-deployment": "j-hartmann-emotion-english-ro-3"
        }
        axios.post('http://localhost:6969/text',{url,data,headers}).then(response => {
                console.log(response.data);
        }).catch(error => {
                console.log(error);
        });
    }
    return (
        <View>
            <Text>Enter your text</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setInp(text)}
            />
            <Button
                onPress={handleSubmit}
                title="Submit"
                color="#841584"
            />
        </View>
    )
}