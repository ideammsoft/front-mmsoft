// =====================================================================
// [Input.jsx] - 재사용 가능한 공통 Input 컴포넌트
// =====================================================================
//
// 📌 공통 컴포넌트(Common Component)를 만드는 이유
//   - 여러 곳에서 반복적으로 사용되는 UI를 하나로 통일합니다.
//   - 스타일을 한 곳에서만 수정해도 모든 곳에 적용됩니다.
//   - 코드 중복을 줄여 유지보수가 쉬워집니다.
//
// 📌 Props(속성) 설명
//   - label      : 인풋 위에 표시할 레이블 텍스트 (선택)
//   - id         : HTML의 id + label의 htmlFor 연결 (접근성)
//   - type       : 인풋 유형 (기본값 'text', 'password', 'email' 등)
//   - placeholder: 아무것도 입력 안 했을 때 표시되는 안내 텍스트
//   - value      : 현재 입력값 (부모 컴포넌트의 state와 연결)
//   - onChange   : 값이 변경될 때 실행할 함수
//   - ...props   : 나머지 모든 HTML input 속성을 그대로 전달 (스프레드)
//     예) required, disabled, autoFocus 등을 추가로 넣을 수 있음
//
// 📌 htmlFor란?
//   - HTML의 <label for="id">에 해당합니다.
//   - label을 클릭하면 연결된 id의 input으로 포커스가 이동합니다.
//   - React에서는 'for' 대신 'htmlFor'를 사용합니다. (for가 JS 예약어이므로)

import styles from './Input.module.css';

function Input({ label, id, type = 'text', placeholder, value, onChange, ...props }) {
  return (
    // inputGroup: label과 input을 감싸는 컨테이너
    <div className={styles.inputGroup}>
      {/* label이 있을 때만 표시 (조건부 렌더링) */}
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        {...props}
      />
    </div>
  );
}

export default Input;
