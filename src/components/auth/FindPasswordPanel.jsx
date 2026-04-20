// =====================================================================
// [FindPasswordPanel.jsx] - 비밀번호 찾기(임시 비밀번호 발급) 패널
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   - NICE 본인인증으로 신원 확인 후 임시 비밀번호를 발급합니다.
//   - 백엔드 POST /api/auth/idpassfind API를 호출합니다.
//   - 성공 시 "문자메시지로 임시 비밀번호를 보내드렸습니다" 안내
//   - 아이디찾기와 10분 내 인증 공유 (세션 캐시)

import { useState } from 'react';
import Button from '../common/Button';
import NiceAuthButton, { getNiceAuthCache } from './NiceAuthButton';
import styles from './LoginPanel.module.css';
import findStyles from './FindIdPanel.module.css';

function FindPasswordPanel({ onClose }) {
  const [loading, setLoading] = useState(false);

  // NICE 인증 후 자동으로 비밀번호 찾기 진행
  const handleNiceAuth = async (niceResult) => {
    setLoading(true);
    try {
      const body = {
        idOrPass: 'password',
        openId  : '',
        email   : '',
        phone   : niceResult.mobileNo || '',
      };

      const res    = await fetch('/api/auth/idpassfind', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body),
      });
      const text   = await res.text();
      const result = text.trim();

      let isOk = false;
      try {
        const parsed = JSON.parse(result);
        isOk = parsed.newPassword === 'ok';
      } catch {
        isOk = result === 'ok';
      }

      if (isOk) {
        alert('휴대폰 문자메시지로 임시 비밀번호를 보내드렸습니다. 확인 바랍니다.');
        onClose();
      } else {
        alert('가입하신 정보가 없거나 일치하지 않습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
          <h3 className={styles.title}>비밀번호 찾기</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <p className={findStyles.description}>
          NICE 본인인증으로 신원 확인 후 임시 비밀번호를 휴대폰 문자메시지로 발송해 드립니다.
        </p>

        <div className={styles.form}>
          {hasCached ? (
            <>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
                이전 본인인증이 유효합니다.
              </p>
              <Button variant="primary" size="lg" onClick={handleCachedAuth} disabled={loading}>
                {loading ? '처리 중...' : '임시 비밀번호 받기'}
              </Button>
              <div style={{ textAlign: 'center', margin: '8px 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>또는</div>
              <NiceAuthButton onAuth={handleNiceAuth} useCache label="다시 본인인증" />
            </>
          ) : (
            <NiceAuthButton onAuth={handleNiceAuth} useCache label="본인인증 후 임시 비밀번호 받기" />
          )}

          {loading && (
            <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              처리 중...
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

export default FindPasswordPanel;
