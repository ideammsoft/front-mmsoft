import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ProfileCompletionPanel.module.css';

function ProfileCompletionPanel({ onClose }) {
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = '휴대폰 번호는 필수 입력 사항 입니다';
    if (!email.trim()) newErrors.email = '이메일은 필수 입력 사항 입니다';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    alert('추가 정보가 저장되었습니다.');
    onClose();
  };

  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h3 className={styles.title}>추가 정보 입력</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <p className={styles.description}>
          서비스 이용을 위해 추가 정보를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* 휴대폰 번호 (필수) */}
          <div className={styles.fieldWrapper}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="phone">휴대폰 번호</label>
              <span className={styles.requiredMark}>필수</span>
            </div>
            <input
              id="phone"
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={handleChange(setPhone, 'phone')}
              className={styles.input}
            />
            {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
          </div>

          {/* 이메일 (필수) */}
          <div className={styles.fieldWrapper}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="email">이메일</label>
              <span className={styles.requiredMark}>필수</span>
            </div>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleChange(setEmail, 'email')}
              className={styles.input}
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          {/* 성명 */}
          <Input
            label="성명"
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* 회사명 */}
          <Input
            label="회사명"
            id="company"
            type="text"
            placeholder="회사명을 입력하세요"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg">
            확인
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProfileCompletionPanel;
