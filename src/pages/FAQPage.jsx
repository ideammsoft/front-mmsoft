import { useState } from 'react';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import { FAQS, FAQ_CATEGORIES } from '../data/faqs';
import FAQAccordion from '../components/faq/FAQAccordion';
import styles from './FAQPage.module.css';

function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>자주 묻는 질문</h1>
          <p className={styles.heroSubtitle}>고객님들께서 자주 문의하시는 내용을 정리했습니다</p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="궁금한 내용을 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {FAQ_CATEGORIES.map(category => (
            <button
              key={category.id}
              className={clsx(
                styles.filterButton,
                selectedCategory === category.value && styles.filterButtonActive
              )}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <FAQAccordion faqs={filteredFAQs} />

        {filteredFAQs.length === 0 && (
          <div className={styles.empty}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQPage;
