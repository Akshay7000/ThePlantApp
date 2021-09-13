import React, {useState, useEffect, useRef} from 'react';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Alert,
  BackHandler,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {Actions} from 'react-native-router-flux';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import COLORS from './assets/constants/color';
import {Picker} from '@react-native-picker/picker';
import {set} from 'traverse';
const width = Dimensions.get('screen').width - 50;
function Profile() {
  const plantCollection = firestore().collection('Plants');
  const [height, setHeight] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [about, setAbout] = useState('');
  const [image, setImage] = useState('');
  const [msg, setMsg] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState({});
  const categories = ['ORGANIC', 'INDOORS', 'SYNTHETIC'];
  const [selectedLanguage, setSelectedLanguage] = useState();
  const scrollView = useRef(null)
  useEffect(() => {
    const backAction = () => {
      setLoading(false);
      setAbout('');
      setPrice(0);
      setName('');
      setMsg(false)
      setFilePath({});
      Actions.pop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);


  
  const saveNewPlant = async () => {
    setLoading(!Loading);
    var imageName = Date.now().toString();
    try {
      var url = await storage().ref(imageName).putFile(filePath.uri);
      const url2 = await storage().ref(imageName).getDownloadURL();
      // url.on('state_changed', taskSnapshot => {
      //   console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      // });

      // url.then(() => {
      //   console.log('Image uploaded to the bucket!');
      // });
      
      if (
        name.trim() !== '' &&
        price.trim() !== 0 &&
        about.trim() !== '' &&
        url2.trim() !== ''
      ) {
        console.log("IF")
    Alert.alert('New Plant Added', '', [
      {
        text: 'Cancel',
        onPress: () => setLoading(false),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setMsg(false);
            addData(url2);
        },
      },
    ]);
      } else {
        setMsg(true)
console.log("else")
        setLoading(false)
  }
    } catch (e) {
      setLoading(false);
    }
  };
  const addData = url => {
    console.log(url);
    plantCollection
      .add({
        id: Date.now(),
        name: name,
        price: price,
        like: false,
        category: selectedLanguage,
        image: url,
        about: about,
      })
      .then(() => {
        setLoading(false);
        setAbout(null);
        setPrice(0);
        setName(null);
        setFilePath(null);
        console.log('User added!');
      })
      .catch(e => console.log(e));
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 0.5,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response.assets);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        // console.log('base64 -> ', response.base64);
        // console.log('uri -> ', response.uri);
        // console.log('width -> ', response.width);
        // console.log('height -> ', response.height);
        // console.log('fileSize -> ', response.fileSize);
        // console.log('type -> ', response.type);
        // console.log('fileName -> ', response.fileName);
        if (response.assets[0]) {
          setFilePath(response.assets[0]);
        }
      });
    }
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality:0.5,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      if (response.assets[0]) {
        setFilePath(response.assets[0]);
      }
    });
  };

  const deleteImage = () => {
    setFilePath('');
    setLoading(false);
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}>
       
        <View style={style.header}>
          <Icon2 name="arrow-back" size={28} onPress={() => Actions.pop()} />

          <View style={style.headerText}>
            <Text style={style.Mycart}>My Plant</Text>
          </View>
        </View>
        {Loading ? (
          <ActivityIndicator
            
            style={{
              backgroundColor: 'rgba(210, 242, 210, 0.4)',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              flex: 1,
              zIndex: 9,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            size={50}
            color={COLORS.green}
          />
        ) : (
          <></>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            
            style={{ flex: 1, marginTop: 50, marginBottom: 70 }}
            >
            <View style={{flex: 0.5, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => deleteImage()}
                style={{
                  position: 'absolute',
                  top: 180,
                  left: 250,
                  zIndex: 5,
                  backgroundColor: COLORS.light,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 35,
                  height: 35,
                }}>
                <View>
                  <Icon
                    size={25}
                    name={filePath?.uri ? 'trash' : 'upload'}
                    color={filePath?.uri ? 'red' : 'gray'}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => captureImage('photo')}>
                <Image
                  source={
                    filePath?.uri
                      ? {
                          uri: filePath?.uri,
                        }
                      : require('./assets/images/default.jpg')
                  }
                  style={{
                    backgroundColor: 'gray',
                    borderRadius:
                      Math.round(
                        Dimensions.get('window').width +
                          Dimensions.get('window').height,
                      ) / 2,
                    width: Dimensions.get('window').width * 0.5,
                    height: Dimensions.get('window').width * 0.5,
                    backgroundColor: 'gray',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={style.searchSort}>
              <View style={style.searchContainer}>
                <Icon2 name="eco" size={25} style={style.searchIcon} />
                <TextInput
                  placeholder="Name"
                  style={style.searchInput}
                  placeholderTextColor={COLORS.dark}
                  value={name}
                  onChangeText={e => setName(e)}
                />
              </View>
            </View>

            <View style={style.searchSort}>
              <View style={style.searchContainer}>
                <Icon2 name="local-offer" size={25} style={style.searchIcon} />
                <TextInput
                  placeholder="Price"
                  keyboardType="numeric"
                  style={style.searchInput}
                  value={price}
                  placeholderTextColor={COLORS.dark}
                  onChangeText={e => {
                    setPrice(e);
                  }}
                />
              </View>
            </View>
            <View style={style.searchSort}>
              <View style={style.searchContainer}>
                <Icon3
                  name="microsoft-xbox-controller-menu"
                  size={25}
                  style={style.searchIcon}
                />
                <Picker
                  dropdownIconColor={COLORS.dark}
                  mode={'dropdown'}
                  style={[
                    {
                      marginLeft: 3,
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: COLORS.dark,
                      flex: 1,
                    },
                    {fontWeight: 'bold'},
                  ]}
                  selectedValue={selectedLanguage}
                  onValueChange={(itemValue, itemIndex) =>
                    {setSelectedLanguage(itemValue)
                    console.log(itemValue)}
                  }>
                  {categories.map((cat, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        style={{color: COLORS.white}}
                        label={cat}
                        value={cat}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View style={style.searchSort}>
              <View
                style={[style.searchContainer, {height: Math.max(50, height)}]}>
                <Icon2 name="info" size={25} style={style.searchIcon} />
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  placeholder="About"
                  style={style.searchInput}
                  value={about}
                  placeholderTextColor={COLORS.dark}
                  onChangeText={e => {
                    setAbout(e);
                  }}
                  onContentSizeChange={e => {
                    setHeight(e.nativeEvent.contentSize.height);
                  }}
                />
              </View>
            </View>
            {msg && (
              <Text style={{color: COLORS.red,paddingLeft:35,paddingTop:10}}>
                All Input Fields are Required
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity onPress={() => saveNewPlant()}>
            <View
              style={{
                marginVertical: 10,
                // position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                borderRadius: 50,
                marginHorizontal: 30,
                backgroundColor: COLORS.green,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: COLORS.white,
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Mycart: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  Welcome: {fontSize: 25, fontWeight: 'bold'},
  ShopName: {fontSize: 38, fontWeight: 'bold', color: COLORS.green},
  searchSort: {
    marginHorizontal: 30,
    marginTop: 30,
    flexDirection: 'row',
  },
  searchContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 20,
  },
  searchInput: {
    marginLeft: 15,
    fontSize: 18,
    //fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  sortBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 15,
    marginLeft: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoriesText: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoryTextSelected: {
    color: COLORS.green,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.green,
  },
  card: {
    borderRadius: 10,
    height: 225,
    backgroundColor: COLORS.light,
    width,
    marginHorizontal: 2,
    marginBottom: 20,
    padding: 15,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    marginTop: 10,
    paddingBottom: 50,
  },
  cardFev: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 100,
    alignItems: 'center',
  },
  imageData: {flex: 1, resizeMode: 'contain', width: 200},
  plantName: {fontWeight: 'bold', fontSize: 17, marginTop: 10},
  plantPrice: {fontSize: 19, fontWeight: 'bold'},
  plantPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  addButton: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.green,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {fontSize: 22, color: COLORS.white, fontWeight: 'bold'},
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
});
export default Profile;
