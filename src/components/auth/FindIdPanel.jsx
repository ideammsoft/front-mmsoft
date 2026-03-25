// =====================================================================
// [FindIdPanel.jsx] - 아이디 찾기 팝업 패널 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - 이메일 또는 휴대폰 번호를 입력받아 로그인 아이디를 찾습니다.
//   - 백엔드 POST /api/auth/idpassfind API를 호출합니다.
//   - 찾은 아이디를 LoginPanel의 아이디 input에 자동으로 채워줍니다.
//
// 📌 탭(Tab) UI 패턴
//   - method 상태로 '이메일로 찾기' vs '휴대폰으로 찾기'를 구분합니다.
//   - 선택된 탭에 따라 input의 type과 placeholder가 달라집니다.
//   - 탭 전환 시 input 값을 초기화합니다 (handleMethodChange).

import { useState } from 'react';
import Button from '../common/Button';
import styles from './LoginPanel.module.css';
import findStyles from './FindIdPanel.module.css';

function FindIdPanel({ onClose, onFoundId }) {
  // 찾기 방법: 'email' (이메일) 또는 'phone' (휴대폰)
  const [method, setMethod] = useState('email');

  // 이메일 또는 휴대폰 번호 입력값
  const [value, setValue] = useState('');

  // 서버 요청 중인지 여부 (중복 클릭 방지, 버튼 비활성화)
  const [loading, setLoading] = useState(false);

  // 아이디 찾기 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return; // 빈 값이면 요청 안 함

    // 백엔드 IdPassFindRequest 형식으로 요청 body 구성
    // idOrPass: 'id' → 아이디 찾기 요청임을 서버에 알림
    const body = {
      idOrPass: 'id',                               // 아이디 찾기 구분자
      openId  : '',                                 // 아이디 찾기는 아이디 불필요
      email   : method === 'email' ? value.trim() : '', // 이메일 방식이면 이메일 입력
      phone   : method === 'phone' ? value.trim() : '', // 전화번호 방식이면 전화번호 입력
    };

    setLoading(true); // 요청 시작: 버튼 비활성화

    try {
      const res = await fetch('/api/auth/idpassfind', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body),
      });

      const text = await res.text(); // 응답을 문자열로 읽기
      const result = text.trim();

      if (!res.ok) {
        alert('가입하신 아이디가 없습니다.');
      } else {
        // 서버 응답이 JSON인 경우 파싱 시도
        // 백엔드 응답: { "foundId": "hong123" }
        let foundId = result;
        let passwd  = undefined;
        try {
          const parsed = JSON.parse(result);
          foundId = parsed.foundId ?? parsed.id ?? parsed.userId ?? result;
          passwd  = parsed.password ?? undefined;
        } catch {
          // JSON 파싱 실패 시 텍스트 그대로 사용
        }

        if (!foundId || foundId === '없음') {
          alert('가입하신 아이디가 없습니다.');
        } else if (passwd === null || passwd === '') {
          alert('oAuth 가입자입니다.\n구글, 카카오, 네이버 로그인 회원입니다.');
        } else {
          alert(`가입하신 아이디는 "${foundId}" 입니다.`);
          onFoundId?.(foundId);
          onClose();
        }
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false); // 요청 완료: 버튼 다시 활성화 (성공/실패 상관없이 실행)
    }
  };

  // 탭(이메일/전화번호) 변경 시 입력값 초기화
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setValue(''); // 탭 변경 시 이전 입력값 지우기
  };

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>아이디 찾기</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <p className={findStyles.description}>
          가입 시 등록한 이메일 또는 휴대폰 번호로 아이디를 찾을 수 있습니다.
        </p>

        {/* 탭 UI: 이메일로 찾기 / 휴대폰으로 찾기 */}
        <div className={findStyles.tabs}>
          <button
            type="button"
            // 선택된 탭이면 tabActive 클래스 추가 (활성화된 스타일)
            className={`${findStyles.tab} ${method === 'email' ? findStyles.tabActive : ''}`}
            onClick={() => handleMethodChange('email')}
          >
            이메일로 찾기
          </button>
          <button
            type="button"
            className={`${findStyles.tab} ${method === 'phone' ? findStyles.tabActive : ''}`}
            onClick={() => handleMethodChange('phone')}
          >
            휴대폰으로 찾기
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            {/* 선택된 방법에 따라 레이블 변경 */}
            <label className={styles.fieldLabel}>
              {method === 'email' ? '이메일' : '휴대폰'}
            </label>
            <input
              type={method === 'email' ? 'email' : 'tel'} // 방법에 따라 input type 변경
              placeholder={method === 'email' ? '이메일 주소를 입력하세요' : '휴대폰 번호를 입력하세요'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={styles.fieldInput}
              required
              autoFocus // 패널 열리면 이 input에 자동 포커스
            />
          </div>

          {/* loading이 true면 버튼 비활성화 + 텍스트 변경 */}
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? '확인 중...' : '아이디 찾기'}
          </Button>

          <div className={styles.links}>
            <span className={styles.link} onClick={onClose}>
              로그인으로 돌아가기
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindIdPanel;
