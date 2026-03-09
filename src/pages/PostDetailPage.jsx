import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaUser, FaCalendar, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { NOTICES } from '../data/notices';
import styles from './PostDetailPage.module.css';

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const notice = NOTICES.find(n => n.id === parseInt(postId));

  const handleDelete = () => {
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      alert('삭제되었습니다. (데모)');
      navigate('/community');
    }
  };

  const handleEdit = () => {
    alert('수정 기능 (데모)');
  };

  if (!notice) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>게시글을 찾을 수 없습니다</h1>
          <p className={styles.notFoundText}>
            요청하신 게시글이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link to="/community" className={styles.backButton}>
            <FaChevronLeft />
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          {notice.pinned && (
            <span className={styles.badge}>공지사항</span>
          )}
          <span className={styles.categoryTag}>{notice.category}</span>
          <h1 className={styles.title}>{notice.title}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <FaUser size={13} />
              {notice.author}
            </span>
            <span className={styles.metaItem}>
              <FaCalendar size={13} />
              {notice.date}
            </span>
            <span className={styles.metaItem}>
              <FaEye size={13} />
              조회 {notice.views}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <p>{notice.content}</p>
          <p>
            자세한 내용은 고객센터(1234-5678)로 문의하시거나
            카카오톡 상담을 이용해주시기 바랍니다.
          </p>
          <p>
            항상 저희 서비스를 이용해 주셔서 감사합니다.
          </p>
        </div>

        <div className={styles.footer}>
          <Link to="/community" className={styles.backButton}>
            <FaChevronLeft />
            목록으로
          </Link>
          <div className={styles.actions}>
            <button className={styles.editButton} onClick={handleEdit}>
              <FaEdit />
              수정
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              <FaTrash />
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
