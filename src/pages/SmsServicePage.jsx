import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SmsServicePage.module.css';

const TABS = [
  { key: 'register', label: '발신번호 등록' },
  { key: 'balance',  label: '내 문자 잔액' },
  { key: 'apikey',   label: 'API 키 관리' },
  { key: 'kakao',    label: '카카오톡 템플릿' },
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
        <h1 className={styles.heroTitle}>API 문자 프로그램</h1>
        <p className={styles.heroDesc}>API 문자 프로그램에서 직접 문자를 발송하세요.<br/>발신번호를 등록하고 관리자 승인 후 사용 가능합니다.</p>
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
          {tab === 'apikey'   && <ApiKeyTab user={user} />}
          {tab === 'kakao'    && <KakaoTemplateTab />}
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
  const [draggingCert,     setDraggingCert]     = useState(false);
  const [draggingEmploy,   setDraggingEmploy]   = useState(false);

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
    if (!form.docCertUrl)         { alert('통신서비스 이용증명원 파일을 업로드해 주세요.'); return; }
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
          <li><strong>개인 또는 자사대표자</strong>: 통신서비스 이용증명원 1부 제출</li>
          <li><strong>자사재직자</strong>: 통신서비스 이용증명원 + 재직증명서 제출</li>
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
            <label className={styles.label}>
              {user.provider ? (
                <>
                  로그인 Key
                  <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: '#6b7280', marginTop: 2 }}>
                    ({user.provider})
                  </span>
                </>
              ) : '고객 아이디 *'}
            </label>
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
                { value: 'REPRESENTATIVE', label: '개인 또는 자사대표자' },
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
            <div className={styles.labelRow}>
              <span className={styles.label}>통신서비스 이용증명원 *</span>
              <Link to="/sms-service/telecom-cert-guide" className={styles.guideLink} target="_blank" rel="noopener noreferrer">
                통신서비스이용증명원 발급 방법
              </Link>
            </div>
            <label
              className={`${styles.fileLabel} ${form.docCertUrl ? styles.fileDone : draggingCert ? styles.fileDragging : ''}`}
              onDragOver={e => { e.preventDefault(); setDraggingCert(true); }}
              onDragLeave={() => setDraggingCert(false)}
              onDrop={e => {
                e.preventDefault();
                setDraggingCert(false);
                const file = e.dataTransfer.files[0];
                if (file) uploadDoc(file, 'docCertUrl', setUploadingCert, setCertFileName);
              }}
            >
              <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => uploadDoc(e.target.files[0], 'docCertUrl', setUploadingCert, setCertFileName)}
              />
              {uploadingCert ? '업로드 중...' : form.docCertUrl ? `✓ ${certFileName}` : '파일 선택 또는 여기에 드래그 (PDF / JPG / PNG)'}
            </label>
            <p className={styles.hint}>통신서비스 이용증명원을 첨부해 주세요.</p>
          </div>

          {form.senderType === 'EMPLOYEE' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>재직증명서 *</label>
              <label
                className={`${styles.fileLabel} ${form.docEmploymentUrl ? styles.fileDone : draggingEmploy ? styles.fileDragging : ''}`}
                onDragOver={e => { e.preventDefault(); setDraggingEmploy(true); }}
                onDragLeave={() => setDraggingEmploy(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDraggingEmploy(false);
                  const file = e.dataTransfer.files[0];
                  if (file) uploadDoc(file, 'docEmploymentUrl', setUploadingEmploy, setEmployFileName);
                }}
              >
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={e => uploadDoc(e.target.files[0], 'docEmploymentUrl', setUploadingEmploy, setEmployFileName)}
                />
                {uploadingEmploy ? '업로드 중...' : form.docEmploymentUrl ? `✓ ${employFileName}` : '파일 선택 또는 여기에 드래그 (PDF / JPG / PNG)'}
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

// ── API 키 관리 탭 ────────────────────────────────────────────────
function ApiKeyTab({ user }) {
  const customerId = user?.homepageId || '';
  const userEmail  = user?.email || '';

  const [senders,    setSenders]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [sending,    setSending]    = useState(null); // senderId being sent
  const [sentMsg,    setSentMsg]    = useState({});

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    fetch(`/api/noim/sender/my?customerId=${encodeURIComponent(customerId)}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setSenders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleResendKey = async (sn) => {
    const email = window.prompt(
      `API 키를 전송할 이메일 주소를 확인해 주세요.\n발신번호: ${sn.phoneNumber}`,
      userEmail
    );
    if (!email || !email.trim()) return;
    setSending(sn.id);
    try {
      const res = await fetch(
        `/api/noim/sender/resend-key?customerId=${encodeURIComponent(customerId)}&senderId=${sn.id}&email=${encodeURIComponent(email.trim())}`,
        { method: 'POST' }
      );
      const data = await res.json();
      setSentMsg(prev => ({ ...prev, [sn.id]: data.success ? '전송완료' : (data.message || '실패') }));
      setTimeout(() => setSentMsg(prev => { const c = { ...prev }; delete c[sn.id]; return c; }), 3000);
    } catch {
      setSentMsg(prev => ({ ...prev, [sn.id]: '오류' }));
    } finally {
      setSending(null);
    }
  };

  const statusLabel = (s) =>
    s === 'APPROVED' ? '✅ 승인' : s === 'REJECTED' ? '❌ 반려' : '⏳ 심사중';
  const statusColor = (s) =>
    s === 'APPROVED' ? '#16a34a' : s === 'REJECTED' ? '#dc2626' : '#d97706';

  return (
    <div>
      <h2 className={styles.sectionTitle}>API 키 관리</h2>

      {/* 발신번호 현황 */}
      <div className={styles.myList}>
        <h3 className={styles.myListTitle}>발신번호 현황</h3>
        {!customerId ? (
          <p className={styles.listEmpty}>로그인이 필요합니다.</p>
        ) : loading ? (
          <p className={styles.listEmpty}>불러오는 중...</p>
        ) : senders.length === 0 ? (
          <p className={styles.listEmpty}>등록된 발신번호가 없습니다. 발신번호 등록 탭에서 신청해 주세요.</p>
        ) : (
          senders.map(sn => (
            <div key={sn.id} className={styles.senderRow}
              style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <span className={styles.senderPhone}>{sn.phoneNumber}</span>
              {sn.phoneAlias && <span className={styles.senderAlias}>{sn.phoneAlias}</span>}
              <span style={{ color: statusColor(sn.status), fontSize: 13, fontWeight: 600 }}>
                {statusLabel(sn.status)}
              </span>
              {sn.status === 'APPROVED' && (
                <button
                  onClick={() => handleResendKey(sn)}
                  disabled={sending === sn.id}
                  style={{ marginLeft: 'auto', padding: '5px 14px', fontSize: 13,
                           cursor: 'pointer', borderRadius: 6,
                           background: '#1a73e8', color: '#fff',
                           border: 'none', fontWeight: 600 }}>
                  {sending === sn.id ? '전송중...' : (sentMsg[sn.id] || 'API 키 이메일 전송')}
                </button>
              )}
              {sn.status === 'REJECTED' && sn.rejectReason && (
                <span style={{ fontSize: 12, color: '#dc2626' }}>— {sn.rejectReason}</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* 충전 안내 */}
      <div className={styles.chargeGuide} style={{ marginTop: 24 }}>
        <h3>충전 방법</h3>
        <ol>
          <li>카드 결제: <strong>결제하기</strong> 메뉴 → 문자 및 카카오톡 충전 → <strong>API 키발급용</strong> 체크 후 결제</li>
          <li>계좌 이체: 아래 계좌로 입금 후 관리자에게 문의</li>
          <li>충전 완료 후 발송 프로그램에서 API 키로 잔액 확인 가능</li>
        </ol>

        <div className={styles.bankInfo}>
          <div className={styles.bankTitle}>계좌 이체</div>
          <div style={{ fontSize: 15, fontWeight: 700, margin: '6px 0' }}>
            국민은행 421701-04-121233 이기성(엠엠소프트)
          </div>
          <div>입금 시 아이디를 메모란에 기재해 주세요.</div>
          <div className={styles.bankDetail}>관리자 확인 후 1영업일 이내 처리됩니다.</div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            ※ 카드 결제 시 부가세(10%)가 차감된 금액이 충전됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 카카오톡 템플릿 탭 ────────────────────────────────────────────
function KakaoTemplateTab() {
  const [templates, setTemplates] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [selected,  setSelected]  = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    setError('');
    setTemplates([]);
    setSelected(null);
    try {
      const res  = await fetch('/api/noim/kakao/templates');
      const data = await res.json();
      if (data.result_code !== undefined && String(data.result_code) !== '1') {
        setError(data.message || '템플릿 조회 실패');
      } else if (Array.isArray(data.list)) {
        const approved = data.list.filter(t => (t.status || '') === 'A');
        setTemplates(approved);
        if (approved.length === 0) setError('승인된 템플릿이 없습니다.');
      } else {
        setError('템플릿 목록을 불러오지 못했습니다.');
      }
    } catch { setError('서버 오류가 발생했습니다.'); }
    finally   { setLoading(false); }
  };

  const tplName   = selected ? (selected.templtName || selected.tpl_name || selected.name || '') : '';
  const hasSmsAlt = tplName.endsWith('_SMS');

  return (
    <div>
      <h2 className={styles.sectionTitle}>카카오톡 알림톡 템플릿 조회</h2>
      <p className={styles.desc}>등록된 알림톡 템플릿 목록을 조회합니다.</p>

      <div className={styles.balanceRow}>
        <button className={styles.submitBtn} onClick={handleLoad} disabled={loading}
          style={{ width: 'auto', padding: '10px 24px' }}>
          {loading ? '조회중...' : '템플릿 조회'}
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {templates.length > 0 && (
        <div className={styles.myList} style={{ marginTop: 16 }}>
          <h3 className={styles.myListTitle}>승인된 템플릿 ({templates.length}개)</h3>
          {templates.map((t, i) => {
            const name = t.templtName || t.tpl_name || t.name || '-';
            return (
              <div key={i} onClick={() => setSelected(selected === t ? null : t)}
                style={{
                  padding: '10px 14px', borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer', fontSize: 14,
                  background: selected === t ? '#eff6ff' : 'white',
                  color:      selected === t ? '#1a73e8' : '#222',
                  fontWeight: selected === t ? 700 : 400,
                }}>
                {name}
              </div>
            );
          })}
        </div>
      )}

      {/* 템플릿 상세 모달 */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.45)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: 12, width: 400, maxHeight: '82vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}>
            <div style={{ background: '#1a73e8', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>템플릿 보기</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <div style={{ background: '#fef3c7', borderBottom: '1px solid #fde68a', padding: '10px 16px', fontWeight: 700, fontSize: 14, color: '#78350f', flexShrink: 0 }}>
              {tplName}
            </div>
            <div style={{ padding: 16, overflowY: 'auto', flex: 1, whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: 13, background: '#fffdf5', color: '#1f2937' }}>
              {selected.tpl_content || selected.content || ''}
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid #e5e7eb', fontSize: 13, color: '#555', background: '#f9fafb', flexShrink: 0 }}>
              대체 발송 문자: {hasSmsAlt ? '발송함' : '발송 안함'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
