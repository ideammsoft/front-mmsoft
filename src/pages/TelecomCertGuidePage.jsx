import { Link } from 'react-router-dom';
import styles from './TelecomCertGuidePage.module.css';

const carriers = [
  {
    logo: 'https://cdn.aligo.kr/faq/20240124154830_65b0b2be67dbc.png',
    name: 'SKT',
    phones: ['국번 없이 100', '080-000-1618'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124154826_65b0b2ba8da8f.png',
    name: 'KT',
    phones: ['080-816-2000', '1600-2000'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124154834_65b0b2c2249ca.png',
    name: 'LGU+',
    phones: ['국번 없이 101', '1544-0001'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124171917_65b0c805db751.png',
    name: '알뜰폰 A',
    phones: ['1688-1000'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124172449_65b0c9513298b.png',
    name: '알뜰폰 B',
    phones: ['1533-7733'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124173412_65b0cb84e2a09.png',
    name: '알뜰폰 C',
    phones: ['070-8098-0114'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124180742_65b0d35eba79b.png',
    name: '알뜰폰 D',
    phones: ['국번 없이 106'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124174440_65b0cdf8e0ffa.png',
    name: '알뜰폰 E',
    phones: ['1661-3311'],
  },
  {
    logo: 'https://cdn.aligo.kr/faq/20240124181028_65b0d404372bd.png',
    name: '알뜰폰 F',
    phones: ['070-8100-1000'],
  },
];

export default function TelecomCertGuidePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>통신서비스 이용증명원 발급 방법</h1>
        <p className={styles.heroDesc}>발신번호 등록에 필요한 서류를 통신사에서 발급받는 방법을 안내합니다.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>통신사별 발급 연락처</h2>
            <p className={styles.sectionDesc}>
              등록하려는 발신번호가 가입된 통신사에 연락하여 <strong>통신서비스 이용증명원</strong>을 발급받으세요.
            </p>
            <div className={styles.carrierGrid}>
              {carriers.map((c) => (
                <div key={c.name} className={styles.carrierCard}>
                  <div className={styles.carrierLogo}>
                    <img src={c.logo} alt={c.name} />
                  </div>
                  <div className={styles.carrierPhones}>
                    {c.phones.map((p) => <strong key={p}>{p}</strong>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>발신번호 사전등록이란?</h2>
            <div className={styles.lawBox}>
              전기통신사업법 제84조2(전화번호의 거짓표시 금지 및 이용자 보호)에 의거,
              거짓으로 표시된 전화번호로 인한 이용자 피해 예방을 위해
              고객이 사전에 등록한 발신번호로만 문자 발송이 가능하도록 하는 제도입니다.
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>서류 제출 시 유의사항</h2>
            <ul className={styles.checkList}>
              <li>발급일자가 <strong>최근 1개월 이내</strong>인 서류만 인정됩니다.</li>
              <li>
                <strong>가입자 정보</strong>(가입번호, 가입자명, 개통일자, 발급일자)가
                가려진 정보 없이 기재되어야 하며, <strong>서류 잘린 부분 없이</strong> 첨부해 주세요.
              </li>
              <li>
                발신번호 신청 후 검수 및 승인은 <strong>평일 업무시간 내(10시~17시)</strong> 순차적으로 진행됩니다.
                <span className={styles.sub}> (평균 1~3시간 소요)</span>
              </li>
            </ul>
          </section>

          <div className={styles.backWrap}>
            <Link to="/sms-service" className={styles.backBtn}>← 발신번호 등록 신청으로 돌아가기</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
