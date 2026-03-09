import clsx from 'clsx';
import styles from './DownloadCategories.module.css';

function DownloadCategories({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className={styles.categories}>
      {categories.map((category) => (
        <button
          key={category.id}
          className={clsx(
            styles.button,
            selectedCategory === category.value && styles.active
          )}
          onClick={() => onSelectCategory(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export default DownloadCategories;
