import { useState } from 'react';
import clsx from 'clsx';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projects';
import styles from './ProjectsPage.module.css';

function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProjects = PROJECTS.filter(project => {
    if (selectedCategory === 'all') return true;
    return project.category === selectedCategory;
  });

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>프로젝트 포트폴리오</h1>
          <p className={styles.heroSubtitle}>엠앰소프트가 진행한 프로젝트를 소개합니다</p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.filters}>
          {PROJECT_CATEGORIES.map(category => (
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

        <div className={styles.grid}>
          {filteredProjects.map(project => (
            <div key={project.id} className={styles.card}>
              <div className={styles.cardImage}>
                프로젝트 이미지
                <div className={styles.cardOverlay}>자세히 보기</div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.cardMeta}>
                  <span>고객사: {project.client}</span>
                  <span>{project.completedAt}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className={styles.empty}>
              해당 카테고리에 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
