import clsx from 'clsx';
import styles from './Button.module.css';

function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], styles[size])}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
