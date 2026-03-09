# Design: social-login-buttons

## 1. Overview
- **Feature Name**: social-login-buttons
- **Based on Plan**: `docs/01-plan/features/social-login-buttons.plan.md`
- **Created**: 2026-02-19
- **Level**: Dynamic

---

## 2. Component Architecture

### 파일 구조
```
src/components/auth/
├── LoginPanel.jsx                  (수정: SocialLoginButtons import 추가)
├── LoginPanel.module.css           (수정: 구분선 스타일 추가)
├── SocialLoginButtons.jsx          (신규)
└── SocialLoginButtons.module.css   (신규)
```

### 컴포넌트 계층
```
LoginPanel
├── panelHeader (기존)
├── form (기존)
│   ├── Input x2
│   ├── Button (로그인)
│   └── links (회원가입, 아이디 찾기, 비밀번호 찾기)
└── SocialLoginButtons (신규 추가)
    ├── divider ("또는")
    ├── SocialButton (Google)
    ├── SocialButton (Naver)
    └── SocialButton (Kakao)
```

---

## 3. Component Spec

### SocialLoginButtons.jsx

```jsx
// Props
{
  // 없음 (독립형 컴포넌트)
}

// 내부 구조
function SocialLoginButtons() {
  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인은 구현 예정입니다.`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>또는</span>
        <span className={styles.dividerLine} />
      </div>
      <div className={styles.buttons}>
        <button className={`${styles.socialBtn} ${styles.google}`} onClick={...}>
          <GoogleIcon />
          <span>Google로 계속하기</span>
        </button>
        <button className={`${styles.socialBtn} ${styles.naver}`} onClick={...}>
          <NaverIcon />
          <span>네이버로 계속하기</span>
        </button>
        <button className={`${styles.socialBtn} ${styles.kakao}`} onClick={...}>
          <KakaoIcon />
          <span>카카오로 계속하기</span>
        </button>
      </div>
    </div>
  );
}
```

---

## 4. Style Spec

### 버튼 공통 스타일
```css
.socialBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);   /* 8px */
  font-size: var(--font-size-base);  /* 1rem */
  font-weight: var(--font-weight-medium); /* 500 */
  cursor: pointer;
  transition: all var(--transition-base); /* 250ms ease */
  border: none;
  font-family: var(--font-family);
}
```

### 플랫폼별 색상 스펙

| 클래스 | background | color | border |
|--------|-----------|-------|--------|
| `.google` | `#ffffff` | `#3c4043` | `1px solid #dadce0` |
| `.naver` | `#03C75A` | `#ffffff` | `none` |
| `.kakao` | `#FEE500` | `#000000` | `none` |

### hover 효과
```css
.google:hover  { background-color: #f8f8f8; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
.naver:hover   { background-color: #02b350; }
.kakao:hover   { background-color: #f5dc00; }
```

### 구분선 스타일
```css
.divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);  /* 16px */
  margin: var(--spacing-lg) 0;  /* 24px 0 */
}
.dividerLine {
  flex: 1;
  height: 1px;
  background-color: var(--color-border);  /* #e2e8f0 */
}
.dividerText {
  font-size: var(--font-size-sm);   /* 0.875rem */
  color: var(--color-text-muted);   /* #94a3b8 */
  white-space: nowrap;
}
```

---

## 5. SVG Icon Spec

### Google Icon (18x18px)
공식 Google G 로고 SVG (4색 분할):
- 빨강: `#4285F4` (파랑 계통 → 실제 G 파랑)
- 공식 컬러: Blue `#4285F4`, Red `#EA4335`, Yellow `#FBBC05`, Green `#34A853`

```svg
<svg width="18" height="18" viewBox="0 0 18 18">
  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
</svg>
```

### Naver Icon (18x18px)
네이버 공식 N 아이콘:
```svg
<svg width="18" height="18" viewBox="0 0 24 24">
  <path fill="#ffffff" d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
</svg>
```

### Kakao Icon (18x18px)
카카오 공식 말풍선 아이콘:
```svg
<svg width="18" height="18" viewBox="0 0 24 24">
  <path fill="#000000" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.72 1.61 5.13 4.07 6.58l-.9 3.35a.38.38 0 0 0 .56.42l3.9-2.6a11.2 11.2 0 0 0 2.37.25c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
</svg>
```

---

## 6. LoginPanel.jsx 수정 사항

### 추가 내용 (form 태그 닫힌 후)
```jsx
// LoginPanel.jsx 수정 - form 태그 이후에 삽입
import SocialLoginButtons from './SocialLoginButtons';

// return 내부 panel div 안에서 form 뒤에 추가:
<SocialLoginButtons />
```

### LoginPanel.module.css 수정 없음
- SocialLoginButtons는 자체 CSS 모듈 사용
- LoginPanel의 `.info` 텍스트는 SocialLoginButtons 이후에 위치

---

## 7. Interaction Design

### 상태 흐름
```
[버튼 렌더링] → [hover: 밝기/그림자 효과] → [클릭] → [alert 표시]
```

### alert 메시지 스펙
| 클릭 버튼 | alert 메시지 |
|----------|-------------|
| Google   | `"Google 로그인은 구현 예정입니다."` |
| 네이버   | `"네이버 로그인은 구현 예정입니다."` |
| 카카오   | `"카카오 로그인은 구현 예정입니다."` |

---

## 8. Responsive Design

```css
/* 모바일: 버튼 패딩 축소 */
@media (max-width: 480px) {
  .socialBtn {
    padding: 10px 12px;
    font-size: var(--font-size-sm);
  }
}
```
- 버튼은 `width: 100%`로 모바일 자동 대응
- 아이콘 크기 18px 고정 (모든 디바이스)

---

## 9. Implementation Checklist

- [ ] `SocialLoginButtons.jsx` 생성
  - [ ] `handleSocialLogin` 함수 구현 (alert)
  - [ ] 구글 버튼 + SVG 아이콘
  - [ ] 네이버 버튼 + SVG 아이콘
  - [ ] 카카오 버튼 + SVG 아이콘
  - [ ] "또는" 구분선
- [ ] `SocialLoginButtons.module.css` 생성
  - [ ] `.container`, `.divider`, `.dividerLine`, `.dividerText`
  - [ ] `.buttons`, `.socialBtn`
  - [ ] `.google`, `.naver`, `.kakao` 색상 스타일
  - [ ] hover 효과
  - [ ] 반응형 미디어쿼리
- [ ] `LoginPanel.jsx` 수정
  - [ ] `SocialLoginButtons` import
  - [ ] form 이후 `<SocialLoginButtons />` 삽입
  - [ ] `.info` 제거 또는 유지 (선택)
