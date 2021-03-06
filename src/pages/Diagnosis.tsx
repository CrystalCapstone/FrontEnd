import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { mainColor } from 'common'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Marker } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'

const questionnairekey = ['흡연', '음주', '운동', '병력', '가족력']
const { height, width } = Dimensions.get('window')

interface ILocation {
  latitude: number
  longitude: number
}

/** 가짜 기초문진내역, 필요시 인덱스별로 가져다 쓰도록 함 */
const tempBasicQuestionnaire = [
  ['피우지 않습니다', '일주일에 두 번', '일주일에 한 번', '당뇨병', '암'],
  ['피우지 않습니다', '일주일에 두 번', '일주일에 한 번', '당뇨병', '암'],
  ['일주일에 두 갑', '마시지 않습니다.', '일주일에 두 번', '없음', '암'],
]

/** 초진내역 */
export default function Diagnosis({ route }) {
  const [location, setLocation] = useState<ILocation | undefined>({ latitude: 37.538712, longitude: 127.082366 })

  //위치 구하기
  useEffect(() => {
    // 현재 위치 담아두기
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({
          latitude,
          longitude,
        })
      },
      (error) => {
        console.log(error.code, error.message)
      },
      // 타임아웃 거는거
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }, [])

  let isAllLightDiease = true
  route.params.diagnosis.disease.map((diseaseInfo) => {
    if (diseaseInfo.level !== '경증 질환') {
      isAllLightDiease = false
    }
  })

  return (
    <ScrollView style={style.container}>
      <Text style={style.textTitle}>{route.params.diagnosis.date}</Text>
      <Text style={style.textSemiTitle}>예상 질병(증상 유사도 분석)</Text>
      {isAllLightDiease && (
        <Text style={{ fontSize: 14, color: mainColor, width: 320, marginBottom: 12 }}>
          {'Tip! 경증 질병일 확률이 높습니다.\n지역응급의료기관 방문을 추천합니다.'}
        </Text>
      )}
      {route.params.diagnosis.disease.map((diseaseInfo, index) => (
        <View style={[style.item, { marginBottom: 10 }]} key={index}>
          <View style={{ flexDirection: 'column', marginLeft: 4 }}>
            <Text style={[style.itemName, { marginBottom: 6 }]}>{diseaseInfo.name + ' - ' + diseaseInfo.level}</Text>
            <Text style={style.itemMessage}>{diseaseInfo.description}</Text>
          </View>
        </View>
      ))}
      <Text style={[style.textSemiTitle, { marginTop: 18 }]}>증상</Text>
      <View style={[style.item, { flexDirection: 'column', alignItems: 'flex-start' }]}>
        {route.params.diagnosis.symptom.map((symptomInfo, index) => {
          return (
            <View key={index}>
              <Text style={style.itemName}>{symptomInfo}</Text>
              {index < route.params.diagnosis.symptom.length - 1 && (
                <View style={{ width: 320, marginVertical: 14, height: 2, backgroundColor: '#f2f2f2f2' }} />
              )}
            </View>
          )
        })}
      </View>
      <Text style={[style.textSemiTitle, { marginTop: 18 }]}>기초문진</Text>
      <View style={[style.item, { flexDirection: 'column', alignItems: 'flex-start' }]}>
        {tempBasicQuestionnaire[route.params.index].map((questionnaire, index) => {
          return (
            <View key={index}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 320 }}>
                <Text style={[style.itemName, { color: '#666666' }]}>{questionnairekey[index]}</Text>
                <Text style={[style.itemName, { color: '#333333' }]}>{questionnaire}</Text>
              </View>
              {index < 4 && (
                <View style={{ width: 320, marginVertical: 14, height: 2, backgroundColor: '#f2f2f2f2' }} />
              )}
            </View>
          )
        })}
      </View>
      <View style={[style.item, { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 320 }}>
          <Text style={[style.itemName, { color: '#666666' }]}>복용중인 약</Text>
          <Text style={[style.itemName, { color: '#333333' }]}>{route.params.diagnosis.medicationBeingTaken}</Text>
        </View>
      </View>

      {/* 병원 지도 */}
      <Text style={[style.textSemiTitle, { marginTop: 18 }]}>병원 안내</Text>
      <View style={{ alignItems: 'center' }}>
        {location && (
          <MapView
            showsUserLocation={true}
            showsMyLocationButton={true}
            provider={PROVIDER_GOOGLE}
            style={style.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0522,
              longitudeDelta: 0.0021,
            }}>
            {route.params.diagnosis.hospital.map((data, index) => {
              let emgCongestion = ''
              if (data.emgCongestion._text === 'Y') {
                emgCongestion = '응급실 인원 : 혼잡'
              } else {
                emgCongestion = '응급실 인원 : 원활'
              }
              if (data.dutyEmclsName._text === '권역응급의료센터' && isAllLightDiease === false) {
                return (
                  <Marker
                    key={index}
                    coordinate={{ latitude: data.wgs84Lat._text * 1, longitude: data.wgs84Lon._text * 1 }}
                    title={data.dutyName._text}
                    description={
                      data.dutyEmclsName._text +
                      ' (심각한 중증 진료 추천)' +
                      '\n' +
                      data.dutyAddr._text +
                      '\n' +
                      emgCongestion +
                      '\n' +
                      '번호 : ' +
                      data.dutyTel1._text
                    }
                    pinColor="red"
                  />
                )
              } else if (data.dutyEmclsName._text === '지역응급의료센터' && isAllLightDiease === false) {
                return (
                  <Marker
                    key={index}
                    coordinate={{ latitude: data.wgs84Lat._text * 1, longitude: data.wgs84Lon._text * 1 }}
                    title={data.dutyName._text}
                    description={
                      data.dutyEmclsName._text +
                      ' (지역내 중증 진료 추천)' +
                      '\n' +
                      data.dutyAddr._text +
                      '\n' +
                      emgCongestion +
                      '\n' +
                      '번호 : ' +
                      data.dutyTel1._text
                    }
                    pinColor="red"
                  />
                )
              } else if (data.dutyEmclsName._text === '지역응급의료기관') {
                //지역응급의료기관
                return (
                  <Marker
                    key={index}
                    coordinate={{ latitude: data.wgs84Lat._text * 1, longitude: data.wgs84Lon._text * 1 }}
                    title={data.dutyName._text}
                    description={
                      data.dutyEmclsName._text +
                      ' (경증 진료 추천)' +
                      '\n' +
                      data.dutyAddr._text +
                      '\n' +
                      emgCongestion +
                      '\n' +
                      '번호 : ' +
                      data.dutyTel1._text
                    }
                    pinColor="green"
                  />
                )
              }
            })}
          </MapView>
        )}
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f3f3f3' },
  item: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
  },
  itemMessage: {
    fontSize: 14,
    color: '#555555',
  },
  textTitle: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
  textSemiTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 24,
  },
  map: {
    height: width - 32,
    width: width - 32,
    borderRadius: 10,
  },
})
