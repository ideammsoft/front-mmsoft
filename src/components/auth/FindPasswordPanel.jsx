// =====================================================================
// [FindPasswordPanel.jsx] - 비밀번호 찾기(임시 비밀번호 발급) 패널
// =====================================================================
//
// 흐름:
//   1. NICE 본인인증 → 휴대폰번호 확보
//   2. 그 휴대폰으로 가입된 "아이디 목록"(/api/auth/idlist) 조회
//      - 0개 → 가입정보 없음
//      - 1개 → 바로 임시비번 발급
//      - 2개+ → 아이디 선택 UI 표시 → 선택한 아이디로 발급
//   3. 임시비번은 문자(알리고) 발송, 실패 시 이메일 폴백 (channel 로 안내 분기)

import { useState } from 'react';
import Button from '../common/Button';
import NiceAuthButton, { getNiceAuthCache } from './NiceAuthButton';
import styles from './LoginPanel.module.css';
import findStyles from './FindIdPanel.module.css';

function FindPasswordPanel({ onClose }) {
  const [loading, setLoading]   = useState(false);
  const [accounts, setAccounts] = useState([]);   // 같은 휴대폰의 중복 아이디 목록
  const [phone, setPhone]       = useState('');    // NICE 인증 휴대폰번호

  // 발송 채널(sms|email|none)에 따른 안내
  const notifyAndClose = (channel) => {
    if (channel === 'email') {
      alert('휴대폰 문자 발송에 실패하여, 가입하신 이메일로 임시 비밀번호를 보내드렸습니다. 이메일을 확인해 주세요.');
      onClose();
    } else if (channel === 'sms') {
      alert('휴대폰 문자메시지로 임시 비밀번호를 보내드렸습니다. 확인 바랍니다.');
      onClose();
    } else {
      alert('임시 비밀번호 발송에 실패했습니다.\n등록된 휴대폰/이메일을 확인할 수 없습니다. 고객센터(1544-7576)로 문의해 주세요.');
    }
  };

  // 특정 아이디(openId)로 임시 비밀번호 발급
  const requestTempPassword = async (openId, ph) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/idpassfind', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ idOrPass: 'password', openId: openId || '', email: '', phone: ph }),
      });
      const result = (await res.text()).trim();

      let isOk = false;
      let channel = 'sms';
      try {
        const parsed = JSON.parse(result);
        isOk = parsed.newPassword === 'ok';
        channel = parsed.channel || 'sms';
      } catch {
        isOk = result === 'ok';
      }

      if (isOk) notifyAndClose(channel);
      else alert('가입하신 정보가 없거나 일치하지 않습니다.');
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // NICE 인증 완료 → 휴대폰으로 아이디 목록 조회 후 분기
  const handleNiceAuth = async (niceResult) => {
    const ph = niceResult.mobileNo || '';
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/idlist', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ phone: ph }),
      });
      const data = await res.json().catch(() => ({ list: [] }));
      const ids  = data.list || [];

      if (ids.length === 0) {
        alert('가입하신 정보가 없거나 일치하지 않습니다.');
      } else if (ids.length === 1) {
        await requestTempPassword(ids[0].openId, ph);
      } else {
        // 같은 휴대폰에 여러 아이디 → 선택 UI 표시
        setPhone(ph);
        setAccounts(ids);
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCachedAuth = () => {
    const cached = getNiceAuthCache();
    if (cached) handleNiceAuth(cached);
  };

  const hasCached = !!getNiceAuthCache();

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>비밀번호 찾기</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        {accounts.length > 1 ? (
          /* ── 같은 휴대폰에 여러 아이디: 선택 ── */
          <>
            <p className={findStyles.description}>
              같은 휴대폰으로 가입된 아이디가 여러 개입니다.<br />
              임시 비밀번호를 받을 아이디를 선택해 주세요.
            </p>
            <div className={styles.form}>
              {accounts.map((a) => (
                <Button key={a.openId} variant="primary" size="lg" disabled={loading}
                  onClick={() => requestTempPassword(a.openId, phone)}>
                  {a.openId}{a.name ? ` (${a.name})` : ''}
                </Button>
              ))}
              {loading && (
                <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>처리 중...</p>
              )}
              <div className={styles.links}>
                <span className={styles.link} onClick={() => setAccounts([])}>← 뒤로</span>
              </div>
            </div>
          </>
        ) : (
          /* ── 기본: 본인인증 ── */
          <>
            <p className={findStyles.description}>
              NICE 본인인증으로 신원 확인 후 임시 비밀번호를 휴대폰 문자메시지로 발송해 드립니다. (문자 발송이 어려우면 가입 이메일로 발송)
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
          </>
        )}
      </div>
    </div>
  );
}

export default FindPasswordPanel;
