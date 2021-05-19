import * as React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'
import { HealthInfo, useHealthInfoState } from 'context'

/** 기초 문진 데이터 */
const basicQuestionnaire = {
  name: '김성엽',
  message: '만 24세 남성 B형\n서울시 광진구 자양 3동\n010-1234-1234',
}

/** 마이페이지 */
export default function MyPageScreen({ navigation }) {
  const healthInfo: HealthInfo = useHealthInfoState()

  //메소드를 호출하면서 파라미터로 클릭된 아이템의 index번호 받아야함.
  const clickItem = (data: any) => {
    navigation.navigate('Diagnosis', data)
    // 클릭한 아이템의 name값??
    //alert(data)
  }

  return (
    <ScrollView style={style.container}>
      <Text style={style.textTitle}>진료 기록</Text>
      <Text style={style.textSemiTitle}>기초 문진</Text>
      {
        <TouchableOpacity
          style={[style.item, { marginBottom: 26 }]}
          onPress={() => {
            clickItem(0)
          }}>
          <MaterialCommunityIcons name="file-document-edit" color={'#81C4A7'} size={48} />
          <View style={{ flexDirection: 'column', marginLeft: 14 }}>
            <Text style={[style.itemName, { marginBottom: 6 }]}>{basicQuestionnaire.name}</Text>
            <Text style={style.itemMessage}>{basicQuestionnaire.message}</Text>
          </View>
        </TouchableOpacity>
      }
      <Text style={style.textSemiTitle}>초진 내역</Text>
      {healthInfo.diagnosis.map((data, index) => {
        return (
          // onPress에서 요소를 제어 할 수 없어서 화살표 함수를 이용함.
          <View>
            <Text style={style.textDateTitle}>{format(data.date, 'yyyy-MM-dd')}</Text>
            <TouchableOpacity
              key={index}
              style={[style.item, { flexDirection: 'column', alignItems: 'flex-start' }]}
              onPress={() => {
                clickItem(data)
              }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={[style.itemMessage, { marginBottom: 6 }]}>질병</Text>
                <Text style={style.itemName}>{data.disease[0].name}</Text>
              </View>
              <View style={{ width: 300, marginVertical: 14, height: 2, backgroundColor: '#f2f2f2f2' }} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={[style.itemMessage, { marginBottom: 6 }]}>진료과</Text>
                <Text style={style.itemName}>{data.department[0].name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      })}
      {/** 바텀텝에 가려지지 않도록 띄워주는 빈 공간 */}
      <View style={{ height: 60 }} />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f3f3' },
  item: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  itemImg: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 18,
  },
  itemMessage: {
    fontSize: 14,
    color: '#555555',
  },
  textTitle: {
    marginTop: 50,
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
  textSemiTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 24,
  },
  textDateTitle: {
    marginBottom: 6,
    fontSize: 16,
  },
})
