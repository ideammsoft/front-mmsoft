import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.css';

// 제품 목록
const PRODUCTS = [
  {
    id: 'sms',
    name: '문자 및 카카오톡 충전',
    description: '문자 메시지 및 카카오톡 알림톡 충전 서비스',
    icon: '💬',
    prices: [
      { label: '1만원',  amount: 10000 },
      { label: '3만원',  amount: 30000 },
      { label: '5만원',  amount: 50000 },
      { label: '10만원', amount: 100000 },
      { label: '20만원', amount: 200000 },
    ],
    type: 'sms_charge',
  },
  {
    id: 'software',
    name: '소프트웨어 구매',
    description: '엠엠소프트 소프트웨어 초기 구매 비용',
    icon: '💻',
    prices: [
      { label: '110,000원', amount: 110000 },
      { label: '220,000원', amount: 220000 },
      { label: '330,000원', amount: 330000 },
      { label: '660,000원', amount: 660000 },
      { label: '770,000원', amount: 770000 },
    ],
    type: 'license',
    hasCustom: true,
  },
  {
    id: 'monthly',
    name: '연회비 / 월비용',
    description: '정기 납부 비용 (연회비 또는 월 구독료)',
    icon: '📅',
    prices: [
      { label: '11,000원',  amount: 11000 },
      { label: '33,000원',  amount: 33000 },
      { label: '55,000원',  amount: 55000 },
      { label: '110,000원', amount: 110000 },
      { label: '220,000원', amount: 220000 },
      { label: '330,000원', amount: 330000 },
    ],
    type: 'license',
    hasCustom: true,
  },
  {
    id: 'etc',
    name: '기타',
    description: '기타 서비스 및 커스텀 견적 문의',
    icon: '📦',
    prices: [],
    type: 'contact',
  },
];

function formatNumber(n) {
  return n.toLocaleString('ko-KR');
}

function PaymentPage() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mmsoft_user')); }
    catch { return null; }
  });

  const [step, setStep] = useState('select'); // select | confirm | result
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 로그인 필요
  useEffect(() => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedPrice(null);
    setCustomAmount('');
    if (product.type === 'contact') {
      setStep('contact');
    }
  };

  const handleNext = () => {
    if (!selectedProduct) return;
    if (selectedProduct.type === 'sms_charge') {
      const amt = selectedPrice ? selectedPrice.amount : parseInt(customAmount.replace(/,/g, ''), 10);
      if (!amt || amt < 10000) {
        alert('충전 금액을 선택하거나 최소 10,000원 이상 입력해주세요.');
        return;
      }
    } else if (selectedProduct.type === 'license') {
      const amt = selectedPrice ? selectedPrice.amount : parseInt(customAmount.replace(/,/g, ''), 10);
      if (!amt || amt < 1000) {
        alert('금액을 선택하거나 직접 입력해주세요.');
        return;
      }
    }
    setStep('confirm');
  };

  const getPayAmount = () => {
    if (selectedPrice) return selectedPrice.amount;
    const v = parseInt(customAmount.replace(/,/g, ''), 10);
    return isNaN(v) ? 0 : v;
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const amount = getPayAmount();
      const productName = selectedProduct.name;

      const userId = user?.id || user?.userId || user?.homepageId || '';
      const userName = user?.name || user?.nickname || userId;
      const userPhone = user?.phone || user?.mphone || '';
      const userEmail = user?.email || '';
      const payUrl = `/manyman/index.html?product=${encodeURIComponent(productName)}&amount=${amount}&id=${encodeURIComponent(userId)}&name=${encodeURIComponent(userName)}&phone=${encodeURIComponent(userPhone)}&email=${encodeURIComponent(userEmail)}`;

      const popup = window.open(payUrl, 'kspaypopup', 'width=502,height=600,scrollbars=yes');

      // KSPayResult.asp에서 postMessage로 결과 수신
      const onMessage = (e) => {
        if (!e.data || e.data.type !== 'KSPAY_RESULT') return;
        window.removeEventListener('message', onMessage);
        clearInterval(timer);
        if (popup && !popup.closed) popup.close();
        setResult({ ok: e.data.ok, amt: e.data.amt, msg: e.data.msg });
        setStep('result');
        setLoading(false);
      };
      window.addEventListener('message', onMessage);

      // 팝업이 결제 없이 닫힌 경우 로딩 해제
      const timer = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(timer);
          window.removeEventListener('message', onMessage);
          setLoading(false);
        }
      }, 1000);

    } catch (err) {
      setResult({ ok: false, amt: 0, msg: err.message });
      setStep('result');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedProduct(null);
    setSelectedPrice(null);
    setCustomAmount('');
    setResult(null);
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>충전 및 결제</h1>
          <p className={styles.heroSub}>엠엠소프트 제품 구매 및 충전 서비스</p>
        </div>
      </section>

      <div className={styles.container}>
        {/* 단계 표시 */}
        <div className={styles.steps}>
          {['제품 선택', '결제 확인', '완료'].map((label, i) => {
            const active = (step === 'select' && i === 0) || (step === 'confirm' && i === 1) || (step === 'result' && i === 2);
            const done = (step === 'confirm' && i === 0) || (step === 'result' && i <= 1);
            return (
              <div key={i} className={`${styles.step} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
                <div className={styles.stepNum}>{done ? '✓' : i + 1}</div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── 제품 선택 단계 ── */}
        {step === 'select' && (
          <div>
            <h2 className={styles.sectionTitle}>제품을 선택해주세요</h2>
            <div className={styles.productGrid}>
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className={`${styles.productCard} ${selectedProduct?.id === product.id ? styles.selected : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className={styles.productIcon}>{product.icon}</div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDesc}>{product.description}</p>
                  {product.prices.length > 0 && (
                    <div className={styles.priceRange}>
                      {formatNumber(product.prices[0].amount)}원 ~
                    </div>
                  )}
                  {product.type === 'contact' && (
                    <div className={styles.priceRange}>견적 문의</div>
                  )}
                </div>
              ))}
            </div>

            {/* 선택된 제품의 가격 옵션 */}
            {selectedProduct && selectedProduct.type !== 'contact' && (
              <div className={styles.priceSection}>
                <h3 className={styles.priceSectionTitle}>
                  {selectedProduct.name} — 금액 선택
                </h3>

                <div className={styles.priceOptions}>
                  {selectedProduct.prices.map((p) => (
                    <button
                      key={p.amount}
                      className={`${styles.priceBtn} ${selectedPrice?.amount === p.amount ? styles.priceBtnActive : ''}`}
                      onClick={() => { setSelectedPrice(p); setCustomAmount(''); }}
                    >
                      {p.label}
                      <span className={styles.priceAmount}>{formatNumber(p.amount)}원</span>
                    </button>
                  ))}
                </div>

                {/* 직접 입력 (sms_charge 또는 hasCustom 제품) */}
                {(selectedProduct.type === 'sms_charge' || selectedProduct.hasCustom) && (
                  <div className={styles.customAmount}>
                    <label>직접 입력</label>
                    <input
                      type="text"
                      placeholder="금액 직접 입력"
                      value={customAmount}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setCustomAmount(raw ? formatNumber(parseInt(raw, 10)) : '');
                        setSelectedPrice(null);
                      }}
                      className={styles.amountInput}
                    />
                  </div>
                )}

                <button className={styles.nextBtn} onClick={handleNext}>
                  다음 단계 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 기타 (견적문의) ── */}
        {step === 'contact' && (
          <div className={styles.contactBox}>
            <div className={styles.contactIcon}>📩</div>
            <h2>기타 서비스 문의</h2>
            <p>기타 서비스 및 커스텀 개발 관련 문의는 아래 연락처로 문의해주세요.</p>
            <div className={styles.contactInfo}>
              <p>📞 전화: 02-864-7576</p>
              <p>📧 이메일: man@mmsoft.co.kr</p>
            </div>
            <button className={styles.backBtn} onClick={handleReset}>
              돌아가기
            </button>
          </div>
        )}

        {/* ── 결제 확인 단계 ── */}
        {step === 'confirm' && selectedProduct && (
          <div className={styles.confirmBox}>
            <h2 className={styles.sectionTitle}>결제 정보 확인</h2>
            <div className={styles.confirmTable}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>제품명</span>
                <span className={styles.confirmValue}>{selectedProduct.name}</span>
              </div>
              {selectedPrice && (
                <div className={styles.confirmRow}>
                  <span className={styles.confirmLabel}>옵션</span>
                  <span className={styles.confirmValue}>{selectedPrice.label}</span>
                </div>
              )}
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>결제 금액</span>
                <span className={`${styles.confirmValue} ${styles.confirmAmount}`}>
                  {formatNumber(getPayAmount())}원
                </span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>결제 수단</span>
                <span className={styles.confirmValue}>신용카드 / 체크카드</span>
              </div>
            </div>

            <div className={styles.confirmNotice}>
              <p>※ 결제 버튼 클릭 시 KSPay 결제창이 열립니다.</p>
              {selectedProduct.type === 'sms_charge' && (
                <p>※ 문자/카카오톡 충전은 결제 완료 후 즉시 적용됩니다.</p>
              )}
            </div>

            <div className={styles.confirmBtns}>
              <button className={styles.backBtn} onClick={() => setStep('select')}>
                이전
              </button>
              <button
                className={styles.payBtn}
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? '결제 처리 중...' : `${formatNumber(getPayAmount())}원 결제하기`}
              </button>
            </div>
          </div>
        )}

        {/* ── 결제 결과 ── */}
        {step === 'result' && result && (
          <div className={styles.resultBox}>
            <div className={`${styles.resultIcon} ${result.ok ? styles.resultOk : styles.resultFail}`}>
              {result.ok ? '✅' : '❌'}
            </div>
            <h2 className={result.ok ? styles.resultTitleOk : styles.resultTitleFail}>
              {result.ok ? '결제가 완료되었습니다' : '결제가 완료되지 않았습니다'}
            </h2>
            {result.ok && result.amt && (
              <p className={styles.resultMsg}>{result.amt}원이 처리되었습니다.</p>
            )}
            {!result.ok && result.msg && (
              <p className={styles.resultMsg}>{result.msg}</p>
            )}
            <div className={styles.confirmBtns}>
              <button className={styles.backBtn} onClick={handleReset}>
                다른 제품 결제
              </button>
              <button className={styles.payBtn} onClick={() => navigate('/')}>
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
