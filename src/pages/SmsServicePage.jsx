import { useState, useEffect } from 'react';
import styles from './SmsServicePage.module.css';

const TABS = [
  { key: 'register', label: '발신번호 등록' },
  { key: 'balance',  label: '내 문자 잔액' },
  { key: 'charge',   label: '요금 충전하기' },
];

const PRICING = [
  { type: '단문 (SMS)',  chars: '90자 이내',   price: 17 },
  { type: '장문 (LMS)',  chars: '91~2000자',   price: 39 },
  { type: '멀티 (MMS)',  chars: '이미지 포함',  price: 99 },
];

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('mmsoft_user') || '{}'); } catch { return {}; }
}

export default function SmsServicePage() {
  const [tab, setTab] = useState('register');
  const user = getStoredUser();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>문자 발송 서비스</h1>
        <p className={styles.heroDesc}>noim 프로그램에서 직접 문자를 발송하세요.<br/>발신번호를 등록하고 관리자 승인 후 사용 가능합니다.</p>
      </div>

      <div className={styles.container}>
        {/* 탭 */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {tab === 'register' && <RegisterTab user={user} />}
          {tab === 'balance'  && <BalanceTab />}
          {tab === 'charge'   && <ChargeTab />}
        </div>
      </div>
    </div>
  );
}

// ── 발신번호 등록 탭 ──────────────────────────────────────────────
function RegisterTab({ user }) {
  const [form, setForm] = useState({
    customerId:      user.homepageId || '',
    phoneNumber:     '',
    phoneAlias:      '',
    senderType:      'REPRESENTATIVE',
    docCertUrl:      '',
    docEmploymentUrl:'',
  });
  const [submitting,       setSubmitting]       = useState(false);
  const [done,             setDone]             = useState(false);
  const [myList,           setMyList]           = useState([]);
  const [listLoading,      setListLoading]      = useState(false);
  const [uploadingCert,    setUploadingCert]    = useState(false);
  const [uploadingEmploy,  setUploadingEmploy]  = useState(false);
  const [certFileName,     setCertFileName]     = useState('');
  const [employFileName,   setEmployFileName]   = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const loadMyList = async (id) => {
    if (!id) return;
    setListLoading(true);
    try {
      const res = await fetch(`/api/noim/sender/my?customerId=${encodeURIComponent(id)}`);
      if (res.ok) setMyList(await res.json());
    } catch {}
    finally { setListLoading(false); }
  };

  useEffect(() => { loadMyList(form.customerId); }, []);

  const uploadDoc = async (file, fieldKey, setUploading, setFileName) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/noim/sender/upload-doc', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        set(fieldKey, data.url);
        setFileName(file.name);
      } else {
        alert('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch { alert('파일 업로드 오류가 발생했습니다.'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId.trim())  { alert('고객 아이디를 입력해 주세요.'); return; }
    if (!form.phoneNumber.trim()) { alert('발신번호를 입력해 주세요.'); return; }
    if (!form.docCertUrl)         { alert('이용증명원 파일을 업로드해 주세요.'); return; }
    if (form.senderType === 'EMPLOYEE' && !form.docEmploymentUrl) {
      alert('재직증명서 파일을 업로드해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/noim/sender/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        await loadMyList(form.customerId);
      } else {
        alert(data.message || '등록 실패');
      }
    } catch { alert('서버 오류가 발생했습니다.'); }
    finally { setSubmitting(false); }
  };

  const statusLabel = (s) =>
    s === 'APPROVED' ? '✅ 승인' : s === 'REJECTED' ? '❌ 반려' : '⏳ 심사중';
  const statusColor = (s) =>
    s === 'APPROVED' ? '#16a34a' : s === 'REJECTED' ? '#dc2626' : '#d97706';

  return (
    <div>
      <h2 className={styles.sectionTitle}>발신번호 등록 신청</h2>
      <div className={styles.notice}>
        <strong>유의사항</strong>
        <ul>
          <li>발신번호는 최대 <strong>3개</strong>까지 등록 가능합니다.</li>
          <li><strong>자사대표자</strong>: 이용증명원 1부 제출</li>
          <li><strong>자사재직자</strong>: 이용증명원 + 재직증명서 제출</li>
          <li>서류 심사 후 관리자가 승인합니다. (영업일 1~2일)</li>
        </ul>
      </div>

      {done ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <p>등록 신청이 완료되었습니다.<br/>관리자 심사 후 승인 처리됩니다.</p>
          <button className={styles.resetBtn} onClick={() => setDone(false)}>추가 등록하기</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>고객 아이디 *</label>
            <input className={styles.input}
              value={form.customerId}
              onChange={e => set('customerId', e.target.value)}
              placeholder="mmsoft 로그인 아이디"
              disabled={!!user.homepageId}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>발신번호 *</label>
            <input className={styles.input}
              value={form.phoneNumber}
              onChange={e => set('phoneNumber', e.target.value)}
              placeholder="예) 0212345678 또는 01012345678"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>별칭 (선택)</label>
            <input className={styles.input}
              value={form.phoneAlias}
              onChange={e => set('phoneAlias', e.target.value)}
              placeholder="예) 대표전화, 팀장번호"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>등록자 유형 *</label>
            <div className={styles.radioGroup}>
              {[
                { value: 'REPRESENTATIVE', label: '자사대표자' },
                { value: 'EMPLOYEE',       label: '자사재직자' },
              ].map(opt => (
                <label key={opt.value} className={styles.radioLabel}>
                  <input type="radio" name="senderType"
                    value={opt.value}
                    checked={form.senderType === opt.value}
                    onChange={e => set('senderType', e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>이용증명원 *</label>
            <label className={`${styles.fileLabel} ${form.docCertUrl ? styles.fileDone : ''}`}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => uploadDoc(e.target.files[0], 'docCertUrl', setUploadingCert, setCertFileName)}
              />
              {uploadingCert ? '업로드 중...' : form.docCertUrl ? `✓ ${certFileName}` : '파일 선택 (PDF / JPG / PNG)'}
            </label>
            <p className={styles.hint}>이용증명원을 첨부해 주세요.</p>
          </div>

          {form.senderType === 'EMPLOYEE' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>재직증명서 *</label>
              <label className={`${styles.fileLabel} ${form.docEmploymentUrl ? styles.fileDone : ''}`}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={e => uploadDoc(e.target.files[0], 'docEmploymentUrl', setUploadingEmploy, setEmployFileName)}
                />
                {uploadingEmploy ? '업로드 중...' : form.docEmploymentUrl ? `✓ ${employFileName}` : '파일 선택 (PDF / JPG / PNG)'}
              </label>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? '신청 중...' : '등록 신청하기'}
          </button>
        </form>
      )}

      {/* 내 신청 목록 */}
      {form.customerId && (
        <div className={styles.myList}>
          <h3 className={styles.myListTitle}>내 발신번호 현황</h3>
          {listLoading
            ? <p className={styles.listEmpty}>불러오는 중...</p>
            : myList.length === 0
              ? <p className={styles.listEmpty}>등록된 발신번호가 없습니다.</p>
              : myList.map(sn => (
                  <div key={sn.id} className={styles.senderRow}>
                    <span className={styles.senderPhone}>{sn.phoneNumber}</span>
                    {sn.phoneAlias && <span className={styles.senderAlias}>{sn.phoneAlias}</span>}
                    <span style={{ color: statusColor(sn.status), fontSize: 13, fontWeight: 600 }}>
                      {statusLabel(sn.status)}
                    </span>
                    {sn.status === 'REJECTED' && sn.rejectReason && (
                      <span style={{ fontSize: 12, color: '#dc2626' }}>— {sn.rejectReason}</span>
                    )}
                  </div>
                ))
          }
        </div>
      )}
    </div>
  );
}

// ── 잔액 확인 탭 ───────────────────────────────────────────────────
function BalanceTab() {
  const [apiKey,   setApiKey]   = useState('');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleCheck = async () => {
    if (!apiKey.trim()) { alert('API 키를 입력해 주세요.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/noim/sender/info?apiKey=${encodeURIComponent(apiKey.trim())}`);
      const info = await res.json();
      if (!info.valid) { setResult({ error: info.message || '유효하지 않은 API 키입니다.' }); return; }
      // 잔액도 조회
      const balRes = await fetch(`/api/noim/sms/balance-by-key?apiKey=${encodeURIComponent(apiKey.trim())}`);
      const bal = balRes.ok ? await balRes.json() : {};
      setResult({ ...info, balance: bal.balance ?? 0 });
    } catch { setResult({ error: '서버 오류가 발생했습니다.' }); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>내 문자 잔액 확인</h2>
      <p className={styles.desc}>승인된 발신번호의 API 키를 입력하면 잔액을 확인할 수 있습니다.<br/>API 키는 관리자 승인 후 front-admin 고객 상세 페이지에서 확인하세요.</p>

      <div className={styles.balanceRow}>
        <input className={styles.input}
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="API 키 (32자리 영숫자)"
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          style={{ flex: 1 }}
        />
        <button className={styles.submitBtn} onClick={handleCheck} disabled={loading} style={{ width: 'auto', padding: '10px 24px' }}>
          {loading ? '조회중...' : '잔액 조회'}
        </button>
      </div>

      {result && (
        result.error
          ? <div className={styles.errorBox}>{result.error}</div>
          : <div className={styles.balanceCard}>
              <div className={styles.balanceMain}>{(result.balance || 0).toLocaleString()}원</div>
              <div className={styles.balanceSub}>
                단문 약 <strong>{Math.floor((result.balance || 0) / 17).toLocaleString()}</strong>건 /
                장문 약 <strong>{Math.floor((result.balance || 0) / 39).toLocaleString()}</strong>건
              </div>
              <div className={styles.senderInfo}>
                발신번호: <strong>{result.phoneNumber}</strong>
                {result.phoneAlias && <span> ({result.phoneAlias})</span>}
              </div>
            </div>
      )}
    </div>
  );
}

// ── 요금 충전 탭 ───────────────────────────────────────────────────
function ChargeTab() {
  return (
    <div>
      <h2 className={styles.sectionTitle}>요금 안내 및 충전</h2>

      <div className={styles.pricingGrid}>
        {PRICING.map(p => (
          <div key={p.type} className={styles.pricingCard}>
            <div className={styles.pricingType}>{p.type}</div>
            <div className={styles.pricingChars}>{p.chars}</div>
            <div className={styles.pricingPrice}>{p.price}원<span>/건</span></div>
          </div>
        ))}
      </div>

      <div className={styles.chargeGuide}>
        <h3>충전 방법</h3>
        <ol>
          <li>아래 카카오톡 또는 전화로 충전 요청</li>
          <li>입금 확인 후 관리자가 잔액 충전 처리</li>
          <li>충전 완료 후 문자 발송 가능</li>
        </ol>

        <div className={styles.contactBox}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>💬</span>
            <div>
              <div className={styles.contactLabel}>카카오톡 채널</div>
              <div className={styles.contactValue}>@mmsoft 검색 후 문의</div>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <div>
              <div className={styles.contactLabel}>전화 문의</div>
              <div className={styles.contactValue}>고객센터로 문의해 주세요</div>
            </div>
          </div>
        </div>

        <div className={styles.bankInfo}>
          <div className={styles.bankTitle}>계좌 이체</div>
          <div>입금 시 아이디를 메모란에 기재해 주세요.</div>
          <div className={styles.bankDetail}>관리자 확인 후 1영업일 이내 처리됩니다.</div>
        </div>
      </div>
    </div>
  );
}
