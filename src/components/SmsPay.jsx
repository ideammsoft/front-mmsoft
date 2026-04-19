// =====================================================================
// [SmsPay.jsx] - 문자메시지 충전 결제 React 컴포넌트
// =====================================================================
// 사용법:
//   <SmsPay userId="아이디" phone="01012345678" email="user@example.com" />
//
// 또는 URL 파라미터에서 자동으로 id/phone/email 읽어옴 (standalone 모드)

import { useState, useEffect } from 'react';
import styles from './SmsPay.module.css';

const QUICK_AMOUNTS = [
  { label: '+1만원', value: 10000 },
  { label: '+5만원', value: 50000 },
  { label: '+10만원', value: 100000 },
  { label: '+50만원', value: 500000 },
];

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

function formatComma(n) {
  return n.toLocaleString('ko-KR');
}

function SmsPay({ userId, name, phone, email, onResult }) {
  // URL 파라미터 또는 props에서 사용자 정보 가져오기
  const uid   = userId || getParam('id');
  const nm    = name   || getParam('name') || uid;
  const ph    = phone  || getParam('phone');
  const em    = email  || getParam('email') || 'man@mmsoft.co.kr';

  const [amount, setAmount]   = useState(10000);
  const [inputVal, setInput]  = useState('10000');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null); // { ok, amt, msg }

  useEffect(() => {
    // 결제 완료 콜백 등록 (authfrm.html → paymentResult 호출)
    window.paymentResult = (ok, amt, msg) => {
      const res = { ok, amt, msg };
      setResult(res);
      setLoading(false);
      if (onResult) onResult(res);
    };
    return () => { delete window.paymentResult; };
  }, [onResult]);

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    setAmount(num);
    setInput(raw);
    setError('');
  };

  const handleAdd = (val) => {
    const next = amount + val;
    setAmount(next);
    setInput(String(next));
    setError('');
  };

  const handleReset = () => {
    setAmount(10000);
    setInput('10000');
    setError('');
  };

  const handlePay = () => {
    if (!amount || amount < 10000) {
      setError('최소 결제 금액은 10,000원입니다.');
      return;
    }
    if (amount % 10000 !== 0) {
      setError('10,000원 단위로 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError('');

    const payUrl = `/manyman/authfrm.html?goods=SMS&price=${amount}&id=${encodeURIComponent(uid)}&name=${encodeURIComponent(nm)}&email=${encodeURIComponent(em)}&phone=${encodeURIComponent(ph)}`;

    const popup = window.open(payUrl, 'kspaypopup', 'width=502,height=600,scrollbars=yes');

    // 팝업이 직접 닫힌 경우 감지
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        if (loading) setLoading(false);
      }
    }, 1000);
  };

  const handleRetry = () => {
    setResult(null);
    setAmount(10000);
    setInput('10000');
    setError('');
  };

  // 결제 완료/실패 결과 화면
  if (result) {
    return (
      <div className={styles.wrap}>
        <div className={styles.hd}>MMSoft 문자메시지 충전</div>
        <div className={styles.card}>
          <div className={`${styles.result} ${result.ok ? styles.resultOk : styles.resultFail}`}>
            <div className={styles.resultIcon}>{result.ok ? '✅' : '❌'}</div>
            <h3>{result.ok ? '충전이 완료되었습니다' : '충전이 완료되지 않았습니다'}</h3>
            {result.ok && result.amt && (
              <p>{result.amt}원 충전 처리되었습니다.</p>
            )}
            {!result.ok && result.msg && (
              <p>{result.msg}</p>
            )}
          </div>
          <button className={styles.retryBtn} onClick={handleRetry}>
            다시 충전하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.hd}>MMSoft &nbsp; 문자메시지 충전</div>
      <div className={styles.card}>
        {/* 안내 문구 */}
        <div className={styles.notice}>
          * 충전방식은 카드결재와 무통장입금만 가능합니다.<br />
          * 한번에 최대 5000건까지 발송가능합니다.<br />
          * 문자 메시지를 발송하시기 위해서는 요금이 충전되어 있어야합니다.<br />
          * 최소 결제 단위는 1만원입니다.<br />
          * 무통장입금을 원하시는 분들은 국민 421701-01-138933 이기성(엠엠소프트)로 입금해주시고
          커뮤니티 게시판에 충전요청 등록 부탁드립니다(비밀글 선호).
        </div>

        {/* 금액 입력 */}
        <div className={styles.lbl}>충전 금액</div>
        <div className={styles.amountWrap}>
          <input
            type="text"
            className={styles.amountInput}
            value={formatComma(amount)}
            onChange={handleInput}
            onFocus={(e) => e.target.select()}
          />
          <span className={styles.amountUnit}>원</span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* 빠른 추가 버튼 */}
        <div className={styles.quickBtns}>
          {QUICK_AMOUNTS.map((q) => (
            <button key={q.value} className={styles.quickBtn} onClick={() => handleAdd(q.value)}>
              {q.label}
            </button>
          ))}
        </div>

        {/* 초기화 버튼 */}
        <button className={styles.resetBtn} onClick={handleReset}>
          금액 초기화
        </button>

        {/* 결제 버튼 */}
        <button
          className={styles.payBtn}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? '결제 처리 중...' : '결　　제'}
        </button>
      </div>
    </div>
  );
}

export default SmsPay;
