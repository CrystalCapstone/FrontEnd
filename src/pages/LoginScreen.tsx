import React, { useState, createRef } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

//import Loader from './Components/Loader'

const LoginScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  //const [loading, setLoading] = useState(false)
  const [errortext, setErrortext] = useState('')

  const passwordInputRef = createRef()

  const handleSubmitPress = () => {
    setErrortext('')
    if (!userEmail) {
      alert('이메일을 입력해주세요!')
      return
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요!')
      return
    }
    // setLoading(true)
    let dataToSend = { id: userEmail, password: userPassword }
    let formBody = []
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key)
      let encodedValue = encodeURIComponent(dataToSend[key])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')

    //fetch('http://localhost:3000/api/user/login', {
    fetch('http://52.78.126.183:3000/caps/login', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        //setLoading(false)
        console.log(responseJson)
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          AsyncStorage.setItem('user_id', responseJson.data.email)
          console.log(responseJson.data.email)
          alert('로그인성공!')
        } else {
          setErrortext(responseJson.msg)
          console.log('아이디나 비밀번호 확인해주세요')
        }
      })
      .catch(error => {
        //Hide Loader
        //setLoading(false)
        console.error(error)
        alert('??')
      })
  }

  return (
    <View style={styles.mainBody}>
      {/* <Loader loading={loading} /> */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/images/logo.png')}
                style={{
                  width: '50%',
                  height: 200,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 40 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.titleFTextStyle}>
                  응급한
                  <Text style={styles.titleETextStyle}> 목소리</Text>
                </Text>
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserEmail => setUserEmail(UserEmail)}
                  placeholder="이메일" //dummy@abc.com
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  // onSubmitEditing={() =>
                  //   passwordInputRef.current && passwordInputRef.current.focus()
                  // }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserPassword => setUserPassword(UserPassword)}
                  placeholder="비밀번호" //1234
                  placeholderTextColor="#8b9cb5"
                  keyboardType="default"
                  //ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>로그인</Text>
              </TouchableOpacity>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate('RegisterScreen')}>
                회원가입
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  )
}
export default LoginScreen

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#69BFA0',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 45,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#3F7360',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  titleFTextStyle: {
    color: '#F27979',
    fontWeight: 'bold',
    paddingVertical: 10,
    fontSize: 25,
  },
  titleETextStyle: {
    color: '#000000',
    fontWeight: 'bold',
    paddingVertical: 10,
    fontSize: 25,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#9CD9C2',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
    marginBottom: 20,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
})
