import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from './assets/constants/color';

const width = Dimensions.get('screen').width / 2 - 30;
const HomePage = (props) => {
  const plantCollection = firestore().collection('Plants');
  const categories = ['ALL', 'ORGANIC', 'INDOORS', 'SYNTHETIC'];
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const [plantsState, setPlantsState] = useState([]);
  const [plantsFilterState, setPlantsFilterState] = useState([]);
const [plantSearch, setplantSearch] = useState([])
  const [update, setupdate] = useState(false);
 

  const setFav = (uid, like) => {
    setupdate(!update)
      plantCollection.doc(uid).update({like:like})
  }

  useEffect(() => {
    var snapData = [];
   
    const subscriber = plantCollection
      .onSnapshot(documentSnapshot => {
        documentSnapshot.docs.map(Items => {
         
          snapData.push({...Items.data(), uid: Items.id});
        });
        setPlantsState(snapData);
        setPlantsFilterState(snapData)
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [props,update]);

  const filterCategory = (index,item) => {
    setCategoryIndex(index)
    if (index == 0 || item === "ALL") {
      setPlantsFilterState(plantsState)
      setplantSearch([])
    }else
    {var data = plantsState.filter((element) => element.category === item)
   
      setplantSearch([])
    setPlantsFilterState(data)}
}


  const SearchPlant = (name) =>{
    var search = plantsFilterState.filter((item) => item.name.includes(name))
    if (name.length > 1) {
      console.log("object", name.length)
      //  setplantSearch([])
    } else {
      setplantSearch(search)
    }
  }
  const filterPlant = () => {
    setPlantsFilterState(plantsFilterState.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)))
  }
  const Card = ({ plant }) => {
    
      return (
        <TouchableOpacity onPress={()=>{Actions.detail({plant:plant})}}>
      <View style={style.card}>
        <TouchableOpacity onPress={(i)=>setFav(plant.uid,!plant.like)}><View style={{alignItems: 'flex-end'}}>
          <View
            style={[
              style.cardFev,
              {
                backgroundColor: plant.like
                  ? 'rgba(245, 42, 42,0.2)'
                  : 'rgba(0,0,0,0.2) ',
              },
            ]}>
            <Icon
              name="heart"
              size={18}
              color={plant.like ? COLORS.red : COLORS.black}
            />
          </View>
        </View></TouchableOpacity>
        <View style={style.imageContainer}>
          <Image style={style.imageData} source={{uri: plant.image}} />
        </View>
        <Text style={style.plantName}  numberOfLines={1}>{plant.name}</Text>
        <View style={style.plantPriceContainer}>
          <Text style={style.plantPrice}>${plant.price}</Text>

          <View style={style.addButton}>
            <Text style={style.plus}>+</Text>
          </View>
        </View>
      </View></TouchableOpacity>
    );
  };
  const CategoryList = () => {
    return (
      <View style={style.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              filterCategory(index,item)
              //    addData()
            }}>
            <Text
              style={[
                style.categoriesText,
                catergoryIndex === index && style.categoryTextSelected,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={style.screen}>
      <View style={style.Header}>
        <View>
          <Text style={style.Welcome}>Welcome</Text>
          <Text style={style.ShopName}>The Plant Shop</Text>
        </View><TouchableOpacity onPress={()=>Actions.cart()}>
        <Icon name="shopping-cart" size={28} /></TouchableOpacity>
      </View>
      <View style={style.searchSort}>
        <View style={style.searchContainer}>
          <Icon name="search" size={25} style={style.searchIcon} />
          <TextInput
            placeholder="Search"
            style={style.searchInput}
            placeholderTextColor={COLORS.dark}
            onChangeText={(e)=>SearchPlant(e)}
          />
        </View>
        <View style={style.sortBtn}>
          <TouchableOpacity onPress={()=>filterPlant()}>
          <Icon name="filter" size={25} color={COLORS.white} /></TouchableOpacity>
        </View>
      </View>
      <CategoryList />

      <FlatList
        numColumns={2}
        keyExtractor={(item,index) =>item.uid }
        data={!plantSearch.length>0? plantsFilterState:plantSearch}
        renderItem={({item}) => <Card plant={item} key={item.id} />}
        columnWrapperStyle={style.columnWrapperStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.contentContainerStyle}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
  },
  Header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Welcome: {fontSize: 25, fontWeight: 'bold'},
  ShopName: {fontSize: 38, fontWeight: 'bold', color: COLORS.green},
  searchSort: {
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
    fontWeight: 'bold',
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
    plus: { fontSize: 22, color: COLORS.white, fontWeight: 'bold' },
    line: {
        width: 25,
        height: 2,
        backgroundColor: COLORS.dark,
        marginBottom: 5,
        marginRight: 3,
      },
});
export default HomePage;
