// =====================================================================
// [NiceAuthButton.jsx] - NICE 본인인증 버튼 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   1. 버튼 클릭 → GET /api/auth/nice/request 로 encData 요청
//   2. 팝업 창 오픈 후 NICE 서버에 폼 POST
//   3. NICE 인증 완료 → 우리 백엔드 /api/auth/nice/success 콜백
//   4. 백엔드 HTML이 window.opener.niceAuthComplete(result) 호출
//   5. 인증 결과를 onAuth 콜백으로 전달
//
// 📌 세션 캐시 (useCache=true)
//   - 아이디찾기 ↔ 비밀번호찾기 간 공유용
//   - 10분 내 재인증 불필요

import { useState, useCallback } from 'react';
import styles from './NiceAuthButton.module.css';

const SESSION_KEY = 'nice_auth_result';
const SESSION_TTL = 10 * 60 * 1000; // 10분

/** 세션 캐시에서 NICE 인증 결과 조회 */
export function getNiceAuthCache() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { result, ts } = JSON.parse(raw);
    if (Date.now() - ts > SESSION_TTL) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return result;
  } catch {
    return null;
  }
}

/** 세션 캐시에 NICE 인증 결과 저장 */
export function setNiceAuthCache(result) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ result, ts: Date.now() }));
  } catch {}
}

/** 세션 캐시 삭제 */
export function clearNiceAuthCache() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

/**
 * NICE 본인인증 버튼
 *
 * @param {function} onAuth    - 인증 완료 콜백 ({ success, name, birthDate, gender, mobileNo, di })
 * @param {boolean}  useCache  - true면 세션 캐시 사용 (FindId/FindPw 간 공유)
 * @param {string}   label     - 버튼 텍스트 (기본: '본인인증')
 * @param {string}   className - 추가 CSS 클래스
 */
function NiceAuthButton({ onAuth, useCache = false, label = '본인인증', className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    // 세션 캐시 확인 (재인증 불필요)
    if (useCache) {
      const cached = getNiceAuthCache();
      if (cached) {
        onAuth(cached);
        return;
      }
    }

    setLoading(true);
    try {
      // 1. 서버에서 암호화된 요청 데이터 수신
      const res = await fetch('/api/auth/nice/request?authType=M');
      if (!res.ok) throw new Error('인증 요청 데이터 수신 실패');
      const { formUrl, encData } = await res.json();

      // 2. 부모 창에 콜백 함수 등록 (NICE 팝업이 호출)
      window.niceAuthComplete = (result) => {
        window.niceAuthComplete = null;
        setLoading(false);
        if (result && result.success) {
          if (useCache) setNiceAuthCache(result);
          onAuth(result);
        } else {
          alert(result?.errorMsg || '본인인증에 실패했습니다.');
        }
      };

      // 3. 팝업 창 오픈
      const popup = window.open(
        '',
        'niceAuthPopup',
        'width=500,height=620,scrollbars=yes,resizable=no,left=200,top=100'
      );
      if (!popup) {
        alert('팝업이 차단되었습니다.\n팝업을 허용한 후 다시 시도해 주세요.');
        window.niceAuthComplete = null;
        setLoading(false);
        return;
      }

      // 4. 팝업에 NICE 폼 제출
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = formUrl;
      form.target = 'niceAuthPopup';

      [['m', 'checkplusSerivce'], ['EncodeData', encData]].forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // 5. 팝업이 닫혔는데 콜백이 없으면 → 사용자가 취소한 것
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          if (window.niceAuthComplete) {
            window.niceAuthComplete = null;
            setLoading(false);
          }
        }
      }, 500);

    } catch (e) {
      console.error('NICE 인증 오류:', e);
      alert('본인인증 요청 중 오류가 발생했습니다.');
      window.niceAuthComplete = null;
      setLoading(false);
    }
  }, [onAuth, useCache]);

  return (
    <button
      type="button"
      className={`${styles.niceBtn} ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      <span className={styles.icon}>🔐</span>
      {loading ? '인증 진행 중...' : label}
    </button>
  );
}

export default NiceAuthButton;
