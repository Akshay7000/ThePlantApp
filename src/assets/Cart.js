import React, {useEffect, useState} from 'react';
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
import LottieView from 'lottie-react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from './constants/color';
import firestore from '@react-native-firebase/firestore';
const width = Dimensions.get('screen').width - 50;
function Cart(props) {
  const [cartItem, setCartItem] = useState([]);
  const [update, setupdate] = useState(false);
  const [subTotal, setSubTotal] = useState('');

  const data = [1, 2, 3, 4];
  useEffect(() => {
    var cart = [];
    var total = 0;
    const subscriber = firestore()
      .collection('cartItem')
      .onSnapshot(documentSnapshot => {
        documentSnapshot.docs.map(cartItems => {
          total = total + cartItems.data().price * cartItems.data().qty;
          cart.push({...cartItems.data(), docId: cartItems.id});
        });
        setSubTotal(total.toFixed(2));
        setCartItem(cart);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [props, update]);
  const deleteCartItem = cartId => {
    setupdate(!update);
    firestore().collection('cartItem').doc(cartId).delete();
  };
  const updateItemQty = (cartId, qty) => {
    setupdate(!update);
    firestore().collection('cartItem').doc(cartId).update({qty: qty});
  };
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
            <Text style={style.plantPrice}>
              $ {item.cart.price * item.cart.qty}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={
                  item.cart.qty > 1
                    ? () => updateItemQty(item.cart.docId, item.cart.qty - 1)
                    : null
                }>
                <View style={style.borderBtn}>
                  <Text style={style.borderBtnText}>-</Text>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  marginHorizontal: 10,
                  fontWeight: 'bold',
                }}>
                {item.cart.qty}
              </Text>
              <TouchableOpacity
                onPress={
                  item.cart.qty
                    ? () => updateItemQty(item.cart.docId, item.cart.qty + 1)
                    : null
                }>
                <View style={style.borderBtn}>
                  <Text style={style.borderBtnText}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => deleteCartItem(item.cart.docId)}>
              <Icon name="delete" size={28} color={COLORS.red} />
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
          <Icon name="arrow-back" size={28} onPress={() => Actions.pop()} />

          <View style={style.headerText}>
            <Text style={style.Mycart}>My Cart</Text>
          </View>
        </View>
        {cartItem.length <= 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <LottieView
              source={require('../assets/images/plant.json')}
              autoPlay
              loop
              style={{width: 250, paddingRight: 20, position: 'absolute',left:20,top:60}}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold',paddingTop:30}}>
              No Plant Added
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              keyExtractor={(item, index) => index}
              data={cartItem}
              renderItem={({item}) => <Card key={item.id} cart={item} />}
              style={{marginTop: 20}}
              contentContainerStyle={{alignItems: 'center',paddingBottom:50}}
            />

            <View style={{flex: 0.25, alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    color: 'gray',
                  }}>
                    TOTAL{" "}
                </Text>
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>
                  ${subTotal}
                </Text>
                </View>
                
              <TouchableOpacity
                style={{
                  marginVertical: 10,
                  position: 'absolute',
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
                  Check Out
                </Text>
              </TouchableOpacity>
            </View>
          </>
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
    height: 180,
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
});
export default Cart;
