# Plan: social-login-buttons

## 1. Overview
- **Feature Name**: social-login-buttons (소셜 로그인 버튼)
- **Created**: 2026-02-19
- **Level**: Dynamic
- **Status**: In Progress
- **Style**: Modern Corporate (2025-2026 Trend)

## 2. Background & Problem

### 현재 상태 (AS-IS)
- `LoginPanel.jsx`에 아이디/비밀번호 입력 폼만 존재
- 소셜 로그인 버튼 없음 (구글, 네이버, 카카오 미지원)
- 정적 프로토타입으로 alert만 표시하는 구조
- 사용자가 간편 로그인 옵션을 사용할 수 없는 상태

### 목표 상태 (TO-BE)
- 구글(Google), 네이버(Naver), 카카오(Kakao) 소셜 로그인 버튼 추가
- LoginPanel 내 구분선("또는") 이후 소셜 버튼 영역 배치
- 각 브랜드 공식 색상 및 로고 SVG 아이콘 적용
- 현재 프로토타입이므로 클릭 시 alert 메시지 표시
- 모던 디자인 시스템 (variables.css) 준수

## 3. Design Direction

### 소셜 버튼 스펙
| 플랫폼 | 배경색 | 텍스트색 | 아이콘 | 텍스트 |
|--------|--------|----------|--------|--------|
| Google | #ffffff | #3c4043 | SVG G로고 | Google로 계속하기 |
| Naver  | #03C75A | #ffffff | SVG 네이버 N | 네이버로 계속하기 |
| Kakao  | #FEE500 | #000000 | SVG 카카오 말풍선 | 카카오로 계속하기 |

### UI 레이아웃
```
[ 로그인 폼 ]
  아이디 입력
  비밀번호 입력
  [ 로그인 버튼 ]
  회원가입 | 아이디 찾기 | 비밀번호 찾기

──────── 또는 ────────

  [ G Google로 계속하기 ]
  [ N 네이버로 계속하기 ]
  [ K 카카오로 계속하기 ]
```

## 4. Scope

### In Scope
- `SocialLoginButtons.jsx` 신규 컴포넌트 생성 (auth 폴더)
- `SocialLoginButtons.module.css` 신규 스타일 생성
- `LoginPanel.jsx` 수정: SocialLoginButtons 컴포넌트 통합
- 각 버튼 클릭 시 `alert('구글 로그인은 구현 예정입니다.')` 표시

### Out of Scope
- 실제 OAuth 인증 연동 (백엔드 필요)
- 리다이렉트 처리 및 토큰 관리
- 회원가입 플로우

## 5. User Story

```
As a 사용자
I want to 소셜 계정(구글/네이버/카카오)으로 간편 로그인 버튼을 볼 수 있다
So that 나중에 백엔드 연동 시 소셜 로그인 기능을 쉽게 사용할 수 있다
```

## 6. Acceptance Criteria

- [ ] LoginPanel에 "또는" 구분선이 표시된다
- [ ] 구글 버튼: 흰색 배경, 회색 테두리, G 아이콘, "Google로 계속하기" 텍스트
- [ ] 네이버 버튼: #03C75A 배경, 흰색 텍스트, N 아이콘, "네이버로 계속하기" 텍스트
- [ ] 카카오 버튼: #FEE500 배경, 검정 텍스트, 카카오 아이콘, "카카오로 계속하기" 텍스트
- [ ] 각 버튼 hover 효과 (밝기 변화)
- [ ] 버튼 클릭 시 해당 플랫폼 안내 alert 표시
- [ ] 모바일 반응형 지원 (전체 너비)

## 7. Technical Approach

### 파일 구조
```
src/components/auth/
├── LoginPanel.jsx          (수정)
├── LoginPanel.module.css   (수정 가능)
├── SocialLoginButtons.jsx  (신규)
└── SocialLoginButtons.module.css  (신규)
```

### 아이콘 처리
- 외부 라이브러리 없이 인라인 SVG 사용
- 각 브랜드 공식 SVG 아이콘 직접 삽입

### 컴포넌트 구조
```jsx
// SocialLoginButtons.jsx
function SocialLoginButtons() {
  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인은 구현 예정입니다.`);
  };
  return (
    <div>
      <Divider text="또는" />
      <GoogleButton onClick={() => handleSocialLogin('구글')} />
      <NaverButton onClick={() => handleSocialLogin('네이버')} />
      <KakaoButton onClick={() => handleSocialLogin('카카오')} />
    </div>
  );
}
```

## 8. Priority & Timeline
- **Priority**: Medium
- **Effort**: Small (2~3h)
- **Dependencies**: LoginPanel.jsx (기존 컴포넌트)

## 9. Risks
- 소셜 로그인 아이콘 SVG 라이선스 → 공식 브랜드 가이드라인 준수 필요
- 실제 OAuth 연동 시 별도 백엔드 작업 필요 (현재 스코프 외)
