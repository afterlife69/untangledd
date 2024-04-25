import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,ActivityIndicator,KeyboardAvoidingView,Platform} from 'react-native';
import axios from 'axios';
import { Camera, requestCameraPermissionsAsync } from 'expo-camera';
import AWS from 'aws-sdk';
import { Alert } from 'react-native';
import ChatMessage from './chatmessage';
const Questionnaire = ({navigation}) => {
  let cameraRef;
  requestCameraPermissionsAsync();
  const [faceEmotion, setFaceEmotion] = useState('');
  const [textEmotion, setTextEmotion] = useState('');
  const [cnt,setCnt] = useState(0)
  const [qn,setQn] = useState([
    "How's your day going? Anything exciting happening?",
    "What's been on your mind lately? Anything you want to talk about?",
    "Have you come across anything lately that's made you smile?",
    "Is there something you're looking forward to in the near future?",
    "Can you share a recent accomplishment with me, big or small?",
    "How do you usually unwind and relax after a long day?",
    "Have you found any new hobbies or interests that you're enjoying?",
    "How's your sleep been lately? Getting enough rest?",
    "Do you have any favorite activities that help you de-stress?",
    "What's something that always brings a smile to your face, no matter what?",
    "Have you read or watched anything interesting lately that you'd recommend?",
    "Is there a recent experience that's given you a new perspective on things?",
    "How do you usually deal with tough emotions when they come up?",
    "What's something you're feeling grateful for today?",
    "Any goals you're currently working towards?",
    "How do you define success for yourself personally?",
    "Can you think of something you're really proud of yourself for lately?",
    "Have you faced any challenges recently that you've managed to overcome?",
    "Do you feel like you're growing and learning as a person?",
    "When things get tough, how do you keep yourself motivated?",
    "Is there a favorite quote or saying that inspires you?",
    "Are there any negative thoughts you've been trying to let go of?",
    "If you could give your younger self one piece of advice, what would it be?",
    "How do you take care of yourself when you're feeling down?",
    "Do you believe in the power of positive thinking and gratitude?",
    "What's something simple that always cheers you up?",
    "How do you recharge your energy when you're feeling drained?",
    "Is there someone you look up to for their mental strength?",
    "Can you share a lesson you've learned from a tough situation?",
    "Do you think being vulnerable is a strength or a weakness?",
    "How do you handle criticism or negative feedback from others?",
    "Is there a cause or issue you're passionate about?",
    "What's your secret to maintaining balance in your life?",
    "How do you like to spend quality time with loved ones?",
    "When you're feeling low, how do you show yourself kindness?",
    "What's your approach to problem-solving when faced with a challenge?",
    "Do you think therapy or counseling can be helpful?",
    "How do you navigate conflicts in your relationships?",
    "What's your favorite way to practice mindfulness or relaxation?",
    "How would you describe happiness in your own words?",
    "Is there something you wish more people understood about mental health?",
    "How do you set boundaries with others in your life?",
    "When you're feeling overwhelmed, what helps you regain your balance?",
    "Can you recall a small act of kindness that meant a lot to you?",
    "What's an activity that helps you feel calm and centered?",
    "How do you express gratitude in your daily life?",
    "What's your favorite self-care ritual or activity?",
    "Do you believe in the power of forgiveness, for yourself and others?",
    "When faced with setbacks, how do you bounce back?",
    "What's something you're excited about for the future?"
  ])
  const getRandomQuestion = (questions) => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    setQn(qn.filter((q) => q !== question));
    console.log(question);
    return question;
  };
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
  const [questionCount, setQuestionCount] = useState(0);
  const handleSendMessage = async () => {
    // Take Shot of face
    setIsBotThinking(true);
    setMessages([...messages, { text: message, role: 'user' }]);
    setMessage('')
    await takePictureAndUpload(message).then(async (res) => {
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
    setIsBotThinking(false);
    setQuestionCount(questionCount + 1);
    if (questionCount >= 4) {
        alert('Thank you for the data!');
        navigation.navigate('Home');
      } else {
        const botMessage = getRandomQuestion(qn);
        setMessages([...messages,{ text: message, role: 'user' },{ text: botMessage, role: 'bot' }]);
      }
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
                    onPress={() => handleSendMessage()}
                >
                    <Text style={{ color: '#FFFFFF' }}>Send</Text>
                </TouchableOpacity>
        </View>
        <Camera style={{ height : 1, width : 1}} type={Camera.Constants.Type.front} ref={(ref) => (cameraRef = ref)} />
    </View>
  );
};

export default Questionnaire;