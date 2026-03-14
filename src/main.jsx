// =====================================================================
// [main.jsx] - React 앱의 진입점(Entry Point)
// =====================================================================
//
// 📌 이 파일이 뭔가요?
//   - 브라우저가 가장 먼저 실행하는 JavaScript 파일입니다.
//   - index.html의 <div id="root"> 안에 React 앱 전체를 삽입합니다.
//
// 📌 React 동작 원리 (아주 간단히)
//   1. 브라우저가 index.html을 로드
//   2. index.html 안의 <div id="root">가 비어있음
//   3. main.jsx가 실행되어 <App /> 컴포넌트를 root div에 삽입
//   4. 이후 React가 화면을 관리 (Virtual DOM)
//
// 📌 StrictMode란?
//   - 개발 환경에서만 작동하는 "엄격 모드"입니다.
//   - 잠재적인 버그나 나쁜 패턴을 미리 경고해 줍니다.
//   - 배포(production) 환경에서는 자동으로 비활성화됩니다.
//
// 📌 import 문이란?
//   - 다른 파일의 기능을 가져오는 ES6 모듈 문법입니다.
//   - 예) import App from './App.jsx' → App.jsx의 App 함수를 가져옴

import { StrictMode } from 'react';          // 개발 모드 엄격 검사용
import { createRoot } from 'react-dom/client'; // React 앱을 DOM에 연결하는 함수
import './index.css';                          // 전역 스타일시트 (CSS 변수, 폰트 등)
import App from './App.jsx';                   // 최상위 컴포넌트

// document.getElementById('root') : index.html의 <div id="root">를 찾음
// createRoot() : 해당 요소를 React 앱의 루트로 만들어줌
// .render()    : 안에 전달한 JSX를 실제 DOM으로 렌더링(화면에 표시)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
