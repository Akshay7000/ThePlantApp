import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from './assets/constants/color';
const width = Dimensions.get('screen').width - 50;
function Fav(props) {
  const [favItem, setFavItem] = useState([]);
  const [update, setupdate] = useState(false);
  // const [subTotal, setSubTotal] = useState('');
  function getUniqueListBy(arr, key) {
    var users = [...new Map(arr.map(item => [item[key], item])).values()];

    return users;
  }
  useEffect(() => {
    var cart = [];
    var total = 0;
    const subscriber = firestore()
      .collection('Plants')
      .where('like', '==', true)
      .onSnapshot(documentSnapshot => {
        documentSnapshot.docs.map(cartItems => {
          cart.push({...cartItems.data(), docId: cartItems.id});
        });
        console.log();
        {
          !documentSnapshot.docs.length > 0 ? setFavItem([]) : null;
        }
        setFavItem(getUniqueListBy(cart, 'docId'));
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [props, update]);

  const Card = item => {
    //console.log(item.cart.docId)
    return (
      <View style={style.card}>
        <View style={style.cartItems}>
          <Image
            source={{
              uri: item.cart.image,
            }}
            style={style.image}
          />
          <View
            style={{
              paddingHorizontal: 20,
              width: 200,
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {item.cart.name}
            </Text>
            <Text numberOfLines={2}>{item.cart.about}</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity>
              <View
                style={[
                  style.cardFev,
                  {
                    backgroundColor: item.cart.like
                      ? 'rgba(245, 42, 42,0.2)'
                      : 'rgba(0,0,0,0.2) ',
                  },
                ]}>
                <Icon
                  name="heart"
                  size={18}
                  color={item.cart.like ? COLORS.red : COLORS.black}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
            <Text style={style.Mycart}>My Favourite </Text>
          </View>
        </View>

        {!favItem.length > 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <LottieView
              source={require('./assets/images/plant.json')}
              autoPlay
              loop
              style={{
                width: 250,
                paddingRight: 20,
                position: 'absolute',
                left: 20,
                top: 60,
              }}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold', paddingTop: 50}}>
              No Favourite Added
            </Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={(item, index) => index}
            data={favItem}
            renderItem={({item}) => <Card key={item.id} cart={item} />}
            style={{marginTop: 20}}
            contentContainerStyle={{alignItems: 'center'}}
          />
        )}
      </SafeAreaView>
    </>
  );
}
const style = StyleSheet.create({
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
  card: {
    borderRadius: 10,
    height: 100,
    backgroundColor: COLORS.light,
    width,
    marginHorizontal: 2,
    marginBottom: 20,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cartItems: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    height: 80,
    width: 100,
    resizeMode: 'cover',
  },
  borderBtn: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
  },
  borderBtnText: {fontWeight: 'bold', fontSize: 28},
  plantPrice: {fontSize: 19, fontWeight: 'bold'},
  cardFev: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Fav;
