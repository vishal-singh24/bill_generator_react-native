
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/components/Home';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomerList from './src/components/CustomerList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Example from './src/components/Example';
import LoginScreen from './src/components/Login';
import SignUpScreen from './src/components/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from './src/components/ForgotPasswordScreen';
import Keychain from 'react-native-keychain'
import { ActivityIndicator, Alert } from 'react-native';
import { View } from 'react-native'

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const [authenticated, setIsauthenticated] = useState(false);
  const [loader, setLoader] = useState(true);

  //---------------function to set authenticated value based on whether Keychain exists or not---------------//
  useEffect(() => {
    const authentication = async () => {
      try {
        const isloggedin = await Keychain.getGenericPassword();
        if (isloggedin != null) {
          setIsauthenticated(true);
        }
        else {
          setIsauthenticated(false)
        }

      } catch {
        setIsauthenticated(false);
        Alert.alert('Error', 'Could not check credentials')
      } finally {
        setLoader(false);
      }
    }
    authentication();
  }, [])



  //-------------function to handle Logout--------------//
  const handleLogout = async () => {
    try {
      await Keychain.resetGenericPassword();
      setIsauthenticated(false);

    } catch (error) {
      Alert.alert('Error', "Could Not logout", error)
    }
  }


  //------Authentication Stack-----------//
  const AuthStack = () => (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='Login'  >

        {(props) => <LoginScreen{...props} setIsauthenticated={setIsauthenticated} />}

      </Stack.Screen>
      <Stack.Screen name='Signup' component={SignUpScreen} />
      <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />

    </Stack.Navigator>
  );


  //------------------Drawer Screens----------//
  const Appdrawer = () => (

    <Drawer.Navigator initialRouteName='Bill Generator'>
      <Drawer.Screen name="Bill Generator" component={Home} />
      <Drawer.Screen name="CustomerList" component={CustomerList} />
      <Drawer.Screen name="Log Out"  >
        {() => {
          handleLogout();
          return null;
        }}
      </Drawer.Screen>
    </Drawer.Navigator>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {loader ?
          (
            <View>
              <ActivityIndicator size='large' style={{justifyContent:'center',alignItems:'center'}}/>
            </View>
          ) :

          (authenticated ?
            <Appdrawer />
            :
            <AuthStack />)}
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App