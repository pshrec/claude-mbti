import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // E/I 질문 (1-3)
  {
    id: 1,
    dimension: 'EI',
    text: '주말에 친구들이 갑자기 놀자고 할 때',
    optionA: {
      text: '좋아! 어디 가? 🎉',
      type: 'E',
    },
    optionB: {
      text: '음... 집이 최고야 🏠',
      type: 'I',
    },
  },
  {
    id: 2,
    dimension: 'EI',
    text: '새로운 모임에 갔을 때 나는',
    optionA: {
      text: '여기저기 돌아다니며 인사하기',
      type: 'E',
    },
    optionB: {
      text: '아는 사람 옆에 가만히 있기',
      type: 'I',
    },
  },
  {
    id: 3,
    dimension: 'EI',
    text: '에너지 충전 방법은?',
    optionA: {
      text: '사람들과 수다 떨기 ☕',
      type: 'E',
    },
    optionB: {
      text: '혼자만의 시간 갖기 🎧',
      type: 'I',
    },
  },

  // S/N 질문 (4-6)
  {
    id: 4,
    dimension: 'SN',
    text: '친구가 "너 내일 뭐 해?" 물어보면',
    optionA: {
      text: '10시에 일어나서, 점심 먹고, 카페 가고...',
      type: 'S',
    },
    optionB: {
      text: '그냥 여유롭게~ 뭐 어떻게든 되겠지',
      type: 'N',
    },
  },
  {
    id: 5,
    dimension: 'SN',
    text: '영화나 드라마를 볼 때 나는',
    optionA: {
      text: '스토리와 디테일에 집중한다',
      type: 'S',
    },
    optionB: {
      text: '숨겨진 의미나 복선을 찾는다',
      type: 'N',
    },
  },
  {
    id: 6,
    dimension: 'SN',
    text: '새로운 일을 시작할 때',
    optionA: {
      text: '매뉴얼대로 차근차근 📋',
      type: 'S',
    },
    optionB: {
      text: '일단 감으로 시작하고 보자 🚀',
      type: 'N',
    },
  },

  // T/F 질문 (7-9)
  {
    id: 7,
    dimension: 'TF',
    text: '친구가 고민 상담을 할 때',
    optionA: {
      text: '해결책을 제시해준다 💡',
      type: 'T',
    },
    optionB: {
      text: '일단 공감하고 위로한다 🤗',
      type: 'F',
    },
  },
  {
    id: 8,
    dimension: 'TF',
    text: '중요한 결정을 내릴 때',
    optionA: {
      text: '장단점을 논리적으로 분석한다',
      type: 'T',
    },
    optionB: {
      text: '마음이 가는 대로 따른다',
      type: 'F',
    },
  },
  {
    id: 9,
    dimension: 'TF',
    text: '누군가 비효율적으로 일할 때',
    optionA: {
      text: '더 나은 방법을 알려준다',
      type: 'T',
    },
    optionB: {
      text: '그 사람 방식을 존중한다',
      type: 'F',
    },
  },

  // J/P 질문 (10-12)
  {
    id: 10,
    dimension: 'JP',
    text: '여행 갈 때 나는',
    optionA: {
      text: '숙소, 맛집, 일정 다 짜놓는다 📝',
      type: 'J',
    },
    optionB: {
      text: '비행기만 끊고 나머지는 현지에서 🌴',
      type: 'P',
    },
  },
  {
    id: 11,
    dimension: 'JP',
    text: '과제나 업무 마감 스타일은?',
    optionA: {
      text: '미리미리 끝내놔야 마음이 편해',
      type: 'J',
    },
    optionB: {
      text: '마감 직전 몰아치기가 효율 최고',
      type: 'P',
    },
  },
  {
    id: 12,
    dimension: 'JP',
    text: '갑자기 계획이 바뀌면?',
    optionA: {
      text: '스트레스 받는다 😤',
      type: 'J',
    },
    optionB: {
      text: '오히려 좋아~ 새로운 모험! 😎',
      type: 'P',
    },
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
