import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './SignUpPanel.module.css';

function SignUpPanel({ onClose }) {
  const [form, setForm] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    company: '',
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [idChecked, setIdChecked] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'userId') setIdChecked(false);
  };

  const handleIdCheck = () => {
    if (!form.userId.trim()) {
      setErrors((prev) => ({ ...prev, userId: '아이디를 입력해 주세요.' }));
      return;
    }
    // 정적 프로토타입: 항상 사용 가능으로 처리
    setIdChecked(true);
    alert('사용 가능한 아이디입니다.');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.userId.trim()) {
      newErrors.userId = '아이디를 입력해 주세요.';
    }
    if (!idChecked) {
      newErrors.idCheck = '아이디 중복검사를 해주세요.';
    }
    if (!form.password) {
      newErrors.password = '비밀번호를 입력해 주세요.';
    }
    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해 주세요.';
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }
    if (!form.phone.trim()) {
      newErrors.phone = '휴대폰 번호는 필수 입력 사항 입니다.';
    }
    if (!form.email.trim()) {
      newErrors.email = '이메일은 필수 입력 사항 입니다.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    alert('회원가입이 완료되었습니다.\n실제 가입 기능은 백엔드 연동 후 구현됩니다.');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>회원가입</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* 아이디 + 중복검사 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>아이디</label>
            <div className={styles.inlineRow}>
              <input
                id="userId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={form.userId}
                onChange={handleChange('userId')}
                className={`${styles.input} ${idChecked ? styles.inputSuccess : ''}`}
              />
              <button
                type="button"
                className={styles.checkButton}
                onClick={handleIdCheck}
              >
                중복검사
              </button>
            </div>
            {errors.userId && <p className={styles.errorMessage}>{errors.userId}</p>}
            {errors.idCheck && !errors.userId && (
              <p className={styles.errorMessage}>{errors.idCheck}</p>
            )}
            {idChecked && (
              <p className={styles.successMessage}>사용 가능한 아이디입니다.</p>
            )}
          </div>

          {/* 비밀번호 + 비밀번호 확인 (2컬럼) */}
          <div className={styles.gridRow}>
            <div className={styles.fieldWrapper}>
              <Input
                label="비밀번호"
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={form.password}
                onChange={handleChange('password')}
              />
              {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
            </div>

            <div className={styles.fieldWrapper}>
              <Input
                label="비밀번호 확인"
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={form.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
              />
              {errors.passwordConfirm && (
                <p className={styles.errorMessage}>{errors.passwordConfirm}</p>
              )}
            </div>
          </div>

          {/* 휴대폰 번호 + 이메일 (2컬럼) */}
          <div className={styles.gridRow}>
            <div className={styles.fieldWrapper}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="phone">휴대폰 번호</label>
                <span className={styles.requiredMark}>필수</span>
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={handleChange('phone')}
                className={styles.input}
              />
              {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
            </div>

            <div className={styles.fieldWrapper}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="email">이메일</label>
                <span className={styles.requiredMark}>필수</span>
              </div>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={form.email}
                onChange={handleChange('email')}
                className={styles.input}
              />
              {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
            </div>
          </div>

          {/* 성명 + 회사명 (2컬럼) */}
          <div className={styles.gridRow}>
            <div className={styles.fieldWrapper}>
              <Input
                label="성명"
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={form.name}
                onChange={handleChange('name')}
              />
            </div>

            <div className={styles.fieldWrapper}>
              <Input
                label="회사명"
                id="company"
                type="text"
                placeholder="회사명을 입력하세요"
                value={form.company}
                onChange={handleChange('company')}
              />
            </div>
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
