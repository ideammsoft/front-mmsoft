// =====================================================================
// [Button.jsx] - 재사용 가능한 공통 버튼 컴포넌트
// =====================================================================
//
// 📌 Props 설명
//   - children  : 버튼 안에 표시할 내용 (텍스트 또는 JSX)
//     예) <Button>로그인</Button> → children = "로그인"
//   - variant   : 버튼 스타일 종류 (기본값 'primary')
//     'primary'(주요 버튼), 'secondary'(보조 버튼), 'danger'(위험 버튼) 등
//   - size      : 버튼 크기 (기본값 'md') → 'sm', 'md', 'lg'
//   - onClick   : 버튼 클릭 시 실행할 함수
//   - disabled  : 비활성화 여부 (true이면 클릭 불가, 회색으로 표시)
//   - type      : 버튼 유형 (기본값 'button')
//     'submit' : form 제출 버튼 (form 안에서 엔터 키도 동작)
//     'button' : 일반 버튼 (form 제출 안 함)
//
// 📌 clsx 사용법
//   clsx(styles.button, styles[variant], styles[size])
//   → 세 클래스를 합쳐서 하나의 className 문자열로 만듦
//   예) variant='primary', size='lg' → "button primary lg"
//       (실제로는 CSS Module로 고유화된 이름)

import clsx from 'clsx';
import styles from './Button.module.css';

function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // clsx: 여러 클래스명을 조합. styles['primary'] = styles.primary
      className={clsx(styles.button, styles[variant], styles[size])}
      {...props}
    >
      {children} {/* 버튼 내용 (텍스트 또는 아이콘 등) */}
    </button>
  );
}

export default Button;
