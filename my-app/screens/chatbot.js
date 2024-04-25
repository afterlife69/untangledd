import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,ActivityIndicator,KeyboardAvoidingView,Platform} from 'react-native';
import axios from 'axios';
import { Camera, requestCameraPermissionsAsync } from 'expo-camera';
import AWS from 'aws-sdk';
import { Button } from 'react-native';
import ChatMessage from './chatmessage';
const Chatbot = () => {
  let cameraRef;
  requestCameraPermissionsAsync();
  const [faceEmotion, setFaceEmotion] = useState('');
  const [textEmotion, setTextEmotion] = useState('');
  const [cnt,setCnt] = useState(0)
  const TextAnalysiss = async (inp) => { 
      const apiKey = "YybyAoql88GkUTvk99dAUuSOD548SUrV";
      const url = "https://mymodel-mgxnd.eastus2.inference.ml.azure.com/score";
      const data = JSON.stringify({inputs:inp});
      let ans
      const headers ={
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
          "azureml-model-deployment": "j-hartmann-emotion-english-ro-3"
      }
      await axios.post('http://localhost:6969/text',{url,data,headers}).then(response => {
              ans = response.data
      }).catch(error => {
              console.log(error);
      });
      return ans
  }
  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      return photo.uri;
    }
  };

  AWS.config.update({
    accessKeyId: 'AKIAZQ3DRT3JTSW3MUO2',
    secretAccessKey: '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',
    region: 'us-east-1',
  });

  const s3 =new AWS.S3();

  const uploadToS3 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const params = {
      Bucket: 'rekognition-custom-projects-us-east-1-bfed46d651',
      Key: `myimg${cnt}.jpg`,
      Body: blob,
  };

  const data = await s3.upload(params).promise();

  // Create a new Rekognition object
  const rekognition = new AWS.Rekognition({
    region: 'us-east-1',
    accessKeyId: 'AKIAZQ3DRT3JTSW3MUO2',
    secretAccessKey: '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',
  });

  // Prepare the image for Rekognition
  const rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: 'rekognition-custom-projects-us-east-1-bfed46d651',
        Name: `myimg${cnt}.jpg`,
      },
    },
    Attributes: ['ALL'],
  };

  // Detect labels in the image
  const rekognitionData = await rekognition.detectFaces(rekognitionParams).promise();

  // Return the URL of the uploaded image and the Rekognition data
  return rekognitionData ;
};
const takePictureAndUpload = async (inp) => {
    const imageUri = await takePicture();
    const uploadedUrl = await uploadToS3(imageUri);
    setCnt(cnt+1);
    let emotions = uploadedUrl.FaceDetails[0].Emotions
    let maxConfidence = 0;
    let maxEmotion = '';
      console.log(emotions)
    emotions.forEach(emotion => {
      if (emotion.Confidence > maxConfidence) {
        maxConfidence = emotion.Confidence;
        maxEmotion = emotion.Type;
      }
    });
    let texts = await TextAnalysiss(inp)
    return {"em":emotions,"mx":maxEmotion,"tx":texts}
};
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
   // State to track the user's message
  const [isBotThinking, setIsBotThinking] = useState(false);
  const handleSendMessage = async () => {
    // Take Shot of face
    setIsBotThinking(true);
    setMessages([...messages, { text: message, role: 'user' }]);
    setMessage('')
    await takePictureAndUpload(message).then(async (res) => {
      let prompt = `{user_facial_emotion:${res.mx},user_prompt:${message}} give response to the user_prompt and try to comfort the user`
      await axios.post('http://localhost:6969/chatbot', { "message":prompt,"userId":"1" })
        .then((response) => {
          setMessages([...messages,{ text: message, role: 'user' }, { text: response.data.message, role: 'bot' }]);
          setIsBotThinking(false); // The bot has finished thinking
          let cur = {}
          res.em.forEach(emotion => {
            cur[emotion.Type] = emotion.Confidence
          })
          console.log('text analysis')
          console.log(res.tx)
          let text = res.tx
          if(text.label === 'anger'){
            cur['ANGRY'] = (cur['ANGRY'] + text.score) /2
          }
          else if(text.label === 'fear'){
            cur['FEAR'] = (cur['FEAR'] + text.score) /2
          }
          else if(text.label === 'joy'){
            cur['HAPPY'] = (cur['HAPPY'] + text.score) /2
          }
          else if(text.label === 'sadness'){
            cur['SAD'] = (cur['SAD'] + text.score) /2
          }
          else if(text.label === 'surprise'){
            cur['SURPRISED'] = (cur['SURPRISED'] + text.score) /2
          }
          else if(text.label === 'neutral'){
            cur['CALM'] = (cur['CALM'] + text.score) /2
          }
          else if(text.label === 'disgust'){
            cur['DISGUSTED'] = (cur['DISGUSTED'] + text.score) /2
          }
          console.log(cur)
          axios.post('http://localhost:6969/updateE',cur).then((res) => {
            console.log('updated')
          }).catch((err) => {
            console.log(err)
          })
      })
    });
  }
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View style= {{paddingBottom:40}}></View>
      <ScrollView ref={scrollView => this.scrollView = scrollView} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})} style={{ flexGrow: 1}} contentContainerStyle={{justifyContent: 'flex-end' }}>
        {messages.map((message, index) => (
            <ChatMessage key={index} message={message.text} isUser={message.role === 'user'} />
        ))}
        {isBotThinking && (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 , margin: 25}}>
                <Text style={{ marginRight: 10, fontWeight: 'bold' }}>Bot: </Text>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        )}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'center' }}>
          <TextInput
              style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingHorizontal: 10 , backgroundColor:'lightgrey'}}
              placeholder="Type a message..."
              onChangeText={(text) => setMessage(text)}
              value={message}
          />
          <TouchableOpacity
              style={{ borderRadius: 20, backgroundColor: '#787198', paddingVertical: 10, paddingHorizontal: 20, marginLeft: 10 }}
              onPress={() => handleSendMessage()}>
              <Text style={{ color: '#FFFFFF' }}>Send</Text>
          </TouchableOpacity>
      </View>
      <Camera style={{ height : 100, width :75}} type={Camera.Constants.Type.front} ref={(ref) => (cameraRef = ref)} />
    </View>
  );
};
export default Chatbot;