import * as React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
} from 'react-native'

const state = {
  sectionDatas: [
    // SectionList의 섹션 하나 객체에는 title, data 2개의 프로퍼티 필요
    { title: '병원 안내', data: ['코로나 안심 응급실'] },
    {
      title: '병원 진료과',
      data: [
        '호흡기 내과',
        '외상 외과',
        '산부인과',
        '이비인후과',
        '피부과',
        '안과',
        '재활 의학과',
        '정신과',
        '소아과',
        '감염내과',
      ],
    },
  ],
}

export default function HomeScreen() {
  return (
    <View style={style.root}>
      {/* 리스트에 그룹칭이 가능하 리스트뷰 */}
      {/* 3개의 필수 속성 */}
      {/* 1) section - 섹션 title과 섹션별 data들을 가진 대량의 데이터*/}
      {/* 2) renderSectionHeader - 섹션별 title영역에 그려질 컴포넌트를 리턴하는 콜백함수 지정 */}
      {/* 3) renderItem - 섹션별 Item영역에 그려질 컴포넌트를 리턴하는 콜백함수 지정 */}
      <SectionList
        sections={state.sectionDatas}
        renderSectionHeader={({ section }) => {
          return (
            <View style={style.sectionHeader}>
              <Text style={style.sectionTitle}>{section.title}</Text>
            </View>
          )
        }}
        renderItem={({ item, index, section }) => {
          return (
            <TouchableOpacity
              style={style.itemView}
              onPress={() => {
                clickItem(item)
              }}>
              <Text style={style.itemView}>{item}</Text>
            </TouchableOpacity>
          )
        }}
        // keyExtractor={(item,index)=>{return index}}
        //keyExtractor={(item, index) => index}
      ></SectionList>
    </View>
  )
}

const clickItem = (item: string) => {
  Alert.alert(item)
}

const style = StyleSheet.create({
  root: { flex: 1, padding: 20, marginTop: 50 },
  sectionHeader: {
    padding: 4,
    backgroundColor: '#eeeeee',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  itemView: {
    padding: 10,
    fontSize: 18,
  },
})
