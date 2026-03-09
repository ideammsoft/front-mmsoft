import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import clsx from 'clsx';
import styles from './FAQAccordion.module.css';

function FAQAccordion({ faqs }) {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div>
      {faqs.map((faq) => (
        <div key={faq.id} className={styles.item}>
          <button
            className={clsx(styles.question, openId === faq.id && styles.open)}
            onClick={() => toggleFAQ(faq.id)}
          >
            <span className={styles.questionText}>
              <span className={styles.badge}>Q</span>
              {faq.question}
            </span>
            <FaChevronDown
              className={clsx(styles.icon, openId === faq.id && styles.open)}
            />
          </button>
          <div className={clsx(styles.answer, openId === faq.id && styles.open)}>
            <div className={styles.answerContent}>
              <strong className={styles.answerLabel}>A.</strong> {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FAQAccordion;
