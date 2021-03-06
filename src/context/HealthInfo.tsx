import React, { ReactNode, createContext, useContext, useState } from 'react'

/** 기초문진 데이터 타입 */
export interface BasicQuestionnaire {
  smoking:
    | '피우지 않습니다'
    | '일주일에 한 갑'
    | '일주일에 두 갑'
    | '일주일에 세 갑'
    | '일주일에 네 갑'
    | '일주일에 다섯 갑 이상'
  drink:
    | '마시지 않습니다.'
    | '일주일에 한 번'
    | '일주일에 두 번'
    | '일주일에 세 번'
    | '일주일에 네 번'
    | '일주일에 다섯 번'
    | '일주일에 여섯 번'
    | '매일'
  exercise:
    | '하지 않아요'
    | '일주일에 한 번'
    | '일주일에 두 번'
    | '일주일에 세 번'
    | '일주일에 네 번'
    | '일주일에 다섯 번'
    | '일주일에 여섯 번'
    | '매일'
  medicalHistory: '암' | '뇌졸중' | '심근경색' | '고혈압' | '당뇨병' | '없음'
  familyHistory: '암' | '뇌졸중' | '심장병(심근경색/협심증)' | '고혈압' | '당뇨병' | '이상지질혈증' | '패결핵' | '없음'
}

export interface Disease {
  name: string
  description: string
  level: '경증 질환' | '중증 질환'
}

/** 초진 데이터 타입 */
export interface Diagnosis {
  date: string
  symptom: string[]
  disease: Disease[]
  /** 병원 정보 협의 후에 수정 */
  hospital: any
  medicationBeingTaken: string
}

export interface HealthInfo {
  basicQuestionnaire: BasicQuestionnaire | null
  diagnosis: Diagnosis[]
}

const initialState: HealthInfo = {
  basicQuestionnaire: null,
  diagnosis: [
    {
      date: '2021.05.21',
      symptom: ['배 아픔', '열이 남', '설사'],
      disease: [
        {
          name: '위장염1',
          description:
            '급성 위장염은 위장관의 염증 상태를 말하여 위나 소장에 염증이 발생한 것을 말합니다. 바이러스의 감염, 박테리아나 기생충의 감염에 의해 발생하게 됩니다.',
          level: '경증 질환',
        },
        { name: '식중독', description: '식중독은 상한 음식을 먹었을 때 주로 발생하며', level: '경증 질환' },
        {
          name: '장폐색',
          description: '장폐색은 블라블라 때문에 발생하며 뭐뭐를 증상으로 가진다. 즉시 조치해야 한다.',
          level: '중증 질환',
        },
      ],
      hospital: 'something',
      medicationBeingTaken: '없음',
    },
    {
      date: '2021.05.02',
      symptom: ['기침', '열이 남', '토함', '기침', '열이 남', '토함'],
      disease: [
        {
          name: '위장염2',
          description:
            '급성 위장염은 위장관의 염증 상태를 말하여 위나 소장에 염증이 발생한 것을 말합니다. 바이러스의 감염, 박테리아나 기생충의 감염에 의해 발생하게 됩니다.',
          level: '경증 질환',
        },
        { name: '식중독', description: '식중독은 상한 음식을 먹었을 때 주로 발생하며', level: '경증 질환' },
        {
          name: '장폐색',
          description: '장폐색은 블라블라 때문에 발생하며 뭐뭐를 증상으로 가진다. 즉시 조치해야 한다.',
          level: '경증 질환',
        },
      ],
      hospital: 'sample',
      medicationBeingTaken: '감기약',
    },
    {
      date: '2021.04.22',
      symptom: ['배 아픔', '열이 남', '설사'],
      disease: [
        {
          name: '위장염3',
          description:
            '급성 위장염은 위장관의 염증 상태를 말하여 위나 소장에 염증이 발생한 것을 말합니다. 바이러스의 감염, 박테리아나 기생충의 감염에 의해 발생하게 됩니다.',
          level: '경증 질환',
        },
        { name: '식중독', description: '식중독은 상한 음식을 먹었을 때 주로 발생하며', level: '경증 질환' },
        {
          name: '장폐색',
          description: '장폐색은 블라블라 때문에 발생하며 뭐뭐를 증상으로 가진다. 즉시 조치해야 한다.',
          level: '경증 질환',
        },
      ],
      hospital: 'temp',
      medicationBeingTaken: '없음',
    },
  ],
}

const HealthInfoContext = createContext<HealthInfo>(initialState)
const HealthInfoDispatchContext = createContext<React.Dispatch<React.SetStateAction<HealthInfo>>>(() => {})

function HealthInfoProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<HealthInfo>(initialState)

  return (
    <HealthInfoDispatchContext.Provider value={setState}>
      <HealthInfoContext.Provider value={state}>{props.children}</HealthInfoContext.Provider>
    </HealthInfoDispatchContext.Provider>
  )
}

/** state 참조용 커스텀 hook */
export function useHealthInfoState() {
  const state = useContext(HealthInfoContext)

  if (!state) {
    throw new Error('Provider not found')
  }

  return state
}

/** Reducer 참조용 커스텀 hook */
export function useHealthInfoSetState() {
  const state = useContext(HealthInfoDispatchContext)

  if (!state) {
    throw new Error('Provider not found')
  }

  return state
}

export { HealthInfoContext, HealthInfoProvider }
