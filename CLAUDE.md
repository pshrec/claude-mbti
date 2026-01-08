# MBTI 찐테스트 개발 가이드라인

## 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (또는 Next.js 14)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Image Export**: html2canvas
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (또는 Next.js API Routes)
- **Database**: PostgreSQL
- **Caching**: Redis (통계 데이터, TTL 60초)

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway 또는 Render
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (에러 추적), Google Analytics
- **Image CDN**: Cloudinary

---

## 코드 스타일

### TypeScript
- `strict` 모드 필수
- `any` 타입 사용 금지, 필요시 `unknown` 사용
- 인터페이스는 `I` 접두사 없이 명사로 명명 (예: `User`, `Question`)
- 타입은 `Type` 접미사 사용 (예: `MBTIType`, `AnswerType`)

```typescript
// Good
interface Question {
  id: number;
  text: string;
  options: Option[];
}

// Bad
interface IQuestion { ... }
```

### React 컴포넌트
- 함수형 컴포넌트만 사용
- 파일명은 PascalCase (예: `QuestionCard.tsx`)
- 한 파일에 한 컴포넌트
- Props 인터페이스는 컴포넌트명 + `Props` (예: `QuestionCardProps`)

```typescript
interface QuestionCardProps {
  question: Question;
  onSelect: (answer: string) => void;
}

export function QuestionCard({ question, onSelect }: QuestionCardProps) {
  return ( ... );
}
```

### Tailwind CSS
- 인라인 클래스 우선, 반복되면 `@apply`로 추출
- 색상은 디자인 시스템 변수 사용
- 모바일 퍼스트: 기본 스타일이 모바일, `md:`, `lg:`로 확장

```tsx
// 모바일 퍼스트 예시
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
```

### 네이밍 컨벤션
| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `ResultPage`, `ProgressBar` |
| 함수/변수 | camelCase | `calculateMBTI`, `currentQuestion` |
| 상수 | SCREAMING_SNAKE_CASE | `MAX_QUESTIONS`, `API_BASE_URL` |
| 파일 (컴포넌트) | PascalCase | `QuestionCard.tsx` |
| 파일 (유틸) | camelCase | `mbtiCalculator.ts` |
| CSS 클래스 | kebab-case | `result-card`, `share-button` |

### 폴더 구조
```
src/
├── components/          # 재사용 UI 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Button, Card)
│   └── features/       # 기능별 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── stores/             # Zustand 스토어
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── constants/          # 상수 (질문, MBTI 데이터)
├── styles/             # 글로벌 스타일
└── api/                # API 호출 함수
```

---

## 개발 원칙

### 1. 모바일 퍼스트
- 모든 UI는 모바일(375px) 기준으로 먼저 개발
- Breakpoints: Mobile(기본) → Tablet(768px) → Desktop(1024px)
- 터치 타겟 최소 44x44px

### 2. 성능 최적화
- 이미지는 WebP 포맷, lazy loading 적용
- 번들 사이즈 최소화 (dynamic import 활용)
- Lighthouse 점수 90+ 유지
- 초기 로딩 3초 이내

### 3. 사용자 경험
- 로딩 상태는 항상 스켈레톤 UI 표시
- 에러 발생 시 사용자 친화적 메시지 + 재시도 옵션
- LocalStorage로 테스트 진행 상황 자동 저장
- 답변 선택 후 0.5초 뒤 자동 다음 질문 이동

### 4. 접근성 (A11y)
- WCAG AA 준수 (색상 대비 4.5:1 이상)
- 모든 인터랙티브 요소 키보드 접근 가능
- 시맨틱 HTML + ARIA 레이블
- `prefers-reduced-motion` 지원

### 5. 코드 품질
- ESLint + Prettier 설정 필수
- 커밋 전 lint 검사 통과
- 복잡한 비즈니스 로직은 유틸 함수로 분리
- 매직 넘버 금지, 상수로 정의

---

## 디자인 시스템

### 색상 (Tailwind 확장)
```javascript
// tailwind.config.js
colors: {
  primary: {
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
  },
  secondary: {
    400: '#F472B6',
    500: '#EC4899',
  },
}
```

### 간격
- 4px 단위 시스템 (4, 8, 12, 16, 24, 32, 48, 64)
- 컴포넌트 간격: 16px
- 섹션 간격: 48px(모바일), 64px(데스크톱)

### 애니메이션
- Fast: 150ms (호버)
- Medium: 300ms (전환)
- Slow: 500ms (큰 요소)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## Git 컨벤션

### 브랜치 전략
- `main`: 프로덕션 배포
- `develop`: 개발 통합
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### 커밋 메시지
```
<type>: <subject>

[body]
```

**Types:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `style`: 스타일링 (기능 변경 없음)
- `refactor`: 리팩토링
- `docs`: 문서
- `chore`: 설정, 빌드

**예시:**
```
feat: 결과 페이지 이미지 저장 기능 추가

- html2canvas로 결과 카드 이미지 생성
- 1080x1920 인스타그램 스토리 비율 적용
```

---

## API 엔드포인트

```
POST /api/submit-result    # 테스트 결과 제출
GET  /api/stats            # 전체 통계 조회
GET  /api/result/:type     # MBTI 유형 정보 조회
```

### 응답 형식
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 테스트

### 필수 테스트 케이스
- MBTI 계산 로직 (12문항 → 16유형 매핑)
- 답변 저장/복원 (LocalStorage)
- 공유 이미지 생성
- API 에러 핸들링

### 테스트 도구
- Unit: Vitest
- E2E: Playwright (권장)

---

## 환경 변수

```env
# .env.local
VITE_API_BASE_URL=
VITE_KAKAO_APP_KEY=
VITE_GA_TRACKING_ID=
VITE_SENTRY_DSN=
```

---

## 체크리스트 (배포 전)

- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개
- [ ] 모바일/태블릿/데스크톱 반응형 확인
- [ ] Lighthouse 성능 90+
- [ ] OG 태그 설정 완료
- [ ] 에러 바운더리 설정
- [ ] Analytics 이벤트 트래킹
