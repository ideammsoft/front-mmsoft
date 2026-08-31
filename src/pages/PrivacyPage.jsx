import styles from './PrivacyPage.module.css';

// 시행일. 방침을 고칠 때마다 함께 갱신한다.
const EFFECTIVE_DATE = '2026년 8월 31일';

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>개인정보처리방침</h1>
        <p className={styles.heroDesc}>
          엠엠소프트는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다.
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.intro}>
            엠엠소프트(이하 &lsquo;회사&rsquo;)는 「개인정보 보호법」 등 관련 법령에 따라 이용자의 개인정보를
            보호하고 이와 관련한 고충을 신속히 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. 수집하는 개인정보 항목 및 수집 방법</h2>
            <p className={styles.text}>회사는 서비스 제공에 필요한 최소한의 정보만을 수집합니다.</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>수집 항목</th>
                    <th>수집 방법</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>회원가입 (필수)</td>
                    <td>아이디, 비밀번호, 성명, 휴대전화번호, 이메일</td>
                    <td>홈페이지 가입 양식</td>
                  </tr>
                  <tr>
                    <td>회원가입 (선택)</td>
                    <td>회사명, 회사 전화번호</td>
                    <td>홈페이지 가입 양식</td>
                  </tr>
                  <tr>
                    <td>소셜 로그인</td>
                    <td>
                      네이버: 이름, 이메일, 별명<br />
                      구글: 이름, 이메일, 프로필<br />
                      카카오: 닉네임
                    </td>
                    <td>이용자가 동의한 범위 내에서 각 사업자로부터 제공</td>
                  </tr>
                  <tr>
                    <td>본인확인</td>
                    <td>중복가입확인정보(DI), 본인확인 결과</td>
                    <td>본인확인기관을 통한 인증 시</td>
                  </tr>
                  <tr>
                    <td>결제</td>
                    <td>주문번호, 결제금액, 상품명, 결제 결과</td>
                    <td>결제 진행 시 자동 수집</td>
                  </tr>
                  <tr>
                    <td>서비스 이용</td>
                    <td>접속 IP, 접속 일시, 서비스 이용 기록</td>
                    <td>서비스 이용 과정에서 자동 생성</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.note}>
              신용카드 번호 등 결제수단 정보는 결제대행사가 직접 처리하며, 회사는 이를 수집·보관하지 않습니다.
              또한 회사는 사상·신념, 건강 등 민감정보를 수집하지 않습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. 개인정보의 처리 목적</h2>
            <ul className={styles.list}>
              <li>회원 식별 및 가입 의사 확인, 회원제 서비스 제공</li>
              <li>소프트웨어 라이선스 발급 및 사용 기간 관리</li>
              <li>이용요금 결제, 정산 및 영수 내역 확인</li>
              <li>만료 안내, 공지사항 전달 등 고지사항 안내</li>
              <li>문의 접수 및 처리, 기술 지원</li>
              <li>부정 이용 방지 및 서비스 안정성 확보</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. 개인정보의 보유 및 이용 기간</h2>
            <p className={styles.text}>
              회사는 원칙적으로 <strong>회원 탈퇴 시 지체 없이 개인정보를 파기</strong>합니다.
              다만 관계 법령에서 정한 기간 동안에는 아래와 같이 보관합니다.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>보관 항목</th>
                    <th>보관 기간</th>
                    <th>근거 법령</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>계약 또는 청약철회 등에 관한 기록</td>
                    <td>5년</td>
                    <td>전자상거래 등에서의 소비자보호에 관한 법률</td>
                  </tr>
                  <tr>
                    <td>대금결제 및 재화 등의 공급에 관한 기록</td>
                    <td>5년</td>
                    <td>전자상거래 등에서의 소비자보호에 관한 법률</td>
                  </tr>
                  <tr>
                    <td>소비자 불만 또는 분쟁 처리에 관한 기록</td>
                    <td>3년</td>
                    <td>전자상거래 등에서의 소비자보호에 관한 법률</td>
                  </tr>
                  <tr>
                    <td>표시·광고에 관한 기록</td>
                    <td>6개월</td>
                    <td>전자상거래 등에서의 소비자보호에 관한 법률</td>
                  </tr>
                  <tr>
                    <td>서비스 접속 기록</td>
                    <td>3개월</td>
                    <td>통신비밀보호법</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. 개인정보의 제3자 제공</h2>
            <p className={styles.text}>
              회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 이용자가 사전에 동의한 경우,
              또는 법령에 따라 수사기관 등이 적법한 절차로 요구하는 경우에는 예외로 합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. 개인정보 처리의 위탁</h2>
            <p className={styles.text}>
              회사는 원활한 서비스 제공을 위하여 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>수탁업체</th>
                    <th>위탁 업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>주식회사 케이에스넷(KSNET)</td>
                    <td>신용카드 등 결제 처리 및 결제 결과 통지</td>
                  </tr>
                  <tr>
                    <td>알리고(Aligo)</td>
                    <td>회사가 발송하는 안내·공지 문자 및 알림톡 전송</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.text}>
              회사는 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고, 수탁업체가
              이를 준수하는지 감독합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. 이용자의 권리와 행사 방법</h2>
            <p className={styles.text}>
              이용자는 언제든지 본인의 개인정보를 조회·수정할 수 있으며, 회원 탈퇴를 통해 수집·이용 동의를
              철회할 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>홈페이지 로그인 후 회원정보 화면에서 직접 열람·정정</li>
              <li>아래 개인정보 보호책임자에게 서면·전화·이메일로 요청</li>
            </ul>
            <p className={styles.text}>
              이용자가 개인정보의 오류에 대해 정정을 요청한 경우, 회사는 정정을 완료하기 전까지 해당
              개인정보를 이용하거나 제공하지 않습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. 개인정보의 파기 절차 및 방법</h2>
            <p className={styles.text}>
              보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일 형태의
              정보는 복구가 불가능한 방법으로 영구 삭제하며, 종이에 출력된 정보는 분쇄하거나 소각합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. 개인정보의 안전성 확보 조치</h2>
            <ul className={styles.list}>
              <li>비밀번호 암호화 저장 및 전송 구간 암호화(HTTPS) 적용</li>
              <li>개인정보 처리 시스템에 대한 접근 권한 관리 및 접속 기록 보관</li>
              <li>개인정보 취급 담당자 최소화 및 정기적인 교육 실시</li>
              <li>백신 프로그램 등을 이용한 악성코드 대응</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. 개인정보 자동 수집 장치의 운영</h2>
            <p className={styles.text}>
              회사는 로그인 상태 유지 등 서비스 제공을 위해 쿠키 및 브라우저 저장소를 사용합니다. 이용자는
              웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인이 필요한 서비스 이용에
              제한이 있을 수 있습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. 개인정보 보호책임자</h2>
            <p className={styles.text}>
              개인정보 처리에 관한 문의, 불만 처리, 피해 구제 등에 관한 사항은 아래로 연락해 주시기 바랍니다.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>성명</th>
                    <td>이기성</td>
                  </tr>
                  <tr>
                    <th>연락처</th>
                    <td>02-864-7576</td>
                  </tr>
                  <tr>
                    <th>이메일</th>
                    <td>man@mmsoft.co.kr</td>
                  </tr>
                  <tr>
                    <th>주소</th>
                    <td>서울시 강서구 화곡로 416 더스카이밸리5차 1211호</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.text}>
              개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번 없이 118)</li>
              <li>개인정보 분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
              <li>대검찰청 사이버수사과 (www.spo.go.kr / 국번 없이 1301)</li>
              <li>경찰청 사이버수사국 (ecrm.police.go.kr / 국번 없이 182)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. 개인정보처리방침의 변경</h2>
            <p className={styles.text}>
              법령이나 서비스 내용의 변경에 따라 이 방침이 수정될 수 있습니다. 내용을 추가·삭제·수정하는
              경우에는 시행 7일 전부터 홈페이지 공지사항을 통해 알려 드립니다.
            </p>
          </section>

          <div className={styles.footerMeta}>
            <div>공고일자: {EFFECTIVE_DATE}</div>
            <div>시행일자: {EFFECTIVE_DATE}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
