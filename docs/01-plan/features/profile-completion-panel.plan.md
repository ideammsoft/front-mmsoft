# Plan: profile-completion-panel

## 1. Overview
- **Feature Name**: profile-completion-panel (추가정보 입력 패널)
- **Created**: 2026-02-19
- **Level**: Dynamic
- **Status**: In Progress

## 2. Background & Problem

### 현재 상태 (AS-IS)
- 로그인 후 휴대폰번호가 없는 사용자를 처리하는 화면 없음
- 추가 정보(휴대폰번호, 회사명, 성명, 이메일) 입력 UI 없음

### 목표 상태 (TO-BE)
- 로그인 후 휴대폰번호가 없을 경우 추가정보 입력 패널 표시
- LoginPanel과 동일한 크기(max-width: 400px) 및 스타일의 모달 패널
- 휴대폰번호(필수), 회사명, 성명, 이메일 4개 입력 필드
- 휴대폰번호 미입력 시 "휴대폰 번호는 필수 입력 사항 입니다" 유효성 메시지 표시
- 제출 시 alert 표시 (정적 프로토타입)

## 3. UI 레이아웃

```
┌─────────────────────────────┐
│ 추가 정보 입력          [×] │
├─────────────────────────────┤
│ 서비스 이용을 위해          │
│ 추가 정보를 입력해 주세요.  │
│                             │
│ 휴대폰 번호 *               │
│ [010-0000-0000          ]   │
│ ⚠ 휴대폰 번호는 필수        │
│   입력 사항 입니다          │
│                             │
│ 회사명                      │
│ [회사명을 입력하세요    ]   │
│                             │
│ 성명                        │
│ [이름을 입력하세요      ]   │
│                             │
│ 이메일                      │
│ [이메일을 입력하세요    ]   │
│                             │
│ [      확인      ]          │
└─────────────────────────────┘
```

## 4. Scope

### In Scope
- `ProfileCompletionPanel.jsx` 신규 생성 (`src/components/auth/`)
- `ProfileCompletionPanel.module.css` 신규 생성
- 4개 입력 필드: 휴대폰번호(필수), 회사명, 성명, 이메일
- 휴대폰번호 필수 유효성 검사 + 에러 메시지
- LoginPanel과 동일한 overlay + panel 구조 (max-width: 400px)
- 확인 버튼 클릭 시 alert (정적 프로토타입)
- `LoginPanel.jsx`에서 데모용 트리거 버튼 추가 (추가정보 입력 테스트용)

### Out of Scope
- 실제 백엔드 API 연동
- 휴대폰 번호 형식 정규식 유효성 검사 (기본 필수 여부만)
- 이메일 형식 유효성 검사

## 5. User Story

```
As a 로그인한 사용자 (휴대폰번호 미등록)
I want to 추가 정보 입력 화면에서 휴대폰번호를 등록할 수 있다
So that 서비스를 정상적으로 이용할 수 있다

Acceptance:
- 휴대폰번호 미입력 후 확인 → "휴대폰 번호는 필수 입력 사항 입니다" 표시
- 휴대폰번호 입력 후 확인 → alert 표시
- [×] 닫기 버튼으로 패널 닫기
```

## 6. Acceptance Criteria

- [ ] LoginPanel과 동일한 overlay + panel 스타일 (max-width: 400px)
- [ ] 패널 제목: "추가 정보 입력" + 닫기(×) 버튼
- [ ] 안내 문구: "서비스 이용을 위해 추가 정보를 입력해 주세요."
- [ ] 휴대폰 번호 입력 필드 (필수, label에 * 표시)
- [ ] 회사명 입력 필드
- [ ] 성명 입력 필드
- [ ] 이메일 입력 필드
- [ ] 휴대폰번호 빈 채로 확인 시 → 에러 메시지 표시
- [ ] 에러 메시지 텍스트: "휴대폰 번호는 필수 입력 사항 입니다"
- [ ] 에러 메시지 색상: var(--color-error) (#ef4444)
- [ ] 모든 필드 입력 후 확인 클릭 → alert('추가 정보가 저장되었습니다.')
- [ ] 모바일 반응형 지원

## 7. Technical Approach

### 파일 구조
```
src/components/auth/
├── LoginPanel.jsx                      (수정: 데모 트리거 추가)
├── ProfileCompletionPanel.jsx          (신규)
└── ProfileCompletionPanel.module.css   (신규)
```

### 컴포넌트 Props
```jsx
// ProfileCompletionPanel
{
  onClose: () => void   // 닫기 버튼 핸들러
}
```

### 상태 관리
```jsx
const [phone, setPhone] = useState('');
const [company, setCompany] = useState('');
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phoneError, setPhoneError] = useState('');
```

### 유효성 검사 로직
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!phone.trim()) {
    setPhoneError('휴대폰 번호는 필수 입력 사항 입니다');
    return;
  }
  setPhoneError('');
  alert('추가 정보가 저장되었습니다.');
};
```

### CSS 공유 전략
- overlay, panel, panelHeader, title, closeButton → LoginPanel.module.css 동일 패턴 복제
- 새로운 클래스: `.description`, `.errorMessage`, `.requiredMark`

## 8. Priority & Timeline
- **Priority**: High (로그인 플로우 연속성)
- **Effort**: Small (2~3h)
- **Dependencies**: LoginPanel.jsx, Input 컴포넌트, Button 컴포넌트

## 9. Demo 진입 방법 (정적 프로토타입)
LoginPanel 하단 "데모 버전입니다" 영역에 "추가정보 입력 테스트" 링크 추가하여
ProfileCompletionPanel을 별도로 열 수 있게 함.
