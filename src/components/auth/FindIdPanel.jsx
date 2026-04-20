// =====================================================================
// [FindIdPanel.jsx] - 아이디 찾기 팝업 패널 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - NICE 본인인증으로 신원 확인 후 가입된 아이디를 조회합니다.
//   - 백엔드 POST /api/auth/idpassfind API를 호출합니다.
//   - 찾은 아이디를 LoginPanel의 아이디 input에 자동으로 채워줍니다.
//   - 비밀번호찾기와 10분 내 인증 공유 (세션 캐시)

import { useState } from 'react';
import Button from '../common/Button';
import NiceAuthButton, { getNiceAuthCache } from './NiceAuthButton';
import styles from './LoginPanel.module.css';
import findStyles from './FindIdPanel.module.css';

function FindIdPanel({ onClose, onFoundId }) {
  // 서버 요청 중 여부
  const [loading, setLoading] = useState(false);

  // NICE 인증 후 자동으로 아이디 찾기 진행
  const handleNiceAuth = async (niceResult) => {
    setLoading(true);
    try {
      const body = {
        idOrPass: 'id',
        openId  : '',
        email   : '',
        phone   : niceResult.mobileNo || '',
      };

      const res = await fetch('/api/auth/idpassfind', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body),
      });

      const text   = await res.text();
      const result = text.trim();

      if (!res.ok) {
        alert('가입하신 아이디가 없습니다.');
        return;
      }

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
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 세션 캐시에 이미 인증 결과가 있으면 바로 조회
  const handleCachedAuth = () => {
    const cached = getNiceAuthCache();
    if (cached) {
      handleNiceAuth(cached);
    }
  };

  const hasCached = !!getNiceAuthCache();

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>아이디 찾기</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <p className={findStyles.description}>
          NICE 본인인증으로 신원 확인 후 가입된 아이디를 조회합니다.
        </p>

        <div className={styles.form}>
          {hasCached ? (
            <>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
                이전 본인인증이 유효합니다.
              </p>
              <Button variant="primary" size="lg" onClick={handleCachedAuth} disabled={loading}>
                {loading ? '조회 중...' : '아이디 조회'}
              </Button>
              <div style={{ textAlign: 'center', margin: '8px 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>또는</div>
              <NiceAuthButton onAuth={handleNiceAuth} useCache label="다시 본인인증" />
            </>
          ) : (
            <NiceAuthButton onAuth={handleNiceAuth} useCache label="본인인증 후 아이디 찾기" />
          )}

          {loading && (
            <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              조회 중...
            </p>
          )}

          <div className={styles.links}>
            <span className={styles.link} onClick={onClose}>
              로그인으로 돌아가기
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindIdPanel;
