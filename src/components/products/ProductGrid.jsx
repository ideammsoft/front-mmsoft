import { PRODUCTS } from '../../data/products';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

function ProductGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>제품 솔루션</h2>
        <p className={styles.subtitle}>
          비즈니스 관리를 위한 최적의 솔루션을 제공합니다
        </p>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
