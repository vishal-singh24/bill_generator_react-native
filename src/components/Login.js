import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {colors} from './constants/color'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Keychain from 'react-native-keychain'



const LoginScreen = ({setIsauthenticated}) => {

    const navigation=useNavigation()
    const [secureEntry, setSecureEntry] = useState(true);
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [emailError,setEmailError]=useState('');
    const [passwordError,setPasswordError]=useState('');

    const regexEmail = (text) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
        return regex.test(text);
      }

      //-------------Email Validation-------------//
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

    const validatePassword=(text)=>{
        setPassword(text);
        if(!regexPassword(text)){
            setPasswordError('must contain lower,upper and special character')
        }
        else
        setPasswordError('')
    }
    
    const handleLogin=async()=>{
        if(!email||!password){
            Alert.alert("Alert",": Please Enter both email and password");
            return;
        }
        try{


            //----------------getting email and password from localStorage using Keychain
            const Credentials= await Keychain.getGenericPassword();
            console.log(Credentials);



            //---------------getting email and password from localStorage using AsyncStorage
            //const getuserName=await AsyncStorage.getItem('email');
            // console.log(`username:${getuserName}`);
            // console.log(`email:${email}`)
            // const getpassword=await AsyncStorage.getItem('password');
            // console.log(`password:${getpassword}`)
            // console.log(`password:${password}`)
            if(email==Credentials.username && password==Credentials.password)
            {
                setIsauthenticated(true);
            }
            else{
                Alert.alert("Error","Invalid Credentials");
            }
        }catch{
            Alert.alert('Error',"Credentials do not match");
        }
    };
    return (
        <View style={styles.container}>
            {/* <TouchableOpacity style={styles.backButtonWrapper} onPress={back}>
                <Ionicons name={"arrow-back-outline"} size={25} />
            </TouchableOpacity> */}
            <View style={styles.textContainer}>
                <Text style={styles.headingText}>Hey,</Text>
                <Text style={styles.headingText}>Welcome</Text>
                <Text style={styles.headingText}>Back</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name={"mail-outline"} size={25} color={colors.secondary} />
                    <TextInput style={styles.textInput} placeholder='Enter your Email' placeholderTextColor={colors.secondary}
                        keyboardType='email-address' onChangeText={(text)=>{
                            if(text.trim()===''){
                                setEmailError('')
                            }
                            else
                            validateEmail(text)}}
                    />
                </View>
                {emailError ? <Text style={{ color: 'red', marginTop: 5, flexDirection: 'row-reverse' }}>{emailError}</Text> : null}

                <View style={[styles.inputContainer]}>
                    <SimpleLineIcons name={"lock"} size={25} color={colors.secondary} />
                    <TextInput style={styles.textInput} placeholder='Enter your password' placeholderTextColor={colors.secondary}
                        secureTextEntry={secureEntry} onChangeText={(text)=>{
                            //setPassword(text);
                            if(text.trim()===''){
                                setPasswordError('');
                            }
                            else
                            validatePassword(text)}}
                    />
                    <TouchableOpacity onPress={() =>
                        setSecureEntry((prev) => !prev)
                    } style={{position:'absolute',right:30, transform: [{ translateY: 0 }]}}>
                        <SimpleLineIcons name={"eye"} size={25} color={colors.secondary} />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={{ color: 'red', marginTop: 5, flexDirection: 'row-reverse' }}>{passwordError}</Text> : null}

                <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginWrapper} onPress={handleLogin}>
                    <Text style={styles.loginText}>
                        Login
                    </Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row-reverse',paddingVertical:20}}>
                <TouchableOpacity onPress={()=>navigation.reset({index:0,routes:[{name:'Signup'}]})}>
                        <Text style={{color:'blue'}}>
                            SignUp
                        </Text>
                    </TouchableOpacity>
                    <Text>
                        Not a Member?
                    </Text>
                    
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    loginWrapper:{
        backgroundColor:colors.primary,
        marginTop:20,
        borderRadius:100
       
    },
    loginText:{
        fontSize:20,
        color:colors.white,
        textAlign:'center',
        
        padding:20


    },
    container: {
        backgroundColor: colors.white,
        flex: 1,
        padding: 20
    },
    textContainer: {
        marginVertical: 20
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
        flex:1,
        fontSize: 14,
        paddingHorizontal: 20,
        marginRight:90
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'right'
    }

})
export default LoginScreen