import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { colors } from './constants/color'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import KeyChain from 'react-native-keychain'



const SignUpScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordError,setRePasswordError]=useState('');

  const regexEmail = (text) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    return regex.test(text);
  }

  const validateEmail = (text) => {
    setEmail(text);
    if (!regexEmail(text)) {
      setEmailError("not valid email");

    } else {
      setEmailError("");
    }
  }


  const regexPassword = (text, field) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/
    return regex.test(text);
  }

  const validatePassword = (text, field) => {
    if (field == 'password') {
      setPassword(text);
      if (!regexPassword(text)) {
        setPasswordError('must contain 8 letters and lower,upper and special character');
      } else {
        setPasswordError('');
      }


    }
    else if (field == 'repassword') {
      setRePassword(text);
      if (text!=password) {
        setRePasswordError('password do not match')
      }
      else {
        setRePasswordError('')
      }
    }
    
  }


  const handleSignUp = async () => {
    if (!email || !password || !repassword) {
      Alert.alert("Alert", ": Please Enter all the details");
      return;
    }
    if (password != repassword) {
      Alert.alert("Alert", "Both the password should be same");
      return;
    }
    try {


      //--------------------Storage using KeyChain (Secure Storage)--------------
      await KeyChain.setGenericPassword(email, password)



      //------------------Storage using AsyncStorage---------------//

      // await AsyncStorage.setItem('email',email);
      // await AsyncStorage.setItem('password',password);


      Alert.alert("Success", "Registration Sucessfull");

      navigation.navigate('Login');

    } catch (error) {
      Alert.alert("Error", "Some Error Occured", error);
    }
  };
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.backButtonWrapper} onPress={back}>
                <Ionicons name={"arrow-back-outline"} size={25} />
            </TouchableOpacity> */}
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Fill, The Details to Become a Mamber</Text>
        {/* <Text style={styles.headingText}>The</Text>
        <Text style={styles.headingText}>Details to Become Member</Text> */}
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={25} color={colors.secondary} />
          <TextInput style={styles.textInput} placeholder='Enter your Email' placeholderTextColor={colors.secondary}
            keyboardType='email-address' onChangeText={(text)=>{
              if(text.trim()==='')
              {
                setEmailError('')
              }
              else
              validateEmail(text)}}
          />

        </View>
        {emailError ? <Text style={{ color: 'red', marginTop: 5, textAlign:'right' }}>{emailError}</Text> : null}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={25} color={colors.secondary} />
          <TextInput style={styles.textInput} placeholder='Enter your password' placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry} onChangeText={(text) => 
            {
              if(text.trim()==='')
              {
                setPasswordError('')
              }
              else
              validatePassword(text, 'password')}}
          />
          <TouchableOpacity onPress={() =>
            setSecureEntry((prev) => !prev)
          } style={{position:'absolute',right:-50}}>
            <SimpleLineIcons name={"eye"} size={25} color={colors.secondary} style={{ paddingHorizontal: 90 }} />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={{ color: 'red', marginTop: 5, flexDirection: 'row-reverse' }}>{passwordError}</Text> : null}

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={25} color={colors.secondary} />
          <TextInput style={styles.textInput} placeholder='ReEnter your password' placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry} onChangeText={(text) => {
              if(text.trim()==='')
              {
                setRePasswordError('')
              }
              else
              validatePassword(text, "repassword")}}
          />
          <TouchableOpacity onPress={() =>
            setSecureEntry((prev) => !prev)
          } style={{position:'absolute',right:-50}}>
            <SimpleLineIcons name={"eye"} size={25} color={colors.secondary} style={{ paddingHorizontal: 90 }} />
          </TouchableOpacity>
        </View>
        {rePasswordError ? <Text style={{ color: 'red', marginTop: 5, flexDirection: 'row-reverse' }}>{rePasswordError}</Text> : null}
        <TouchableOpacity style={styles.loginWrapper} onPress={handleSignUp}>
          <Text style={styles.loginText}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row-reverse', paddingVertical: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: 'blue', fontSize: 15 }}>
              SignIn
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 15 }}>
            Already a Member?
          </Text>

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loginWrapper: {
    backgroundColor: colors.primary,
    marginTop: 20,
    borderRadius: 100,


  },
  loginText: {
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',

    padding: 20


  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 20
  },
  textContainer: {
    marginVertical: 20,

  },
  backButtonWrapper: {
    backgroundColor: colors.grey,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
  },
  formContainer: {
    marginTop: 20
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 5,
    marginVertical: 10,
    position:'relative'
  },
  textInput: {
    fontSize: 14,
    paddingHorizontal: 20
  },
  forgotPassword: {
    marginTop: 10,
    textAlign: 'right'
  }

})
export default SignUpScreen