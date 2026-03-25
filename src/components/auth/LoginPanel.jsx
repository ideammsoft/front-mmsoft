// =====================================================================
// [LoginPanel.jsx] - 로그인 팝업 패널 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - 로그인 아이디/비밀번호 입력 폼을 보여줍니다.
//   - 백엔드 POST /api/auth/login API를 호출합니다.
//   - 로그인 성공 시 사용자 정보를 localStorage에 저장합니다.
//   - 회원가입, 아이디찾기, 비밀번호찾기 패널로 이동할 수 있습니다.
//   - 소셜 로그인(Google, Naver, Kakao) 버튼도 포함됩니다.
//
// 📌 Props (부모 컴포넌트에서 전달받는 값)
//   - onClose         : 이 패널을 닫는 함수 (Header에서 전달)
//   - onLoginSuccess  : 로그인 성공 시 실행할 함수 (Header에서 전달)
//
// 📌 async/await와 fetch란?
//   - fetch('URL', 옵션) : 서버에 HTTP 요청을 보내는 브라우저 내장 함수
//   - async: 이 함수는 비동기(시간이 걸리는 작업)를 포함함을 선언
//   - await: 비동기 작업이 완료될 때까지 기다림
//   - try { } catch { } : 에러가 발생하면 catch 블록에서 처리
//
//   예) await fetch(url) → 서버 응답이 올 때까지 기다렸다가 처리
//       없으면: 서버 응답을 기다리지 않고 다음 코드가 실행되어 버림
//
// 📌 useRef란?
//   - DOM 요소(실제 HTML 태그)에 직접 접근할 때 사용합니다.
//   - passwordRef.current?.focus() : 비밀번호 input에 포커스를 줌
//   - useState와 달리 값이 바뀌어도 화면을 다시 그리지 않습니다.

import { useState, useRef } from 'react';
import Input from '../common/Input';                   // 공통 Input 컴포넌트
import Button from '../common/Button';                 // 공통 Button 컴포넌트
import SocialLoginButtons from './SocialLoginButtons'; // 소셜 로그인 버튼 묶음
import ProfileCompletionPanel from './ProfileCompletionPanel'; // 추가정보 입력 패널
import SignUpPanel from './SignUpPanel';               // 회원가입 패널
import FindIdPanel from './FindIdPanel';               // 아이디 찾기 패널
import FindPasswordPanel from './FindPasswordPanel';   // 비밀번호 찾기 패널
import styles from './LoginPanel.module.css';

function LoginPanel({ onClose, onLoginSuccess }) {
  // 아이디 입력값 상태
  const [username, setUsername] = useState('');
  // 비밀번호 입력값 상태
  const [password, setPassword] = useState('');

  // 각 서브 패널의 표시 여부 상태 (false = 숨김)
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showSignUp,            setShowSignUp]            = useState(false);
  const [showFindId,            setShowFindId]            = useState(false);
  const [showFindPassword,      setShowFindPassword]      = useState(false);

  // 비밀번호 input DOM 요소에 접근하기 위한 ref
  // 아이디 찾기 후 비밀번호 input에 자동 포커스할 때 사용
  const passwordRef      = useRef(null);
  const overlayMouseDown = useRef(false);

  // 로그인 폼 제출 처리
  const handleSubmit = async (e) => {
    // e.preventDefault(): 폼의 기본 동작(페이지 새로고침)을 막음
    // React에서 폼은 항상 preventDefault()를 호출해야 합니다
    e.preventDefault();

    try {
      // 백엔드 POST /api/auth/login API 호출
      // 포트 1882: API Gateway 포트 (또는 member-service 직접 포트)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // JSON 형식으로 전송
        // JSON.stringify(): 객체 → JSON 문자열 변환
        // 예) { homepageId: "hong", password: "1234" } → '{"homepageId":"hong","password":"1234"}'
        body: JSON.stringify({ homepageId: username, password }),
        credentials: 'include', // RefreshToken 쿠키를 서버에서 받기 위해 필요
      });

      if (!res.ok) {
        // HTTP 상태코드가 400, 401, 403 등 에러인 경우
        const err = await res.json().catch(() => ({}));
        alert(err.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      // 로그인 성공: 응답 body에서 사용자 정보 꺼내기
      const data = await res.json();

      // AccessToken을 localStorage에 저장
      // 이후 API 호출 시 Authorization: Bearer {accessToken} 헤더에 첨부
      if (data.accessToken) {
        localStorage.setItem('mmsoft_access_token', data.accessToken);
      }

      // 사용자 이름 localStorage에 저장 (헤더에 "홍길동님 반갑습니다" 표시용)
      const name = data.name || data.user?.name || username;
      localStorage.setItem('mmsoft_user', JSON.stringify({ name, homepageId: username }));

      // 부모(Header)에게 로그인 성공을 알림 → 헤더 UI가 업데이트됨
      onLoginSuccess?.({ name }); // ?.: onLoginSuccess가 undefined일 때 에러 방지
      onClose(); // 로그인 패널 닫기

    } catch {
      // 네트워크 오류 등
      alert('서버 연결에 실패했습니다.');
    }
  };

  // 아이디 찾기 성공 후 호출되는 콜백
  // 찾은 아이디를 아이디 input에 자동으로 채워줍니다
  const handleFoundId = (foundId) => {
    setUsername(foundId); // 아이디 input에 자동 입력
    // 100ms 후 비밀번호 input에 포커스 이동 (사용자 편의를 위해)
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  // ─── 화면 렌더링 ───
  return (
    // 오버레이(반투명 배경) - 바깥 영역 클릭 시 패널 닫기
    <div
      className={styles.overlay}
      onMouseDown={e => { overlayMouseDown.current = e.target === e.currentTarget; }}
      onMouseUp={e => { if (overlayMouseDown.current && e.target === e.currentTarget) onClose(); }}
    >
      {/* 실제 패널 박스 - 클릭 이벤트가 오버레이로 전파되지 않도록 stopPropagation */}
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

        {/* 패널 헤더 (제목 + 닫기 버튼) */}
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>로그인</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* 아이디 입력 필드 */}
          <div className={styles.fieldRow}>
            <label htmlFor="username" className={styles.fieldLabel}>아 이 디</label>
            <input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              // onChange: 사용자가 타이핑할 때마다 username 상태 업데이트
              onChange={(e) => setUsername(e.target.value)}
              className={styles.fieldInput}
              required // HTML5 필수 입력 검증
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className={styles.fieldRow}>
            <label htmlFor="password" className={styles.fieldLabel}>비밀번호</label>
            <input
              id="password"
              ref={passwordRef} // 이 DOM 요소를 passwordRef에 연결
              type="password"   // 입력 내용이 ***로 표시됨
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.fieldInput}
              required
            />
          </div>

          {/* 로그인 버튼 (Button 공통 컴포넌트 사용) */}
          <Button type="submit" variant="primary" size="lg">
            로그인
          </Button>

          {/* 하단 링크: 회원가입, 아이디찾기, 비밀번호찾기 */}
          <div className={styles.links}>
            {/* onClick으로 각 서브 패널을 열기 */}
            <span className={styles.link} onClick={() => setShowSignUp(true)}>
              회원가입
            </span>
            <span className={styles.link} onClick={() => setShowFindId(true)}>
              아이디 찾기
            </span>
            <span className={styles.link} onClick={() => setShowFindPassword(true)}>
              비밀번호 찾기
            </span>
          </div>
        </form>

        {/* 소셜 로그인 버튼 (Google, Naver, Kakao) */}
        <SocialLoginButtons />

        <div className={styles.info}>
          데모 버전입니다 &nbsp;|&nbsp;
          <span className={styles.link} onClick={() => setShowProfileCompletion(true)}>
            추가정보 입력 테스트
          </span>
        </div>
      </div>

      {/* 서브 패널들: 해당 상태가 true일 때만 렌더링됨 */}
      {showProfileCompletion && (
        <ProfileCompletionPanel onClose={() => setShowProfileCompletion(false)} />
      )}

      {showSignUp && (
        <SignUpPanel
          onClose={() => setShowSignUp(false)}
          onSuccess={(userId) => {
            setUsername(userId);      // 가입한 아이디를 자동 입력
            setShowSignUp(false);     // 회원가입 패널 닫기
            setTimeout(() => passwordRef.current?.focus(), 100); // 비밀번호 입력으로 포커스
          }}
        />
      )}

      {showFindId && (
        <FindIdPanel
          onClose={() => setShowFindId(false)}
          onFoundId={handleFoundId} // 찾은 아이디를 받아 input에 채워주는 함수
        />
      )}

      {showFindPassword && (
        <FindPasswordPanel onClose={() => setShowFindPassword(false)} />
      )}
    </div>
  );
}

export default LoginPanel;
