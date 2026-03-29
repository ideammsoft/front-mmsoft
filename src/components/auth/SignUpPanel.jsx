// =====================================================================
// [SignUpPanel.jsx] - 회원가입 팝업 패널 컴포넌트
// =====================================================================
//
// 📌 이 컴포넌트가 하는 일
//   1. 아이디 입력 + 중복검사 (POST /api/auth/idcheck)
//   2. 비밀번호 / 비밀번호 확인 입력
//   3. 휴대폰, 이메일, 이름, 회사명 입력
//   4. 유효성 검사 후 회원가입 (POST /api/auth/regist)
//
// 📌 폼 상태 관리 방법
//   - 여러 입력 필드를 하나의 객체 상태로 관리합니다:
//     const [form, setForm] = useState({ userId: '', password: '', ... })
//   - 각 input의 onChange에서 해당 필드만 업데이트합니다:
//     setForm(prev => ({ ...prev, [field]: e.target.value }))
//     → ...prev: 기존 필드들을 그대로 복사
//     → [field]: e.target.value: 변경된 필드만 덮어씀
//
// 📌 스프레드 연산자(...)란?
//   - { ...prev } : prev 객체의 모든 속성을 펼쳐서 복사합니다.
//   - 예) prev = { a: 1, b: 2 }이고 [field]='b', 값=99이면
//     { ...prev, b: 99 } → { a: 1, b: 99 }
//
// 📌 유효성 검사(Validation)란?
//   - 서버에 요청하기 전에 입력값이 올바른지 검사하는 과정입니다.
//   - 잘못된 값을 미리 걸러내어 불필요한 서버 요청을 줄입니다.
//   - errors 객체에 에러 메시지를 담아 각 필드 아래에 표시합니다.

import { useState, useRef } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './SignUpPanel.module.css';

function SignUpPanel({ onClose, onSuccess }) {
  const overlayMouseDown = useRef(false);

  // 폼 입력값 상태 (모든 필드를 하나의 객체로 관리)
  const [form, setForm] = useState({
    userId         : '',  // 아이디
    password       : '',  // 비밀번호
    passwordConfirm: '',  // 비밀번호 확인
    mphone         : '',  // 휴대폰 번호
    companyPhone   : '',  // 회사전화 (선택)
    company        : '',  // 회사명 (선택)
    name           : '',  // 이름
    email          : '',  // 이메일
  });

  // 유효성 검사 에러 메시지 상태 (필드명: 에러메시지)
  const [errors, setErrors] = useState({});

  // 아이디 중복검사 완료 여부
  const [idChecked, setIdChecked] = useState(false);

  // 특정 필드의 값 변경 핸들러 (고차 함수 - 함수를 반환하는 함수)
  // handleChange('userId')를 호출하면 userId를 변경하는 함수를 반환합니다
  const handleChange = (field) => (e) => {
    // 기존 form을 복사하고 해당 field만 새 값으로 교체
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // 입력하면 해당 필드의 에러 메시지 초기화
    setErrors((prev) => ({ ...prev, [field]: '' }));
    // 아이디를 변경하면 중복검사 다시 해야 함
    if (field === 'userId') setIdChecked(false);
  };

  // 아이디 중복검사
  const handleIdCheck = async () => {
    if (!form.userId.trim()) {
      setErrors((prev) => ({ ...prev, userId: '아이디를 입력해 주세요.' }));
      return;
    }

    try {
      // POST /api/auth/idcheck : 이 아이디가 이미 사용 중인지 확인
      const res = await fetch('/api/auth/idcheck', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        // openId → 백엔드 IdCheckRequest.openId 필드와 매핑
        body   : JSON.stringify({ openId: form.userId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 404) {
          alert('서버 연결에 실패했습니다. (API 없음)');
        } else {
          setErrors((prev) => ({ ...prev, userId: data.message || '이미 사용 중인 아이디입니다.' }));
        }
        setIdChecked(false);
        return;
      }

      // 백엔드 IdCheckResponse: { count: 0 } 또는 { count: 1 }
      // count === 0 → 사용 가능, count === 1 → 이미 사용 중
      const count = data.count ?? data.cnt ?? 0;
      if (count === 0) {
        setIdChecked(true);  // 중복검사 통과
        setErrors((prev) => ({ ...prev, userId: '' }));
      } else {
        setErrors((prev) => ({ ...prev, userId: '이미 사용 중인 아이디입니다.' }));
        setIdChecked(false);
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    }
  };

  // 전체 유효성 검사 - 에러가 있는 필드의 메시지를 반환
  const validate = () => {
    const newErrors = {};

    if (!form.userId.trim())
      newErrors.userId = '아이디를 입력해 주세요.';

    if (!idChecked)
      newErrors.idCheck = '아이디 중복검사를 해주세요.'; // 중복검사 안 하면 에러

    if (!form.password)
      newErrors.password = '비밀번호를 입력해 주세요.';

    if (!form.passwordConfirm)
      newErrors.passwordConfirm = '비밀번호 확인을 입력해 주세요.';
    else if (form.password !== form.passwordConfirm)
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'; // 두 비밀번호 비교

    if (!form.mphone.trim())
      newErrors.mphone = '휴대폰 번호는 필수 입력 사항 입니다.';

    if (!form.email.trim())
      newErrors.email = '이메일은 필수 입력 사항 입니다.';

    return newErrors; // 에러가 없으면 빈 객체 {} 반환
  };

  // 회원가입 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 실행
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      // Object.keys(): 객체의 키 배열 반환. 길이가 0보다 크면 에러 있음
      setErrors(newErrors); // 에러 메시지 상태 업데이트 → 화면에 에러 표시
      return;
    }

    try {
      // POST /api/auth/regist : 백엔드 회원가입 API 호출
      const res = await fetch('/api/auth/regist', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          openId  : form.userId,
          password: form.password,
          name    : form.name,
          email   : form.email,
          mphone  : form.mphone,        // 휴대폰 → account.mphone
          phone   : form.companyPhone,  // 회사전화 → account.phone
          company : form.company,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || '회원가입에 실패했습니다.');
        return;
      }

      alert('회원가입이 완료되었습니다.');
      onSuccess?.(form.userId); // 부모(LoginPanel)에게 가입된 아이디 전달
      onClose();

    } catch {
      alert('서버 연결에 실패했습니다.');
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={e => { overlayMouseDown.current = e.target === e.currentTarget; }}
      onMouseUp={e => { if (overlayMouseDown.current && e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>회원가입</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* 아이디 + 중복검사 버튼 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>아이디</label>
            <div className={styles.inlineRow}>
              <input
                id="userId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={form.userId}
                onChange={handleChange('userId')}
                // idChecked가 true이면 초록 테두리 스타일 추가
                className={`${styles.input} ${idChecked ? styles.inputSuccess : ''}`}
              />
              <button type="button" className={styles.checkButton} onClick={handleIdCheck}>
                중복검사
              </button>
            </div>
            {/* 에러 메시지 조건부 표시 */}
            {errors.userId && <p className={styles.errorMessage}>{errors.userId}</p>}
            {errors.idCheck && !errors.userId && (
              <p className={styles.errorMessage}>{errors.idCheck}</p>
            )}
            {/* 중복검사 통과 시 성공 메시지 */}
            {idChecked && <p className={styles.successMessage}>사용 가능한 아이디입니다.</p>}
          </div>

          {/* 비밀번호 + 비밀번호 확인 (2칸 그리드) */}
          <div className={styles.gridRow}>
            <div className={styles.fieldWrapper}>
              <Input label="비밀번호" id="password" type="password"
                placeholder="비밀번호를 입력하세요"
                value={form.password} onChange={handleChange('password')} />
              {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
            </div>
            <div className={styles.fieldWrapper}>
              <Input label="비밀번호 확인" id="passwordConfirm" type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={form.passwordConfirm} onChange={handleChange('passwordConfirm')} />
              {errors.passwordConfirm && <p className={styles.errorMessage}>{errors.passwordConfirm}</p>}
            </div>
          </div>

          {/* 휴대폰 + 이메일 (2칸 그리드) */}
          <div className={styles.gridRow}>
            <div className={styles.fieldWrapper}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="mphone">휴대폰 번호</label>
                <span className={styles.requiredMark}>필수</span>
              </div>
              <input id="mphone" type="tel" placeholder="010-0000-0000"
                value={form.mphone} onChange={handleChange('mphone')} className={styles.input} />
              {errors.mphone && <p className={styles.errorMessage}>{errors.mphone}</p>}
            </div>
            <div className={styles.fieldWrapper}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="email">이메일</label>
                <span className={styles.requiredMark}>필수</span>
              </div>
              <input id="email" type="email" placeholder="이메일을 입력하세요"
                value={form.email} onChange={handleChange('email')} className={styles.input} />
              {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
            </div>
          </div>

          {/* 성명 + 회사전화 (2칸 그리드) */}
          <div className={styles.gridRow}>
            <div className={styles.fieldWrapper}>
              <Input label="성명" id="name" type="text" placeholder="이름을 입력하세요"
                value={form.name} onChange={handleChange('name')} />
            </div>
            <div className={styles.fieldWrapper}>
              <label className={styles.label} htmlFor="companyPhone">회사전화</label>
              <input id="companyPhone" type="tel" placeholder="회사 전화번호"
                value={form.companyPhone} onChange={handleChange('companyPhone')} className={styles.input} />
            </div>
          </div>

          {/* 회사명 (전체 너비) */}
          <div className={styles.fieldWrapper}>
            <Input label="회사명" id="company" type="text" placeholder="회사명을 입력하세요"
              value={form.company} onChange={handleChange('company')} />
          </div>

          <Button type="submit" variant="primary" size="lg">
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPanel;
