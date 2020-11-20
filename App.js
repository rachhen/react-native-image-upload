/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Button,
  Text,
  View,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const options = {
  mediaType: 'photo',
  includeBase64: false,
};

/**
 * Server code @see https://repl.it/@Woufu/react-native-image
 */

const url = 'https://react-native-image.woufu.repl.co';

const App = () => {
  const [image, setImage] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [imageUploaded, setImageUploaded] = React.useState(null);

  const handlePickImage = () => {
    ImagePicker.launchImageLibrary(options, (response) => {
      setImage(response);

      const formData = new FormData();
      const uri =
        Platform.OS === 'android'
          ? response.uri
          : response.uri.replace('file://', '');

      formData.append('image', {
        uri, // CameralRoll Url
        type: response.type,
        name: 'image.' + response.uri.split('.').pop(),
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        setProgress(Math.round((e.loaded * 100) / e.total));
      });
      xhr.addEventListener('load', (e) => {
        console.log(xhr.responseText);
        setImageUploaded(JSON.parse(xhr.responseText));
      });
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.imageContainer}>
            {image && <Image source={{uri: image.uri}} style={styles.image} />}
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progress}>
              <View style={styles.progressBar} />
              <View
                style={[
                  styles.progressBar,
                  styles.progressBarActive,
                  {width: `${progress}%`},
                ]}
              />
            </View>
            <Text style={styles.uploaded}>Uploaded {progress}%</Text>
            <Button title="Pick image" onPress={handlePickImage} />
          </View>
          {imageUploaded && (
            <Image
              source={{uri: `${url}/${imageUploaded.filename}`}}
              style={styles.image}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: 300,
  },
  progressContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  progress: {
    position: 'relative',
    paddingBottom: 5,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
  progressBarActive: {
    backgroundColor: 'blue',
    position: 'absolute',
    zIndex: 4,
  },
  uploaded: {
    textAlign: 'center',
  },
});

export default App;
