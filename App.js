import React, { useState, useEffect, useRef } from 'react';
import { Image, Modal, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const ref = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [captured, setCaptured] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

async function take(){
  if(ref){
    const opt={
      quality: 0.5,
      base64: true,
      fixOperation: true,
      forceUpOrientation: true,

    }
    const data = await ref.current.takePictureAsync();
    setCaptured(data.uri);
    setOpen(true);
    console.log(data)
    await MediaLibrary.saveToLibraryAsync(data.uri)

  }
}


  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
                  
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonTake}
          onPress={take}>
            <Image source={require("./assets/favicon.png")}/>
            <Text style={styles.text}> Take </Text>
          </TouchableOpacity> 
        </View>
      </Camera>
      <Modal visible={open} >
        <View style={styles.contentPhoto}>
          <TouchableOpacity style={styles.buttonClose} on4ess={()=> setOpen(false)}> 
            <Text style={styles.text}> Close </Text>
          </TouchableOpacity>
          <Image style={styles.img} source={{uri:captured}} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera:{
    width: "100%",
    height: "100%",
  },
  buttonContainer:{
    flex: 1,
    backgroundColor: "transparent",
  },
  buttonFlip:{
    position:"absolute",
    bottom: 50,
    left: 30,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fff",
    margin: 20,
    width: 50,
    height: 50,
    borderRadius: 50,

  },
  buttonTake:{
    position:"absolute",
    bottom: 50,
    right: 30,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fff",
    margin: 20,
    width: '1%',
    height: '1%',
    borderRadius: 50,

  },

  contentPhoto:{
    justifyContent: "center",
    alignItems : "center",
    margin: 10,
    flex: 1,
  },

  img:{
    width: "100%",
    height: "80%",
  },

  buttonClose:{
    position:"absolute",
    top: 20,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fff",
    margin: 20,
    width: 50,
    height: 50,
    borderRadius: 50,


  }


});
