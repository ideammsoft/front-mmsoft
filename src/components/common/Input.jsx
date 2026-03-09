import styles from './Input.module.css';

function Input({ label, id, type = 'text', placeholder, value, onChange, ...props }) {
  return (
    <div className={styles.inputGroup}>
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
