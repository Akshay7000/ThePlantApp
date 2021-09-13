// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar, StyleSheet, Text,View,Image} from 'react-native';
import {Router, Scene, Stack} from 'react-native-router-flux';
import Cart from './src/assets/Cart';
import DetailScreen from './src/DetailScreen';
import HomePage from './src/HomePage';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from './src/assets/constants/color';
import Fav from './src/Fav';
import Profile from './src/Profile';
const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

const App = () => {
  // const Stack = createNativeStackNavigator();
  const TabIcon = ({ selected, title }) => {
    return <Text name={title} style={{ color: selected ? 'red' : 'black' }} >{title}</Text>
  };


  const SettingsTab = (props) => {
   
    let textColor =!props.focused ? COLORS.black : COLORS.green
    const settingImageFocused = {uri:"https://img-premium.flaticon.com/png/512/552/premium/552909.png?token=exp=1630776181~hmac=78751fb1c58574548fbe25625f566a8b"}
    const settingImageUnfocused = {uri:"https://cdn-icons-png.flaticon.com/512/1621/1621561.png"}
    let settingImage = props.focused ? settingImageFocused : settingImageUnfocused
    let borderColor = props.focused ? COLORS.green : '#FFFFFF'
    return (
    <View style={{flex: 1, flexDirection:'column', alignItems:'center', justifyContent:'center', borderTopColor: borderColor, borderTopWidth:4, padding:10}}>
        {/* <Image source={settingImage} style={{ width: 20, height: 20 }} /> */}
        <Icon name={props.title} color={textColor} size={25}/>
    </View>
    );
    }
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#fff"
        barStyle="dark-content"
        showHideTransition="slide"
      />
      <Router>
        <Scene key="root">
          <Scene
            key="tabbar"
            tabs
            tabBarStyle={{backgroundColor: '#fff'}}
            hideNavBar={true}
            showLabel={false}    >
            <Scene key="Home" title="home" icon={SettingsTab}>
              <Scene
                key="home"
                component={HomePage}
                title="Home"
                initial
                hideNavBar={true}
              />
              
            </Scene>
            <Scene key="Fav" title="heart" icon={SettingsTab}>
              <Scene
                key="Fav"
                component={Fav}
                title="Fav"
                initial
                hideNavBar={true}
              />
            </Scene>
            <Scene key="Profile" title="user" icon={SettingsTab}>
              <Scene
                key="profile"
                component={Profile}
                title="Profile"
                initial
                hideNavBar={true}
              />
            </Scene>
          </Scene>
          <Scene
            key="home"
            component={HomePage}
            title="Home"
            hideNavBar={true}
          />
          <Scene
            key="detail"
            component={DetailScreen}
            title="Detail"
            hideNavBar={true}
          />
          <Scene key="cart" component={Cart} title="cart" hideNavBar={true} />
        </Scene>
      </Router>
    </>
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Home" component={HomePage} />

    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;
const styles = StyleSheet.create({
  tabBar: {
    height: 55,
    borderTopColor: 'darkgrey',
    borderTopWidth: 1,
    opacity: 0.98,
    justifyContent: 'space-between',
  },
});
