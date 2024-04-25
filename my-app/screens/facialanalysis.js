// import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import AWS from 'aws-sdk';
import { Button } from 'react-native';
import React, { useEffect, useState} from 'react';
export default function FacialAnalysis() {
  let cameraRef;
  const [cnt,setCnt] = useState(0);
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
  const takePictureAndUpload = async () => {
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
      alert(`The dominant emotion is ${maxEmotion}`)
  };
 return (
    <Camera
      ref={ref => (cameraRef = ref)}
      style={{ flex: 1, aspectRatio: 3 / 4 }} // Adjust the aspect ratio as per your requirement
      type={Camera.Constants.Type.front}
      pictureSize="1920x1080" // Set the desired resolution here
    >
      <Button title="Take Picture" onPress={takePictureAndUpload} />
    </Camera>
)
}