import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from './assets/constants/color';
const width = Dimensions.get('screen').width /1.5;
function DetailScreen(props) {
  const cartCollection = firestore().collection('cartItem');
  const [cartState, setCartState] = useState([]);
  const [cart, setCart] = useState(true);
  const {plant} = props;
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    cartCollection
      .where('id', '==', plant.id)
      .get()
      .then(querySnapshot => {
        console.log('use', querySnapshot.docs[0]);
        if (querySnapshot.docs[0].data() !== undefined) {
          setQuantity(querySnapshot.docs[0].data().qty);
          setCart(false);
        } else {
          setCart(false);
        }
      })
      .catch(e => {
        console.log('error');
        setCart(true);
      });
  }, []);
  const checkCart = async () => {
    await cartCollection
      .where('id', '==', plant.id)
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.docs[0].id);
        if (querySnapshot.docs[0].data() !== undefined) {
          setCart(false);
        } else {
          console.log(querySnapshot.docs[0].data());
        }
      })
        .catch(e => {
          setCart(false)
        cartCollection.add({
          id: plant.id,
          name: plant.name,
          price: plant.price,
          like: plant.like,
          qty: quantity,
          image: plant.image,
          about: plant.about,
        });
      });
  };

  const changeQty = qty => {
    setQuantity(qty);
  };

  const addToCart = () => {
    checkCart(() => {});
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <View style={style.header}>
        <Icon name="arrow-back" size={28} onPress={() => Actions.pop()} />
        <Icon name="shopping-cart" size={28} onPress={()=>Actions.cart()}/>
      </View>
      <View style={style.imageContainer}>
        <Image
          source={{uri: plant.image}}
          style={{resizeMode: 'contain', flex: 1, width: 500}}
        />
      </View>
      <View style={style.detailsContainer}>
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <View style={style.line} />
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Best choice</Text>
        </View>
        <View
          style={{
            marginLeft: 20,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 22, fontWeight: 'bold',width:width}} numberOfLines={1}>{plant.name}</Text>
          <View style={style.priceTag}>
            <Text
              style={{
                marginLeft: 15,
                color: COLORS.white,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              ${plant.price}
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>About</Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 16,
              lineHeight: 22,
              marginTop: 10,
            }}>
            {plant.about}
          </Text>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={quantity > 1 &&cart? () => changeQty(quantity - 1) : null}>
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
                {quantity}
              </Text>
              <TouchableOpacity onPress={cart?() => changeQty(quantity + 1):null}>
                <View style={style.borderBtn}>
                  <Text style={style.borderBtnText}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
            {cart ? (
              <TouchableOpacity onPress={() => addToCart()}>
                <View style={style.buyBtn}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Buy
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <View style={style.buyBtn}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Cart
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 0.55,
    backgroundColor: COLORS.light,
    marginHorizontal: 7,
    marginBottom: 7,
    borderRadius: 20,
    marginTop: 30,
    paddingTop: 30,
  },
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
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
  buyBtn: {
    width: 130,
    height: 50,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  priceTag: {
    backgroundColor: COLORS.green,
    width: 80,
    height: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
});
export default DetailScreen;
